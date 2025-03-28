interface ProductDesign {
  id: string;
  userEmail: string;
  blankVariantId: string;
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
      blankVariantId: "bv001",
      isFinalized: true,
      isPublic: true,
      isTemplate: true,
    },
    {
      id: "design002",
      userEmail: "customer@gmail.com",
      blankVariantId: "bv002",
      isFinalized: true,
      isPublic: false,
      isTemplate: false,
    },
    {
      id: "design003",
      userEmail: "manager@gmail.com",
      blankVariantId: "bv001",
      isFinalized: false,
      isPublic: false,
      isTemplate: false,
    },
  ],
};
