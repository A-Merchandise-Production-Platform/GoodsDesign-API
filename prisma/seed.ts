import { PrismaClient, Roles } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed users with different roles
  const admin = await prisma.user.upsert({
    where: { id: 'admin-id' },
    update: {},
    create: {
      id: 'admin-id',
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
    update: {},
    create: {
      id: 'manager-id',
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
    update: {},
    create: {
      id: 'staff-id',
      gender: true,
      dateOfBirth: new Date('1995-09-20'),
      imageUrl: 'https://example.com/staff.jpg',
      isActive: true,
      role: Roles.STAFF,
    },
  });

  const factoryOwner = await prisma.user.upsert({
    where: { id: 'factory-owner-id' },
    update: {},
    create: {
      id: 'factory-owner-id',
      gender: false,
      dateOfBirth: new Date('1985-12-10'),
      imageUrl: 'https://example.com/factoryowner.jpg',
      isActive: true,
      role: Roles.FACTORYOWNER,
    },
  });

  const customer = await prisma.user.upsert({
    where: { id: 'customer-id' },
    update: {},
    create: {
      id: 'customer-id',
      gender: true,
      dateOfBirth: new Date('2000-03-25'),
      imageUrl: 'https://example.com/customer.jpg',
      isActive: true,
      role: Roles.CUSTOMER,
    },
  });

  console.log({ admin, manager, staff, factoryOwner, customer });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
