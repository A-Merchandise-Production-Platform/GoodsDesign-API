import { AlgorithmService } from '@/algorithm/algorithm.service';
import { FactoryEntity } from '@/factory/entities/factory.entity';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { async, lastValueFrom } from 'rxjs';
import { envConfig } from 'src/dynamic-modules';
import { PrismaService } from 'src/prisma';
import { RedisService } from 'src/redis/redis.service';
import { CalculateShippingFeeDto } from './dto/calculate-shipping-fee.dto';
import { DistrictResponse, formatDistricts } from './dto/district.dto';
import { OrderInfoDto } from './dto/order-info.dto';
import {
  formatProvinces,
  ProvinceResponse,
} from './dto/province.dto';
import { formatWards, WardResponse } from './dto/ward.dto';
import { District, Province, ShippingFee, ShippingOrder, ShippingService as ShippingServiceModel, Ward } from './models/shipping.model';
import { timeout } from 'rxjs/operators';

@Injectable()
export class ShippingService implements OnModuleInit {
  private readonly baseUrl: string;
  private readonly token: string;
  private readonly shopId: string;
  private readonly logger = new Logger(ShippingService.name);

  private readonly ENDPOINTS = {
    PROVINCE: '/shiip/public-api/master-data/province',
    DISTRICT: '/shiip/public-api/master-data/district',
    WARD: '/shiip/public-api/master-data/ward',
    AVAILABLE_SERVICES: '/shiip/public-api/v2/shipping-order/available-services',
    CALCULATE_FEE: '/shiip/public-api/v2/shipping-order/fee',
    CREATE_ORDER: '/shiip/public-api/v2/shipping-order/create',
    ORDER_INFO: '/shiip/public-api/v2/shipping-order/detail'
  };

  constructor(
    private readonly httpService: HttpService,
    private readonly redisService: RedisService,
    private readonly prisma: PrismaService,
    private readonly algorithmService: AlgorithmService
  ) {
    this.baseUrl = envConfig().shipping.baseUrl;
    this.token = envConfig().shipping.token;
    this.shopId = envConfig().shipping.shopId;
  }
  async onModuleInit() {
    this.logger.log('Initializing shipping service cache...');
    
    try {
      // Cache provinces
      const provincesCacheKey = 'shipping:provinces';
      const provincesCached = await this.redisService.getCache(provincesCacheKey);
      if (!provincesCached) {
        this.logger.log('Caching provinces data...');
        await this.getProvinces();
        this.logger.log('Provinces data cached successfully');
      } else {
        this.logger.log('Provinces data already cached');
      }

      // Cache districts for all provinces
      const provinces = await this.getProvinces();
      this.logger.log(`Caching districts for ${provinces.length} provinces...`);
      for (const province of provinces) {
        const districtsCacheKey = `shipping:districts:${province.provinceId}`;
        const districtsCached = await this.redisService.getCache(districtsCacheKey);
        if (!districtsCached) {
          await this.getDistricts(province.provinceId);
          this.logger.debug(`Cached districts for province ${province.provinceName}`);
        }
      }
      this.logger.log('Districts data cached successfully');

      // Cache wards for all districts
      this.logger.log('Caching wards data...');
      for (const province of provinces) {
        const districts = await this.getDistricts(province.provinceId);
        for (const district of districts) {
          const wardsCacheKey = `shipping:wards:${district.districtId}`;
          const wardsCached = await this.redisService.getCache(wardsCacheKey);
          if (!wardsCached) {
            await this.getWards(district.districtId);
            this.logger.debug(`Cached wards for district ${district.districtName}`);
          }
        }
      }
      this.logger.log('Wards data cached successfully');

      this.logger.log('Shipping service cache initialization completed');
    } catch (error) {
      this.logger.error('Error initializing shipping service cache:', error);
      throw error;
    }
  }

  private getHeaders() {
    return {
      Token: this.token,
      ShopId: this.shopId,
      'User-Agent': 'Mozilla/5.0',
      Accept: 'application/json',
      Referer: this.baseUrl,
      Origin: this.baseUrl,
    };
  }

  private async handleRequest<T>(url: string, params = {}, method: 'GET' | 'POST' = 'GET', body = null): Promise<T> {
    try {
      const config = {
        headers: this.getHeaders(),
        params: method === 'GET' ? params : undefined,
      };

      const request = method === 'GET' 
        ? this.httpService.get(this.baseUrl + url, config)
        : this.httpService.post(this.baseUrl + url, body, config);

      const response = await lastValueFrom(request);
      return response.data.data;
    } catch (error) {
      throw new Error(`Shipping API error: ${error?.response?.data?.message}`);
    }
  }

