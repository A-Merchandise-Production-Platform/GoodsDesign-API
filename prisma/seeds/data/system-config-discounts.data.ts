interface Discount {
    name: string
    minQuantity: number
    discountPercent: number
    productId: string
}

// This will be populated with actual product IDs during seeding
export const createDiscountData = (productId: string): Discount[] => [
    {
        name: `${productId} Basic Discount`,
        minQuantity: 10,
        discountPercent: 0.1,
        productId
    },
    {
        name: `${productId} Premium Discount`,
        minQuantity: 20,
        discountPercent: 0.12,
        productId
    }
]
