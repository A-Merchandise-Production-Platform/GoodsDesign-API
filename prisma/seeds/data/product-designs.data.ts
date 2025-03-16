interface ProductDesign {
  id: string;
  userEmail: string;
  blankVariantId: string;
  saved3DPreviewUrl: string;
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
      saved3DPreviewUrl: "https://example.com/previews/design1.jpg",
      isFinalized: true,
      isPublic: true,
      isTemplate: true,
    },
    {
      id: "design002",
      userEmail: "customer@gmail.com",
      blankVariantId: "bv002",
      saved3DPreviewUrl: "https://example.com/previews/design2.jpg",
      isFinalized: true,
      isPublic: false,
      isTemplate: false,
    },
    {
      id: "design003",
      userEmail: "manager@gmail.com",
      blankVariantId: "bv001",
      saved3DPreviewUrl: "https://example.com/previews/design3.jpg",
      isFinalized: false,
      isPublic: false,
      isTemplate: false,
    },
  ],
};
