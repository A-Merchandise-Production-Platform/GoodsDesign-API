export interface DistrictResponse {
  DistrictID: number;
  DistrictName: string;
  ProvinceID: number;
}

export function formatDistricts(districts: DistrictResponse[]) {
  return districts.map(district => ({
    districtId: district.DistrictID,
    districtName: district.DistrictName,
    provinceId: district.ProvinceID
  }));
} 