interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  model3DUrl: string;
  isActive: boolean;
  categoryId: string;
}

interface ProductsData {
  products: Product[];
}

export const productsData: ProductsData = {
  products: [
    {
      id: "prod001",
      name: "Classic Cotton T-Shirt",
      description: "High-quality cotton t-shirt perfect for custom designs",
      imageUrl: "https://example.com/images/classic-tshirt.jpg",
      model3DUrl: "https://example.com/models/classic-tshirt.glb",
      isActive: true,
      categoryId: "cat001",
    },
    {
      id: "prod002",
      name: "Premium Zip Hoodie",
      description: "Warm and comfortable zip-up hoodie for custom designs",
      imageUrl: "https://example.com/images/premium-hoodie.jpg",
      model3DUrl: "https://example.com/models/premium-hoodie.glb",
      isActive: true,
      categoryId: "cat002",
    },
  ],
};
