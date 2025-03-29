interface Variant {
  id: string;
  productId: string;
  size: string;
  color: string;
  model: string | null;
  isActive: boolean;
  isDeleted: boolean;
  price: number
}

interface VariantsData {
  variants: Variant[];
}

export const variantsData: VariantsData = {
  variants: [
    {
      id: "var001",
      productId: "prod001",
      size: "S",
      color: "#ffffff",
      model: null,
      isActive: true,
      isDeleted: false,
      price: 100000
    },
    {
      id: "var002",
      productId: "prod001",
      size: "S",
      color: "#000000",
      model: null,
      isActive: true,
      isDeleted: false,
      price: 100000
    },
    {
      id: "var003",
      productId: "prod001",
      size: "S",
      color: "#000080",
      model: null,
      isActive: true,
      isDeleted: false,
      price: 100000
    },
    {
      id: "var004",
      productId: "prod001",
      size: "S",
      color: "#ff0000",
      model: null,
      isActive: true,
      isDeleted: false,
      price: 100000
    },
    {
      id: "var005",
      productId: "prod001",
      size: "M",
      color: "#ffffff",
      model: null,
      isActive: true,
      isDeleted: false,
      price: 100000
    },
    {
      id: "var006",
      productId: "prod001",
      size: "M",
      color: "#000000",
      model: null,
      isActive: true,
      isDeleted: false,
      price: 100000
    },
    {
      id: "var007",
      productId: "prod001",
      size: "M",
      color: "#000080",
      model: null,
      isActive: true,
      isDeleted: false,
      price: 100000
    },
    {
      id: "var008",
      productId: "prod001",
      size: "M",
      color: "#ff0000",
      model: null,
      isActive: true,
      isDeleted: false,
      price: 100000
    },
    {
      id: "var009",
      productId: "prod001",
      size: "L",
      color: "#ffffff",
      model: null,
      isActive: true,
      isDeleted: false,
      price: 100000
    },
    {
      id: "var010",
      productId: "prod001",
      size: "L",
      color: "#000000",
      model: null,
      isActive: true,
      isDeleted: false,
      price: 100000
    },
    {
      id: "var011",
      productId: "prod001",
      size: "L",
      color: "#000080",
      model: null,
      isActive: true,
      isDeleted: false,
      price: 100000
    },
    {
      id: "var012",
      productId: "prod001",
      size: "L",
      color: "#ff0000",
      model: null,
      isActive: true,
      isDeleted: false,
      price: 100000
    },
    {
      id: "var013",
      productId: "prod001",
      size: "XL",
      color: "#ffffff",
      model: null,
      isActive: true,
      isDeleted: false,
      price: 100000
    },
    {
      id: "var014",
      productId: "prod001",
      size: "XL",
      color: "#000000",
      model: null,
      isActive: true,
      isDeleted: false,
      price: 100000
    },
    {
      id: "var015",
      productId: "prod001",
      size: "XL",
      color: "#000080",
      model: null,
      isActive: true,
      isDeleted: false,
      price: 100000
    },
    {
      id: "var016",
      productId: "prod001",
      size: "XL",
      color: "#ff0000",
      model: null,
      isActive: true,
      isDeleted: false,
      price: 100000
    }
  ]
};