import { Injectable } from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"
import { UpdateSystemConfigOrderDto } from "./dto/update-system-config-order.dto"
import { SystemConfigOrderEntity } from "./entities/system-config-order.entity"

@Injectable()
export class SystemConfigOrderService {
    constructor(private prisma: PrismaService) {}

    async findOne(): Promise<SystemConfigOrderEntity> {
        // Since there's only one row, we can use findFirst
        const config = await this.prisma.systemConfigOrder.findFirst()
        
        if (!config) {
            throw new Error("System configuration not found")
        }

        return new SystemConfigOrderEntity(config)
    }

    async update(updateDto: UpdateSystemConfigOrderDto): Promise<SystemConfigOrderEntity> {
        // Since there's only one row, we can update the first one
        const config = await this.prisma.systemConfigOrder.update({
            where: {
                type: "SYSTEM_CONFIG_ORDER" // This is the unique constraint
            },
            data: updateDto
        })

        return new SystemConfigOrderEntity(config)
    }
} 