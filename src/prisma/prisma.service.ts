// src/prisma/prisma.service.ts

import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      transactionOptions: {
        maxWait: 10000, // Maximum time to wait for transaction to start (10 seconds)
        timeout: 15000, // Maximum time for transaction to complete (15 seconds)
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }
}

