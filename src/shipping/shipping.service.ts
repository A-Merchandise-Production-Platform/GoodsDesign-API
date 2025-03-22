import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { envConfig } from 'src/dynamic-modules';
import { RedisService } from 'src/redis/redis.service';
import { lastValueFrom } from 'rxjs';
import { Province, District, Ward, ShippingService as ShippingServiceModel, ShippingFee } from './models/shipping.model';
import { 
  formatProvinces, 
  ProvinceResponse,
} from './dto/province.dto';
import { DistrictResponse, formatDistricts } from './dto/district.dto';
import { WardResponse } from './dto/ward.dto';
import { formatWards } from './dto/ward.dto';
import { CalculateShippingFeeDto } from './dto/calculate-shipping-fee.dto';

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
    CALCULATE_FEE: '/shiip/public-api/v2/shipping-order/fee'
  };

  constructor(
    private readonly httpService: HttpService,
    private readonly redisService: RedisService,
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

  async getProvince(provinceId: number): Promise<Province> {
    const provinces = await this.getProvinces();
    const province = provinces.find(p => p.provinceId === provinceId);
    if (!province) {
      throw new Error(`Province with ID ${provinceId} not found`);
    }
    return province;
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
} 