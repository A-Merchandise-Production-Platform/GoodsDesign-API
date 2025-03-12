import { PrismaClient } from '@prisma/client';
import { designPositionsData } from './data/design-positions.data';

export async function seedDesignPositions(prisma: PrismaClient) {
  try {
    console.log('Seeding design positions...');

    for (const position of designPositionsData.designPositions) {
      // Verify that both design and position type exist
      const design = await prisma.productDesign.findUnique({
        where: { id: position.designId }
      });

      if (!design) {
        throw new Error(`ProductDesign with ID ${position.designId} not found`);
      }

      const positionType = await prisma.productPositionType.findUnique({
        where: { id: position.productPositionTypeId }
      });

      if (!positionType) {
        throw new Error(`ProductPositionType with ID ${position.productPositionTypeId} not found`);
      }

      await prisma.designPosition.upsert({
        where: { id: position.id },
        update: {
          designId: position.designId,
          productPositionTypeId: position.productPositionTypeId,
          designJSON: JSON.parse(JSON.stringify(position.designJSON))
        },
        create: {
          id: position.id,
          designId: position.designId,
          productPositionTypeId: position.productPositionTypeId,
          designJSON: JSON.parse(JSON.stringify(position.designJSON))
        }
      });
    }

    console.log('Design positions seeded successfully!');
  } catch (error) {
    console.error('Error seeding design positions:', error);
    throw error;
  }
}