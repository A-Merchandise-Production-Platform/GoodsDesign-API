import { PrismaClient } from '@prisma/client';
import { checkQualityData } from '../data/check-quality.data';

export async function seedCheckQualities(prisma: PrismaClient) {
  console.log('Seeding check qualities...');
  
  for (const checkQuality of checkQualityData.checkQualities) {
    await prisma.checkQuality.create({
      data: checkQuality,
    });
  }

  console.log('Check qualities seeded successfully!');
}