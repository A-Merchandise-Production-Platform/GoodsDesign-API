import { PrismaClient, Roles } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { seedSystemConfigBanks } from './seeds/system-config-banks.seed';

const prisma = new PrismaClient();

const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt();
  return bcrypt.hash(password, salt);
};

async function seedColors(userId: string) {
  const defaultColors = [
    { name: 'Red', code: '#FF0000' },
    { name: 'Green', code: '#00FF00' },
  ];

  console.log('Seeding system config colors...');

  for (const color of defaultColors) {
    await prisma.systemConfigColor.upsert({
      where: { code: color.code },
      update: {},
      create: {
        ...color,
        createdBy: userId,
      },
    });
  }

  console.log('System config colors seeded!');
}

async function seedSizes(userId: string) {
  const defaultSizes = [
    { code: 'S' },
    { code: 'M' },
    { code: 'L' },
    { code: 'XL' },
    { code: 'XXL' },
    { code: 'XXXL' },
  ];

  console.log('Seeding system config sizes...');

  for (const size of defaultSizes) {
    await prisma.systemConfigSize.upsert({
      where: { code: size.code },
      update: {},
      create: {
        ...size,
        createdBy: userId,
      },
    });
  }

  console.log('System config sizes seeded!');
}

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

  // Rest of the user seeding...
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

  // Seed system configurations
  await seedSystemConfigBanks(prisma);
  await seedColors(admin.id);
  await seedSizes(admin.id);

  console.log({ admin, manager });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
