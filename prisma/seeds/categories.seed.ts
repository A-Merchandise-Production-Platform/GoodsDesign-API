import { PrismaClient } from '@prisma/client';
import categoriesData from './data/categories.data.json';

export const seedCategories = async (prisma: PrismaClient) => {
  console.log('Seeding categories...');
  
  for (const category of categoriesData) {
    await prisma.category.upsert({
      where: { id: category.id },
      update: {
        name: category.name,
        description: category.description,
        imageUrl: category.imageUrl,
        isActive: category.isActive
      },
      create: {
        id: category.id,
        name: category.name,
        description: category.description,
        imageUrl: category.imageUrl,
        isActive: category.isActive,
        createdBy: 'system'
      },
    });
  }

  console.log('Categories seeded!');
};