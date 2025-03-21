import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UpdateFactoryInfoDto } from "./dto/update-factory-info.dto";
import { UpdateFactoryContractDto } from "./dto/update-factory-contract.dto";
import { FactoryEntity } from "./entities/factory.entity";

@Injectable()
export class FactoryService {
    constructor(private prisma: PrismaService) {}

    private toFactoryEntity(factory: any): FactoryEntity {
        return {
            factoryOwnerId: factory.factoryOwnerId,
            information: factory.information,
            contract: factory.contract,
            owner: factory.owner
        };
    }

    async getFactoryByOwnerId(ownerId: string): Promise<FactoryEntity> {
        const factory = await this.prisma.factory.findUnique({
            where: { factoryOwnerId: ownerId },
            include: { owner: true }
        });

        if (!factory) {
            throw new NotFoundException("Factory not found");
        }

        return this.toFactoryEntity(factory);
    }

    async updateFactoryInfo(
        ownerId: string,
        updateFactoryInfoDto: UpdateFactoryInfoDto
    ): Promise<FactoryEntity> {
        const factory = await this.prisma.factory.findUnique({
            where: { factoryOwnerId: ownerId }
        });

        if (!factory) {
            throw new NotFoundException("Factory not found");
        }

        // Convert DTO to plain object for JSON storage
        const factoryInfo = {
            ...updateFactoryInfoDto,
            createdAt: factory.information["createdAt"] // Preserve original creation date
        };

        const updatedFactory = await this.prisma.factory.update({
            where: { factoryOwnerId: ownerId },
            data: {
                information: factoryInfo
            },
            include: { owner: true }
        });

        return this.toFactoryEntity(updatedFactory);
    }

    async updateFactoryContract(
        ownerId: string,
        updateFactoryContractDto: UpdateFactoryContractDto
    ): Promise<FactoryEntity> {
        const factory = await this.prisma.factory.findUnique({
            where: { factoryOwnerId: ownerId }
        });

        if (!factory) {
            throw new NotFoundException("Factory not found");
        }

        // Convert DTO to plain object for JSON storage
        const contractInfo = {
            contractNumber: updateFactoryContractDto.contractNumber,
            effectiveDate: updateFactoryContractDto.effectiveDate,
            expirationDate: updateFactoryContractDto.expirationDate,
            productionCommitment: updateFactoryContractDto.productionCommitment,
            qualityThreshold: updateFactoryContractDto.qualityThreshold,
            responseTimeLimit: updateFactoryContractDto.responseTimeLimit,
            productionCostPerUnit: updateFactoryContractDto.productionCostPerUnit,
            paymentTerm: updateFactoryContractDto.paymentTerm
        };

        const updatedFactory = await this.prisma.factory.update({
            where: { factoryOwnerId: ownerId },
            data: {
                contract: contractInfo
            },
            include: { owner: true }
        });

        return this.toFactoryEntity(updatedFactory);
    }
}