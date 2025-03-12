interface PositionType {
  id: string;
  productId: string;
  positionName: string;
  basePrice: number;
}

interface PositionTypesData {
  positionTypes: PositionType[];
}

export const positionTypesData: PositionTypesData = {
  positionTypes: [
    {
      id: "front001",
      productId: "prod001",
      positionName: "Front",
      basePrice: 10.0,
    },
    {
      id: "back001",
      productId: "prod001",
      positionName: "Back",
      basePrice: 10.0,
    },
    {
      id: "leftSleeve001",
      productId: "prod001",
      positionName: "Left Sleeve",
      basePrice: 5.0,
    },
    {
      id: "rightSleeve001",
      productId: "prod001",
      positionName: "Right Sleeve",
      basePrice: 5.0,
    },
  ],
};
