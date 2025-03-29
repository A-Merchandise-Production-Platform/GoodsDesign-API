interface Product {
    id: string
    name: string
    description: string
    imageUrl: string
    model3DUrl: string
    isActive: boolean
    categoryId: string
}

interface ProductsData {
    products: Product[]
}

export const productsData: ProductsData = {
    products: [
        {
            id: "prod001",
            name: "Classic Cotton T-Shirt",
            description: "100% cotton premium t-shirt available in multiple sizes and colors",
            imageUrl:
                "https://files.cdn.printful.com/o/upload/product-catalog-img/ea/ea968722fc4980abb0a61b90e7cc0451_l",
            model3DUrl: "https://example.com/models/classic-tshirt.glb",
            isActive: true,
            categoryId: "cat001"
        },
        {
            id: "prod002",
            name: "Phone Case",
            description: "Durable phone case available for various phone models",
            imageUrl:
                "https://www.zazzle.com/rlv/svc/view?realview=113759124283101892&design=441c2b80-5ed5-4207-8b3e-c2bc95456044&rlvnet=1&formfactor=apple_iphone12mini&style=tough&finish=glossy&max_dim=644&cacheDefeat=1743270021068",
            model3DUrl: "https://example.com/models/premium-hoodie.glb",
            isActive: true,
            categoryId: "cat002"
        }
    ]
}
