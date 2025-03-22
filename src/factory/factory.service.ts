import { Injectable } from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"

@Injectable()
export class FactoryService {
    constructor(private prisma: PrismaService) {}
}
