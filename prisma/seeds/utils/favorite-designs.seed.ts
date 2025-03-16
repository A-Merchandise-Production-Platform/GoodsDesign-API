import { PrismaClient } from '@prisma/client';
import { productDesignsData } from '../data/product-designs.data';
import { usersData } from '../data/users.data';

const prisma = new PrismaClient();

async function main() {
  const favoriteDesigns = [
    {
      id: 'fav001',
      userId: usersData.users.find(user => user.email === 'customer@gmail.com')?.id,
      designId: productDesignsData.productDesigns.find(design => design.id === 'design001')?.id,
      createdAt: new Date(),
    },
    {
      id: 'fav002',
      userId: usersData.users.find(user => user.email === 'manager@gmail.com')?.id,
      designId: productDesignsData.productDesigns.find(design => design.id === 'design002')?.id,
      createdAt: new Date(),
    },
  ];

  for (const favoriteDesign of favoriteDesigns) {
    await prisma.favoriteDesign.create({
      data: favoriteDesign,
    });
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });