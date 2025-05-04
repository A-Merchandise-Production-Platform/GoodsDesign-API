import { AlgorithmService } from '@/algorithm/algorithm.service';
import { FactoryEntity } from '@/factory/entities/factory.entity';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { envConfig } from 'src/dynamic-modules';
import { PrismaService } from 'src/prisma';
import { RedisService } from 'src/redis/redis.service';
import { CalculateShippingFeeDto } from './dto/calculate-shipping-fee.dto';
import { DistrictResponse, formatDistricts } from './dto/district.dto';
import {
  formatProvinces,
  ProvinceResponse,
} from './dto/province.dto';
import { formatWards, WardResponse } from './dto/ward.dto';
import { District, Province, ShippingFee, ShippingOrder, ShippingService as ShippingServiceModel, Ward } from './models/shipping.model';

@Injectable()
export class ShippingService {
  private readonly baseUrl: string;
  private readonly token: string;
  private readonly shopId: string;

  private readonly ENDPOINTS = {
    PROVINCE: '/shiip/public-api/master-data/province',
    DISTRICT: '/shiip/public-api/master-data/district',
    WARD: '/shiip/public-api/master-data/ward',
    AVAILABLE_SERVICES: '/shiip/public-api/v2/shipping-order/available-services',
    CALCULATE_FEE: '/shiip/public-api/v2/shipping-order/fee',
    CREATE_ORDER: '/shiip/public-api/v2/shipping-order/create'
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
      );

