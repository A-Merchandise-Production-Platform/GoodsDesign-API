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
            isPublic: false,
            isTemplate: false,
            thumbnailUrl:
                "https://res.cloudinary.com/drzhutfzg/image/upload/v1744285226/files/gzwa3oc4yipw4vzieidq.png"
        },
        {
            id: "design002",
            userEmail: "customer@gmail.com",
            systemConfigVariantId: "var002",
            isFinalized: true,
            isPublic: false,
            isTemplate: false,
            thumbnailUrl:
                "https://res.cloudinary.com/drzhutfzg/image/upload/v1744357322/files/c4dxnbtd7stwzu6gvmvw.png"
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
        },
        {
            id: "63dc38b4-54de-43e7-b53d-504859e182bc",
            userEmail: "admin@gmail.com",
            systemConfigVariantId: "var001",
            isFinalized: false,
            isPublic: true,
            isTemplate: true,
            thumbnailUrl:
                "https://res.cloudinary.com/drzhutfzg/image/upload/v1743792060/files/clwk3luuxaz8ekgal4uo.png"
        },
        {
            id: "4ed9558e-d486-433c-8f88-df6db2829d18",
            userEmail: "admin@gmail.com",
            systemConfigVariantId: "var003",
            isFinalized: false,
            isPublic: true,
            isTemplate: true,
            thumbnailUrl:
                "https://res.cloudinary.com/drzhutfzg/image/upload/v1743793183/files/s8zfl0nq01uxxwusjkdy.png"
        },
        {
            id: "d0b12a64-5345-4337-a007-9e45eb53cc20",
            userEmail: "admin@gmail.com",
            systemConfigVariantId: "var002",
            isFinalized: false,
            isPublic: true,
            isTemplate: true,
            thumbnailUrl:
                "https://res.cloudinary.com/drzhutfzg/image/upload/v1743793760/files/churxev8nyczrmmlpndu.png"
        }
    ]
}
