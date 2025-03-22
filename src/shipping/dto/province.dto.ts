import { Province } from "../models/shipping.model";

export interface ProvinceResponse {
    ProvinceName: string;
    ProvinceID: number;
}

export function formatProvinces(provinces: ProvinceResponse[]) {
    return provinces.map(province => ({
        provinceName: province.ProvinceName,
        provinceId: province.ProvinceID
    }));
}
