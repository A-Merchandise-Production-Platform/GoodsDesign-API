import { PrismaClient } from '@prisma/client';
import { favoriteDesignsData } from '../data/favorite-designs.data';

export async function seedFavoriteDesigns(prisma: PrismaClient) {
  console.log('Seeding favorite designs...');
  
  for (const favoriteDesign of favoriteDesignsData) {
    await prisma.favoriteDesign.create({
      data: favoriteDesign,
    });
  }

  console.log('Favorite designs seeded successfully!');
}