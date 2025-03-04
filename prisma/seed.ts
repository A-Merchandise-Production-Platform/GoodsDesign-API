import { PrismaClient, Roles } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt();
  return bcrypt.hash(password, salt);
};

async function main() {
  // Hash the password once since all users will have the same password
  const hashedPassword = await hashPassword('123456');

  // Seed users with different roles
  const admin = await prisma.user.upsert({
    where: { id: 'admin-id' },
    update: {
      email: 'admin@example.com',
      password: hashedPassword
    },
    create: {
        id: 'admin-id',
        email: 'admin@example.com',
        password: hashedPassword,
        gender: true,
        dateOfBirth: new Date('1990-01-01'),
        imageUrl: 'https://example.com/admin.jpg',
        isActive: true,
        role: Roles.ADMIN,
      addresses: {
        create: [
          {
            provinceID: 1,
            districtID: 1,
            wardCode: '001',
            street: '123 Admin Street',
          },
        ],
      },
    },
  });

  const manager = await prisma.user.upsert({
    where: { id: 'manager-id' },
    update: {
      email: 'manager@example.com',
      password: hashedPassword
    },
    create: {
        id: 'manager-id',
        email: 'manager@example.com',
        password: hashedPassword,
        gender: false,
        dateOfBirth: new Date('1992-06-15'),
        imageUrl: 'https://example.com/manager.jpg',
        isActive: true,
        role: Roles.MANAGER,
      addresses: {
        create: [
          {
            provinceID: 2,
            districtID: 2,
            wardCode: '002',
            street: '456 Manager Road',
          },
        ],
      },
    },
  });

  const staff = await prisma.user.upsert({
    where: { id: 'staff-id' },
    update: {
      email: 'staff@example.com',
      password: hashedPassword
    },
    create: {
        id: 'staff-id',
        email: 'staff@example.com',
        password: hashedPassword,
        gender: true,
        dateOfBirth: new Date('1995-09-20'),
        imageUrl: 'https://example.com/staff.jpg',
        isActive: true,
        role: Roles.STAFF,
    },
  });

  const factoryOwner = await prisma.user.upsert({
    where: { id: 'factory-owner-id' },
    update: {
      email: 'factory@example.com',
      password: hashedPassword
    },
    create: {
        id: 'factory-owner-id',
        email: 'factory@example.com',
        password: hashedPassword,
        gender: false,
        dateOfBirth: new Date('1985-12-10'),
        imageUrl: 'https://example.com/factoryowner.jpg',
        isActive: true,
        role: Roles.FACTORYOWNER,
    },
  });

  const customer = await prisma.user.upsert({
    where: { id: 'customer-id' },
    update: {
      email: 'customer@example.com',
      password: hashedPassword
    },
    create: {
        id: 'customer-id',
        email: 'customer@example.com',
        password: hashedPassword,
        gender: true,
        dateOfBirth: new Date('2000-03-25'),
        imageUrl: 'https://example.com/customer.jpg',
        isActive: true,
        role: Roles.CUSTOMER,
    },
  });

  // Seed categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { id: 'furniture-id' },
      update: {},
      create: {
        id: 'furniture-id',
        name: 'Furniture',
        description: 'Modern and contemporary furniture designs',
        imageUrl: 'https://example.com/images/furniture.jpg',
        isActive: true,
        createdBy: admin.id,
      },
    }),
    prisma.category.upsert({
      where: { id: 'lighting-id' },
      update: {},
      create: {
        id: 'lighting-id',
        name: 'Lighting',
        description: 'Innovative lighting solutions and designs',
        imageUrl: 'https://example.com/images/lighting.jpg',
        isActive: true,
        createdBy: admin.id,
      },
    }),
    prisma.category.upsert({
      where: { id: 'decor-id' },
      update: {},
      create: {
        id: 'decor-id',
        name: 'Home Decor',
        description: 'Decorative items and accessories',
        imageUrl: 'https://example.com/images/decor.jpg',
        isActive: true,
        createdBy: admin.id,
      },
    }),
  ]);

  // Seed products
  const products = await Promise.all([
    // Furniture products
    prisma.product.upsert({
      where: { id: 'modern-chair-id' },
      update: {},
      create: {
        id: 'modern-chair-id',
        name: 'Modern Lounge Chair',
        description: 'Contemporary lounge chair with ergonomic design',
        imageUrl: 'https://example.com/images/modern-chair.jpg',
        model3DUrl: 'https://example.com/models/modern-chair.glb',
        isActive: true,
        categoryId: 'furniture-id',
        createdBy: admin.id,
      },
    }),
    prisma.product.upsert({
      where: { id: 'dining-table-id' },
      update: {},
      create: {
        id: 'dining-table-id',
        name: 'Extendable Dining Table',
        description: 'Modern dining table with extension mechanism',
        imageUrl: 'https://example.com/images/dining-table.jpg',
        model3DUrl: 'https://example.com/models/dining-table.glb',
        isActive: true,
        categoryId: 'furniture-id',
        createdBy: admin.id,
      },
    }),
    // Lighting products
    prisma.product.upsert({
      where: { id: 'pendant-light-id' },
      update: {},
      create: {
        id: 'pendant-light-id',
        name: 'Modern Pendant Light',
        description: 'Elegant pendant light with adjustable height',
        imageUrl: 'https://example.com/images/pendant-light.jpg',
        model3DUrl: 'https://example.com/models/pendant-light.glb',
        isActive: true,
        categoryId: 'lighting-id',
        createdBy: admin.id,
      },
    }),
    // Decor products
    prisma.product.upsert({
      where: { id: 'wall-art-id' },
      update: {},
      create: {
        id: 'wall-art-id',
        name: 'Abstract Wall Art',
        description: 'Contemporary abstract wall art piece',
        imageUrl: 'https://example.com/images/wall-art.jpg',
        model3DUrl: 'https://example.com/models/wall-art.glb',
        isActive: true,
        categoryId: 'decor-id',
        createdBy: admin.id,
      },
    }),
  ]);

  console.log({ admin, manager, staff, factoryOwner, customer, categories, products });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
