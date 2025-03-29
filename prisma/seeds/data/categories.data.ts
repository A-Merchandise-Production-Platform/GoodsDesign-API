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
      imageUrl: "https://owayo-cdn.com/cdn-cgi/image/format=auto,fit=contain,width=490/newhp/img/productHome/productSeitenansicht/productservice/tshirts_classic_herren_basic_productservice/st2020_whi.png",
      isActive: true
    },
    {
      id: "cat002",
      name: "Cup",
      description: "Custom designed cup",
      imageUrl: "https://www.vhv.rs/dpng/d/539-5394339_custom-mug-coffee-cup-hd-png-download.png",
      isActive: true
    }
  ]
}