      return formatProvinces(provinces);
    } catch (error) {
      return [];
    }
  }

  async getDistricts(provinceId: number): Promise<District[]> {
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
    );

    return formatDistricts(districts);
  }

  async getWards(districtId: number): Promise<Ward[]> {
    const cacheKey = `shipping:wards:${districtId}`;
    const cached = await this.redisService.getCache(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const wards = await this.handleRequest<WardResponse[]>(
      this.ENDPOINTS.WARD,
      { district_id: districtId }
    );

    if (wards === null) {
      return [];
    }

    await this.redisService.setCache(
      cacheKey,
      JSON.stringify(formatWards(wards)),
    );

    return formatWards(wards);
  }

  async getAvailableServices(fromDistrict: number, toDistrict: number): Promise<ShippingServiceModel[]> {
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
    );

    return formattedServices as unknown as ShippingServiceModel[];
  }

  async getProvince(provinceId: number): Promise<Province | null> {
    try {
      const provinces = await this.getProvinces();
      const province = provinces.find(p => p.provinceId === provinceId);
      if (!province) {
        throw new Error(`Province with ID ${provinceId} not found`);
      }
      return province;
    } catch (error) {
      return null;
    }
  }

  async getDistrict(districtId: number): Promise<District> {
    // Get all provinces to find the matching district
    const provinces = await this.getProvinces();
    for (const province of provinces) {
      const districts = await this.getDistricts(province.provinceId);
      const district = districts.find(d => d.districtId === districtId);
      if (district) {
        return district;
      }
    }
    throw new Error(`District with ID ${districtId} not found`);
  }

  async getWard(wardCode: string): Promise<Ward> {
    // Check if wardCode is valid from redis
    const cacheKey = `shipping:wards:${wardCode}`;
    const cached = await this.redisService.getCache(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    // Get all provinces and districts to find the matching war
    const provinces = await this.getProvinces();
    for (const province of provinces) {
      const districts = await this.getDistricts(province.provinceId);
      for (const district of districts) {
        const wards = await this.getWards(district.districtId);
        const ward = wards.find(w => w.wardCode === wardCode);
        if (ward) {
          return ward;
        }
      }
    }
    throw new Error(`Ward with ID ${wardCode} not found`);
  }

  async calculateShippingFee(input: CalculateShippingFeeDto): Promise<ShippingFee> {
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

    return {
      total: response.total,
    };
  }

  async createShippingOrder(orderId: string): Promise<ShippingOrder> {
    const order = await this.prisma.order.findUnique({
      where: {
        id: orderId
      },
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
        } 
      }
    });

    if (!order) {
      throw new Error(`Order with ID ${orderId} not found`);
    }

    // Get customer information
    const customer = await this.prisma.user.findUnique({
      where: {
        id: order.customerId
      }
    });

    if (!customer) {
      throw new Error(`Customer with ID ${order.customerId} not found`);
    }
    let orderAddress = await this.prisma.address.findFirst({
      where: {
        userId: order.customerId
      }
    });

    if(orderAddress == null) {
      //check if user has address
      const address = await this.prisma.address.findFirst({
        where: {
          userId: order.customerId
        }
      });
      
      if(!address) {
        throw new Error(`Customer ${order.customerId} has no address`);
      }

      orderAddress = address
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

    // Calculate total weight (assuming each item is 1200g)
    const totalWeight = items.reduce((total, item) => total + (item.weight * item.quantity), 0);
    const totalHeight = items.reduce((total, item) => total + (item.height * item.quantity), 0);

    //get factory address
    const factory = await this.prisma.factory.findFirst({
      where: {
        owner: {
          id: order.factoryId
        }
      }
    });

    if(!factory) {
      throw new Error(`Factory with ID ${order.customerId} not found`);
    }
    
    const factoryAddress = await this.prisma.address.findFirst({
      where: {
        id: factory.addressId
      }
    });

    if(!factoryAddress) {
      throw new Error(`Factory address with ID ${factory.addressId} not found`);
    }
    
    const fromProvince = await this.getProvince(factoryAddress.provinceID);
    const fromDistrictName = await this.getDistrict(factoryAddress.districtID);
    const fromWardName = await this.getWard(factoryAddress.wardCode);

    const totalDimensions = items.reduce((acc, item) => {
      // For multiple items, we need to consider how they'll be packed
      // Here we're using a simple approach where we take the maximum dimensions
      // and multiply length by quantity (assuming items are stacked lengthwise)
      return {
        length: Math.max(acc.length, item.length),
        width: Math.max(acc.width, item.width),
        height: Math.max(acc.height, item.height * item.quantity)
      };
    }, { length: 0, width: 0, height: 0 });
    
    const body = {
      payment_type_id: 2,
      note: `Đơn hàng #${order.id}`,
      required_note: "KHONGCHOXEMHANG",
      from_name: "GoodsDesign",
      from_phone: "0981331633",
      from_address: factoryAddress.formattedAddress,
      from_ward_name: fromWardName.wardName,
      from_district_name: fromDistrictName.districtName,
      from_province_name: fromProvince.provinceName,
      return_phone: "0332190444",
      return_address: "39 NTT",
      return_district_id: null,
      return_ward_code: "",
      client_order_code: order.id,
      to_name: customer.name || "Khách hàng",
      to_phone: customer.phoneNumber || "0902331633",
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
      orderCode: response.order_code,
      sortCode: response.sort_code,
      transType: response.trans_type,
      wardEncode: response.ward_encode,
      districtEncode: response.district_encode,
      expectedDeliveryTime: response.expected_delivery_time,
      totalFee: response.total_fee,
      fee: {
        coupon: response.fee.coupon,
        insurance: response.fee.insurance,
        main_service: response.fee.main_service,
        r2s: response.fee.r2s,
        return: response.fee.return,
        station_do: response.fee.station_do,
        station_pu: response.fee.station_pu
      }
    };
  }

  async calculateShippingCostAndFactoryForCart(cartIds: string[] = [], addressId: string): Promise<{
    shippingFee: ShippingFee;
    selectedFactory: FactoryEntity | null;
  }> {
    try {
      // Get cart items with their details
      const cartItems = await this.prisma.cartItem.findMany({
        where: {
          id: {
            in: cartIds
          }
        },
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
          },
          systemConfigVariant: true
        }
      });

      if (cartItems.length === 0) {
        throw new Error('No cart items found');
      }

      // Get shipping address
      const shippingAddress = await this.prisma.address.findUnique({
        where: { id: addressId }
      });

      if (!shippingAddress) {
        throw new Error(`Shipping address with ID ${addressId} not found`);
      }

      // Extract variant IDs from cart items
      const variantIds = cartItems.map(item => item.systemConfigVariantId);
      const uniqueVariantIds = [...new Set(variantIds)];

      // Use the algorithm service to find the best factory
      const selectedFactory = await this.algorithmService.findBestFactoryForVariants(uniqueVariantIds);

      if (!selectedFactory) {
        throw new Error('No suitable factory found for the cart items');
      }

      const factoryAddress = selectedFactory.address

      if (!factoryAddress) {
        throw new Error('Factory address not found');
      }

      const fromDistrict = await this.getDistrict(factoryAddress.districtID);
      const fromWard = await this.getWard(factoryAddress.wardCode);

      const toDistrict = await this.getDistrict(shippingAddress.districtID);
      const toWard = await this.getWard(shippingAddress.wardCode);

      // Calculate total weight and dimensions
      const items = cartItems?.map(item => {
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

      // Calculate total dimensions
      const totalDimensions = items.reduce((acc, item) => {
        // For multiple items, we need to consider how they'll be packed
        // Here we're using a simple approach where we take the maximum dimensions
        // and multiply length by quantity (assuming items are stacked lengthwise)
        return {
          length: Math.max(acc.length, item.length),
          width: Math.max(acc.width, item.width),
          height: Math.max(acc.height, item.height * item.quantity)
        };
      }, { length: 0, width: 0, height: 0 });

      // Get available shipping services
      const availableServices = await this.getAvailableServices(
        fromDistrict.districtId,
        toDistrict.districtId
      );

      if (availableServices.length === 0) {
        throw new Error('No shipping services available for this route');
      }

      // Use the first available service
      const selectedService = availableServices[0];

      console.log("totalDimensions", totalDimensions)

      // Calculate shipping fee
      const shippingFee = await this.calculateShippingFee({
        serviceId: selectedService.serviceId,
        serviceTypeId: selectedService.serviceTypeId,
        fromDistrictId: fromDistrict.districtId,
        fromWardCode: fromWard.wardCode,
        toDistrictId: toDistrict.districtId,
        toWardCode: toWard.wardCode,
        weight: totalWeight,
        length: totalDimensions.length,
        width: totalDimensions.width,
        height: totalDimensions.height
      });

      return {
        shippingFee,
        selectedFactory
      };
    } catch (error) {
      throw new Error(`Error calculating shipping cost and factory: ${error.message}`);
    }
  }
} 