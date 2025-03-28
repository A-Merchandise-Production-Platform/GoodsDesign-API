import { Province } from "../models/shipping.model"

export interface ProvinceResponse {
    ProvinceName: string
    ProvinceID: number
}

export function formatProvinces(provinces: ProvinceResponse[]) {
    const sortedProvinces = provinces.sort((a, b) => a.ProvinceName.localeCompare(b.ProvinceName))

    return sortedProvinces.map((province) => ({
        provinceName: province.ProvinceName,
        provinceId: province.ProvinceID
    }))
}
