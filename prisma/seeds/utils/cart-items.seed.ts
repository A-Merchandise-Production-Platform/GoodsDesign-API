import { PrismaClient } from '@prisma/client';
import { cartItemsData } from '../data/cart-items.data';

export async function seedCartItems(prisma: PrismaClient) {
    console.log('Seeding cart items...');
    
    for (const cartItem of cartItemsData.cartItems) {
        await prisma.cartItem.create({
            data: cartItem
        });
    }

    console.log('Cart items seeded successfully!');
}