import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { PrismaService } from '../src/prisma';

let app: INestApplication;
let prisma: PrismaService;

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleRef.createNestApplication();
  prisma = app.get(PrismaService);

  // Clean up database before tests
  await prisma.notification.deleteMany();
  await prisma.user.deleteMany();
  
  await app.init();
});

afterAll(async () => {
  // Clean up database after tests
  await prisma.notification.deleteMany();
  await prisma.user.deleteMany();
  await prisma.$disconnect();
  await app.close();
});

export { app, request }; 