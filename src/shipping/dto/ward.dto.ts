export interface WardResponse {
  WardCode: string;
  WardName: string;
  DistrictID: number;
}

export function formatWards(wards: WardResponse[]) {
  return wards.map(ward => ({
    wardCode: ward.WardCode,
    wardName: ward.WardName,
    districtId: ward.DistrictID
  }));
} 