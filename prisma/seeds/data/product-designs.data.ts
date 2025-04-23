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
            isFinalized: false,
            isPublic: false,
            isTemplate: false,
            thumbnailUrl:
                "https://res.cloudinary.com/drzhutfzg/image/upload/v1745161392/files/evkuzcqqjw2aw6fnmzw2.png"
        },
        {
            id: "design002",
            userEmail: "customer@gmail.com",
            systemConfigVariantId: "var002",
            isFinalized: true,
            isPublic: false,
            isTemplate: false,
            thumbnailUrl:
                "https://res.cloudinary.com/drzhutfzg/image/upload/v1745394540/files/cx1hb4sqfbu023gqk4mp.png"
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
