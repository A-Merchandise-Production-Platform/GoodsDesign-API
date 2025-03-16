interface BlankInformation {
  size: string;
  color: string;
  material: string;
  stock: number;
}

interface BlankVariance {
  id: string;
  productId: string;
  information: BlankInformation;
  blankPrice: number;
}

interface BlankVariancesData {
  blankVariances: BlankVariance[];
}

export const blankVariancesData: BlankVariancesData = {
  blankVariances: [
    {
      id: "bv001",
      productId: "prod001",
      information: {
        size: "S",
        color: "White",
        material: "100% Cotton",
        stock: 100
      },
      blankPrice: 15.00
    },
    {
      id: "bv002",
      productId: "prod001",
      information: {
        size: "M",
        color: "White",
        material: "100% Cotton",
        stock: 150
      },
      blankPrice: 15.00
    },
    {
      id: "bv003",
      productId: "prod001",
      information: {
        size: "L",
        color: "White",
        material: "100% Cotton",
        stock: 150
      },
      blankPrice: 16.00
    },
    {
      id: "bv004",
      productId: "prod001",
      information: {
        size: "XL",
        color: "White",
        material: "100% Cotton",
        stock: 100
      },
      blankPrice: 16.00
    }
  ]
};