  async getProvinces(): Promise<Province[]> {
    try {
      const cacheKey = 'shipping:provinces';
      const cached = await this.redisService.getCache(cacheKey);

      if (cached) {
        return JSON.parse(cached)
      }

      const provinces = await this.handleRequest<ProvinceResponse[]>(this.ENDPOINTS.PROVINCE);

      await this.redisService.setCache(
        cacheKey,
        JSON.stringify(formatProvinces(provinces)),
        60 * 60 * 24 * 7
      ); // 7 days

      return formatProvinces(provinces);
    } catch (error) {
      console.error("[getProvinces] error: ", error);
      return [];
    }
  }

  async getDistricts(provinceId: number): Promise<District[]> {
    try{
      const cacheKey = `shipping:districts:${provinceId}`;
    const cached = await this.redisService.getCache(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const districts = await this.handleRequest<DistrictResponse[]>(
      this.ENDPOINTS.DISTRICT,
      { province_id: provinceId }
    );

    await this.redisService.setCache(
      cacheKey,
      JSON.stringify(formatDistricts(districts)),
      60 * 60 * 24 * 7
    );

      return formatDistricts(districts);
    } catch (error) {
      console.error("[getDistricts] error: ", error);
      return [];
    }
  }

  async getWards(districtId: number): Promise<Ward[]> {
    try{
      const cacheKey = `shipping:wards:${districtId}`;
      const cached = await this.redisService.getCache(cacheKey);

      if (cached) {
        return JSON.parse(cached);
      }

      // Use httpService.get directly with timeout
      let wards: WardResponse[] | null = null;
      try {
        const response = await lastValueFrom(
          this.httpService.get(this.baseUrl + this.ENDPOINTS.WARD, {
            headers: this.getHeaders(),
            params: { district_id: districtId }
          }).pipe(timeout(3000))
        );
        wards = response.data.data;
      } catch (err) {
        if (err.name === 'TimeoutError') {
          return [];
        }
        throw err;
      }

      if (wards === null) {
        return [];
      }

      await this.redisService.setCache(
        cacheKey,
        JSON.stringify(formatWards(wards)),
        60 * 60 * 24 * 7
      );

      return formatWards(wards);
    } catch (error) {
      console.error("[getWards] error: ", error);
      return [];
    }
  }

  async getAvailableServices(fromDistrict: number, toDistrict: number): Promise<ShippingServiceModel[]> {
    try{
      const cacheKey = `shipping:services:${fromDistrict}:${toDistrict}`;
    const cached = await this.redisService.getCache(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const services = await this.handleRequest<any[]>(
      this.ENDPOINTS.AVAILABLE_SERVICES,
      {
        shop_id: this.shopId,
        from_district: fromDistrict,
        to_district: toDistrict,
      }
    );

    const formattedServices = services.map(service => ({
      serviceId: service.service_id,
      shortName: service.short_name,
      serviceTypeId: service.service_type_id,
    }));

    await this.redisService.setCache(
      cacheKey,
      JSON.stringify(formattedServices),
      60 * 60 * 24 * 7
    );

      return formattedServices as unknown as ShippingServiceModel[];
    } catch (error) {
      console.error("[getAvailableServices] error: ", error);
      return [];
    }
  }

  async getProvince(provinceId: number): Promise<Province | null> {
    try {
      const cacheKey = `shipping:province:${provinceId}`;
      const cached = await this.redisService.getCache(cacheKey);

      if (cached) {
        return JSON.parse(cached);
      }

      const provinces = await this.getProvinces();
      const province = provinces.find(p => p.provinceId === provinceId);
      
      if (!province) {
        throw new Error(`Province with ID ${provinceId} not found`);
      }

      await this.redisService.setCache(cacheKey, JSON.stringify(province), 60 * 60 * 24 * 7);
      return province;
    } catch (error) {
      return null;
    }
  }

  async getDistrict(districtId: number): Promise<District> {
    const cacheKey = `shipping:district:${districtId}`;
    const cached = await this.redisService.getCache(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    // Get all provinces to find the matching district
    const provinces = await this.getProvinces();
    for (const province of provinces) {
      const districts = await this.getDistricts(province.provinceId);
      const district = districts.find(d => d.districtId === districtId);
      if (district) {
        await this.redisService.setCache(cacheKey, JSON.stringify(district), 60 * 60 * 24 * 7);
        return district;
      }
    }
    throw new Error(`District with ID ${districtId} not found`);
  }

  async getWard(wardCode: string): Promise<Ward> {
    const cacheKey = `shipping:ward:${wardCode}`;
    const cached = await this.redisService.getCache(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    // Get all provinces and districts to find the matching ward
    const provinces = await this.getProvinces();
    for (const province of provinces) {
      const districts = await this.getDistricts(province.provinceId);
      for (const district of districts) {
        const wards = await this.getWards(district.districtId);
        const ward = wards.find(w => w.wardCode === wardCode);
        if (ward) {
          await this.redisService.setCache(cacheKey, JSON.stringify(ward), 60 * 60 * 24 * 7);
          return ward;
        }
      }
    }
    throw new Error(`Ward with ID ${wardCode} not found`);
  }

  async calculateShippingFee(input: CalculateShippingFeeDto): Promise<ShippingFee> {
    // return 20000
    // const r: ShippingFee ={
    //   total: 20000,
    // } 
    // return r
    const body = {
      service_id: input.serviceId,
      service_type_id: input.serviceTypeId,
      from_district_id: input.fromDistrictId,
      from_ward_code: input.fromWardCode,
      to_district_id: input.toDistrictId,
      to_ward_code: input.toWardCode,
      weight: input.weight,
      length: input.length,
      width: input.width,
      height: input.height
    };

    console.log(body)

    const response = await this.handleRequest<any>(
      this.ENDPOINTS.CALCULATE_FEE,
      {},
      'POST',
      body
    );

    console.log("[calculateShippingFee] response: ", response)

    return {
      total: response.total,
    };
  }

  async createShippingOrder(orderId: string): Promise<ShippingOrder> {
    // Get order with all necessary relations in a single query
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderDetails: {
          include: {
            design: {
              include: {
                designPositions: {
                  include: {
                    positionType: {
                      include: {
                        product: true
                      }
                    }
                  }
                }
              }
            }
          }
        },
        customer: {
          include: {
            addresses: true
          }
        },
        factory: {
          include: {
            address: true
          }
        }
      }
    });

    if (!order) {
      throw new Error(`Order with ID ${orderId} not found`);
    }

    if (!order.customer) {
      throw new Error(`Customer with ID ${order.customerId} not found`);
    }

    const orderAddress = order.customer.addresses[0];
    if (!orderAddress) {
      throw new Error(`Customer ${order.customerId} has no address`);
    }

    if (!order.factory) {
      throw new Error(`Factory with ID ${order.factoryId} not found`);
    }

    if (!order.factory.address) {
      throw new Error(`Factory address not found`);
    }

    // Prepare items for shipping
    const items = order.orderDetails.map(detail => {
      const design = detail.design;
      const product = design.designPositions[0]?.positionType?.product;
      
      return {
        name: product?.name || "Sản phẩm",
        code: design.id,
        quantity: detail.quantity,
        price: detail.price,
        weight: product?.weight || 120,
        length: product?.length || 70,
        width: product?.width || 30,
        height: product?.height || 1,
        category: {
          level1: product?.categoryId || "Áo"
        }
      };
    });

    // Calculate total weight and dimensions
    const totalWeight = items.reduce((total, item) => total + (item.weight * item.quantity), 0);
    const totalDimensions = items.reduce((acc, item) => ({
      length: Math.max(acc.length, item.length),
      width: Math.max(acc.width, item.width),
      height: Math.max(acc.height, item.height * item.quantity)
    }), { length: 0, width: 0, height: 0 });

    // Get location information in parallel
    // const [fromProvince, fromDistrictName, fromWardName] = await Promise.all([
    //   this.getProvince(order.factory.address.provinceID),
    //   this.getDistrict(order.factory.address.districtID),
    //   this.getWard(order.factory.address.wardCode)
    // ]);

    const fromProvince = await this.getProvince(order.factory.address.provinceID);
    const fromDistrictName = await this.getDistrict(order.factory.address.districtID);
    const fromWardName = await this.getWard(order.factory.address.wardCode);


    const body = {
      payment_type_id: 2,
      note: `Đơn hàng #${order.id}`,
      required_note: "KHONGCHOXEMHANG",
      from_name: "GoodsDesign",
      from_phone: "0981331633",
      from_address: order.factory.address.formattedAddress,
      from_ward_name: fromWardName.wardName,
      from_district_name: fromDistrictName.districtName,
      from_province_name: fromProvince.provinceName,
      return_phone: "0332190444",
      return_address: "39 NTT",
      return_district_id: null,
      return_ward_code: "",
      client_order_code: order.id,
      to_name: order.customer.name || "Khách hàng",
      to_phone: order.customer.phoneNumber || "0902331633",
      to_address: orderAddress.formattedAddress,
      to_ward_code: orderAddress.wardCode,
      to_district_id: orderAddress.districtID,
      cod_amount: 0,
      content: `Đơn hàng #${order.id} từ GoodsDesign`,
      weight: totalWeight,
      length: totalDimensions.length > 150 ? 150 : totalDimensions.length,
      width: totalDimensions.width > 150 ? 150 : totalDimensions.width,
      height: totalDimensions.height > 150 ? 150 : totalDimensions.height,
      pick_station_id: 1444,
      deliver_station_id: null,
      insurance_value: 0,
      service_id: 0,
      service_type_id: 2,
      coupon: null,
      pick_shift: [1],
      items: items
    };

    try {
      const response = await this.handleRequest<any>(
        this.ENDPOINTS.CREATE_ORDER,
        {},
        'POST',
        body
      );

      console.log("response", response);

      return {
        code: 200,
        message: "Success",
        orderCode: response?.order_code || null
      };
    } catch (error) {
      throw new Error(`Failed to create shipping order: ${error.message}`);
    }
  }

  async calculateShippingCostAndFactoryForCart(cartIds: string[] = [], addressId: string): Promise<{
    shippingFee: ShippingFee;
    selectedFactory: FactoryEntity | null;
  }> {
    const startTime = performance.now();
    this.logger.log(`Starting shipping cost calculation for cart items: ${cartIds.join(', ')}`);

    try {
      if (!cartIds.length) {
        throw new Error('No cart items provided');
      }

      if (!addressId) {
        throw new Error('No shipping address provided');
      }

      // Get cart items and shipping address in parallel
      const cartItems = await this.prisma.cartItem.findMany({
        where: { id: { in: cartIds } },
        include: {
          design: {
            include: {
              designPositions: {
                include: {
                  positionType: {
                    include: { product: true }
                  }
                }
              }
            }
          },
          systemConfigVariant: true
        }
      })
      
      const shippingAddress = await this.prisma.address.findUnique({
        where: { id: addressId }
      })

      const queryTime = performance.now() - startTime;
      this.logger.debug(`Database queries completed in ${queryTime.toFixed(2)}ms`);

      if (cartItems.length === 0) {
        throw new Error('No cart items found');
      }

      if (!shippingAddress) {
        throw new Error(`Shipping address with ID ${addressId} not found`);
      }

      // Extract variant IDs and find best factory
      const variantIds = [...new Set(cartItems.map(item => item.systemConfigVariantId))];
      this.logger.debug(`Processing ${variantIds.length} unique variants`);

      const selectedFactory = await this.algorithmService.findBestFactoryForVariants(variantIds);
      if (!selectedFactory) {
        throw new Error('No suitable factory found for the cart items');
      }

      const factoryAddress = selectedFactory.address;
      if (!factoryAddress) {
        throw new Error('Factory address not found');
      }

      // Get location information in parallel
      const fromDistrict = await this.getDistrict(factoryAddress.districtID);
      const fromWard = await this.getWard(factoryAddress.wardCode);
      const toDistrict = await this.getDistrict(shippingAddress.districtID);
      const toWard = await this.getWard(shippingAddress.wardCode);

      const locationTime = performance.now() - startTime - queryTime;
      this.logger.debug(`Location data retrieved in ${locationTime.toFixed(2)}ms`);

      // Calculate dimensions and weight
      const items = cartItems.map(item => {
        const design = item.design;
        const product = design.designPositions[0]?.positionType?.product;
        
        return {
          quantity: item.quantity,
          weight: product?.weight || 120,
          length: product?.length || 70,
          width: product?.width || 30,
          height: product?.height || 1
        };
      });

      const totalWeight = items.reduce((total, item) => total + (item.weight * item.quantity), 0);
      const totalDimensions = items.reduce((acc, item) => ({
        length: Math.max(acc.length, item.length),
        width: Math.max(acc.width, item.width),
        height: Math.max(acc.height, item.height * item.quantity)
      }), { length: 0, width: 0, height: 0 });

      // Calculate shipping fee
      const shippingFee = await this.calculateShippingFee({
        serviceId: 53321,
        serviceTypeId: 2,
        fromDistrictId: fromDistrict.districtId,
        fromWardCode: fromWard.wardCode,
        toDistrictId: toDistrict.districtId,
        toWardCode: toWard.wardCode,
        weight: totalWeight,
        length: totalDimensions.length,
        width: totalDimensions.width,
        height: totalDimensions.height
      });

      const totalTime = performance.now() - startTime;
      this.logger.log(`Shipping cost calculation completed in ${totalTime.toFixed(2)}ms`);

      return {
        shippingFee,
        selectedFactory
      };
    } catch (error) {
      const errorTime = performance.now() - startTime;
      this.logger.error(
        `Error calculating shipping cost (took ${errorTime.toFixed(2)}ms): ${error.message}`,
        error.stack
      );
      throw new Error(`Error calculating shipping cost and factory: ${error.message}`);
    }
  }

  async getOrderInfo(orderCode: string): Promise<OrderInfoDto> {
    try {
      const response = await this.handleRequest<OrderInfoDto>(
        this.ENDPOINTS.ORDER_INFO,
        {},
        'POST',
        { order_code: orderCode }
      );

      return response;
    } catch (error) {
      throw new Error(`Error getting order info: ${error.message}`);
    }
  }
} 