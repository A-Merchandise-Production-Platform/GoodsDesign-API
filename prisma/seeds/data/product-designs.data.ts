interface ProductDesign {
  id: string;
  userEmail: string;
  systemConfigVariantId: string;
  isFinalized: boolean;
  isPublic: boolean;
  isTemplate: boolean;
  thumbnailUrl?: string;
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
            thumbnailUrl:
                "https://files.cdn.printful.com/o/upload/product-catalog-img/ea/ea968722fc4980abb0a61b90e7cc0451_l"
        },
        {
            id: "design002",
            userEmail: "customer@gmail.com",
            systemConfigVariantId: "var002",
            isFinalized: true,
            isPublic: false,
            isTemplate: false,
            thumbnailUrl:
                "hhttps://files.cdn.printful.com/o/upload/product-catalog-img/ea/ea968722fc4980abb0a61b90e7cc0451_l"
        },
        {
            id: "design003",
            userEmail: "manager@gmail.com",
            systemConfigVariantId: "var003",
            isFinalized: false,
            isPublic: false,
            isTemplate: false,
            thumbnailUrl:
                "https://files.cdn.printful.com/o/upload/product-catalog-img/ea/ea968722fc4980abb0a61b90e7cc0451_l"
        }
    ]
}
