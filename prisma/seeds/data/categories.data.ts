interface Category {
  id: string
  name: string
  description?: string
  imageUrl?: string
  isActive: boolean
}

interface CategoriesData {
  categories: Category[]
}

export const categoriesData: CategoriesData = {
  categories: [
    {
      id: "cat001",
      name: "T-Shirts",
      description: "Custom designed t-shirts and casual wear",
      imageUrl: "https://example.com/images/tshirts.jpg",
      isActive: true
    },
    {
      id: "cat002",
      name: "Hoodies",
      description: "Comfortable hoodies and sweatshirts",
      imageUrl: "https://example.com/images/hoodies.jpg",
      isActive: true
    }
  ]
}