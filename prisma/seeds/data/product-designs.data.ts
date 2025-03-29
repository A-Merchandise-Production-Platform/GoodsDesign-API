interface ProductDesign {
  id: string;
  userEmail: string;
  systemConfigVariantId: string;
  isFinalized: boolean;
  isPublic: boolean;
  isTemplate: boolean;
}

interface ProductDesignsData {
  productDesigns: ProductDesign[];
}

export const productDesignsData: ProductDesignsData = {
  productDesigns: [
    {
      id: "design001",
      userEmail: "customer@gmail.com",
      systemConfigVariantId: "var001",
      isFinalized: true,
      isPublic: true,
      isTemplate: true,
    },
    {
      id: "design002",
      userEmail: "customer@gmail.com",
      systemConfigVariantId: "var002",
      isFinalized: true,
      isPublic: false,
      isTemplate: false,
    },
    {
      id: "design003",
      userEmail: "manager@gmail.com",
      systemConfigVariantId: "var003",
      isFinalized: false,
      isPublic: false,
      isTemplate: false,
    },
  ],
};
