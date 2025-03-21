interface CartItem {
    id: string
    userId: string
    designId: string
    quantity: number
}

interface CartItemsData {
    cartItems: CartItem[]
}

export const cartItemsData: CartItemsData = {
    cartItems: [
        {
            id: "cart001",
            userId: "customer-id", // From users.data.ts
            designId: "design001", // From product-designs.data.ts
            quantity: 2
        },
        {
            id: "cart002",
            userId: "customer-id",
            designId: "design002",
            quantity: 1
        }
    ]
}