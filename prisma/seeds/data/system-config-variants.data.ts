interface Variant {
  name: string;
  value: any;
  productId: string;
}

interface VariantsData {
  variants: Variant[];
}

export const variantsData: VariantsData = {
  variants: [
    {
      name: "Size",
      value: [
        { name: "Small size", code: "S"},
        { name: "Medium size", code: "M"},
        { name: "Large size", code: "L"},
        { name: "Extra large size", code: "XL"},
      ],
      productId: "prod001"
    },
    {
      name: "Color",
      value: [
        { name: "White color", code: "#ffffff"},
        { name: "Black color", code: "#000000"},
        { name: "Navy color", code: "#000080"},
        { name: "Red color", code: "#ff0000"},
      ],
      productId: "prod001"
    }
  ]
}; 