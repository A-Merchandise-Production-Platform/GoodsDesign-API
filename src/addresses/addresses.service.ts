import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common"
import { Address } from "@prisma/client"
import { CreateAddressInput } from "src/addresses/dto/create-address.input"
import { UpdateAddressInput } from "src/addresses/dto/update-address.input"
import { AddressEntity } from "src/addresses/entities/address.entity"
import { FactoryEntity } from "src/factory/entities/factory.entity"
import { PrismaService } from "src/prisma"
import { UserEntity } from "src/users"
import { FormatAddressInput } from "./dto/format-address.input"
import { FormattedAddressModel } from "./models/formatted-address.model"
import { ShippingService } from "src/shipping/shipping.service"

@Injectable()
export class AddressesService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly shippingService: ShippingService
    ) {}

    private validateUser(user: UserEntity) {
        if (!user) {
            throw new UnauthorizedException("User not found")
        }
    }

    private transformAddress(
        address: Address & { factory: Partial<FactoryEntity>; user: Partial<UserEntity> }
    ) {
        return new AddressEntity({
            ...address,
            factory: address.factory ? new FactoryEntity(address.factory) : null,
            user: address.user ? new UserEntity(address.user) : null
        })
    }

    private getAddressInclude() {
        return {
            factory: true,
            user: true
        }
    }

    private async generateFormattedAddress(address: {
        provinceID: number
        districtID: number
        wardCode: string
        street: string
    }): Promise<string> {
        try {
            const formattedAddress = await this.formatAddress({
                provinceID: address.provinceID,
                districtID: address.districtID,
                wardCode: address.wardCode,
                street: address.street
            })
            return formattedAddress.text
        } catch (error) {
            // Return empty string if formatting fails
            return ""
        }
    }

    async createAddress(createAddressInput: CreateAddressInput, user: UserEntity) {
        this.validateUser(user)

        // If formattedAddress is not provided, generate it
        let formattedAddress = createAddressInput.formattedAddress
        if (!formattedAddress) {
            formattedAddress = await this.generateFormattedAddress(createAddressInput)
        }

        const address = await this.prisma.address.create({
            data: {
                ...createAddressInput,
                formattedAddress,
                userId: user.id,
                factoryId: createAddressInput.factoryId ? createAddressInput.factoryId : null
            },
            include: this.getAddressInclude()
        })
        return this.transformAddress(address)
    }

    async getAddresses(user: UserEntity) {
        this.validateUser(user)

        const addresses = await this.prisma.address.findMany({
            where: {
                userId: user.id
            },
            include: this.getAddressInclude()
        })

        return addresses.map((address) => this.transformAddress(address))
    }

    async getAddress(id: string, user: UserEntity) {
        this.validateUser(user)

        const address = await this.prisma.address.findUnique({
            where: { id },
            include: this.getAddressInclude()
        })
        return this.transformAddress(address)
    }

    async updateAddress(id: string, updateAddressInput: UpdateAddressInput, user: UserEntity) {
        this.validateUser(user)

        // If address details have changed but formattedAddress is not provided, regenerate it
        let formattedAddress = updateAddressInput.formattedAddress
        if (
            (updateAddressInput.provinceID ||
                updateAddressInput.districtID ||
                updateAddressInput.wardCode ||
                updateAddressInput.street) &&
            !updateAddressInput.formattedAddress
        ) {
            // Get current address data
            const currentAddress = await this.prisma.address.findUnique({
                where: { id }
            })

            if (currentAddress) {
                // Merge current data with updates
                const addressData = {
                    provinceID: updateAddressInput.provinceID || currentAddress.provinceID,
                    districtID: updateAddressInput.districtID || currentAddress.districtID,
                    wardCode: updateAddressInput.wardCode || currentAddress.wardCode,
                    street: updateAddressInput.street || currentAddress.street
                }

                formattedAddress = await this.generateFormattedAddress(addressData)
            }
        }

        const address = await this.prisma.address.update({
            where: { id },
            include: this.getAddressInclude(),
            data: {
                ...updateAddressInput,
                ...(formattedAddress && { formattedAddress })
            }
        })
        return this.transformAddress(address)
    }

    async deleteAddress(id: string, user: UserEntity) {
        this.validateUser(user)

        const address = await this.prisma.address.delete({
            where: { id },
            include: this.getAddressInclude()
        })
        return this.transformAddress(address)
    }

    async formatAddress(formatAddressInput: FormatAddressInput): Promise<FormattedAddressModel> {
        try {
            // Get province, district, and ward names
            const province = await this.shippingService.getProvince(formatAddressInput.provinceID)
            console.log(province)
            const district = await this.shippingService.getDistrict(formatAddressInput.districtID)
            console.log(district)
            const ward = await this.shippingService.getWard(formatAddressInput.wardCode)
            console.log(ward)

            // Format the full address text
            const addressText = `${formatAddressInput.street}, ${ward.wardName}, ${district.districtName}, ${province.provinceName}`

            return {
                text: addressText
            }
        } catch (error) {
            throw new NotFoundException(`Failed to format address: ${error.message}`)
        }
    }
}
