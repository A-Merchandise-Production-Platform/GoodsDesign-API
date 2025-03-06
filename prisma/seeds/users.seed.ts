import { PrismaClient, Roles } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';

const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt();
  return bcrypt.hash(password, salt);
};

export const seedUsers = async (prisma: PrismaClient) => {
  const usersFilePath = path.join(__dirname, 'users.seed.json');
  const usersData = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));

  const hashedPassword = await hashPassword('123456');

  const users: { [key: string]: any } = {};

  for (const userData of usersData) {
    const user = await prisma.user.upsert({
      where: { id: userData.id },
      update: {
        email: userData.email,
        password: hashedPassword
      },
      create: {
        id: userData.id,
        email: userData.email,
        password: hashedPassword,
        gender: userData.gender,
        dateOfBirth: new Date(userData.dateOfBirth),
        imageUrl: userData.imageUrl,
        isActive: userData.isActive,
        role: Roles[userData.role as keyof typeof Roles],
        addresses: {
          create: [
            {
              provinceID: userData.address.provinceID,
              districtID: userData.address.districtID,
              wardCode: userData.address.wardCode,
              street: userData.address.street,
            },
          ],
        },
      },
    });

    users[userData.role.toLowerCase()] = user;
  }

  console.log('Users seeded successfully!');
  return users;
};