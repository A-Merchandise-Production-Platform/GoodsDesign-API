export interface DistrictResponse {
  DistrictID: number;
  DistrictName: string;
  ProvinceID: number;
}

export function formatDistricts(districts: DistrictResponse[]) {
  if(!districts) {
    return []
  }
  return districts.map(district => ({
    districtId: district.DistrictID,
    districtName: district.DistrictName,
    provinceId: district.ProvinceID
  }));
} 