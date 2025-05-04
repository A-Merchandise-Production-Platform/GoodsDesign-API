import { VoucherType } from "@prisma/client"

export const vouchersData = {
    vouchers: [
        {
            id: "voucher001",
            code: "WELCOME10",
            type: VoucherType.PERCENTAGE,
            value: 10,
            minOrderValue: 100000,
            maxDiscountValue: 50000,
            description: "Welcome discount for new customers",
            isPublic: true,
            limitedUsage: 1000,
            isActive: true,
            userId: null // Public voucher
        },
        {
            id: "voucher002",
            code: "FIXED50K",
            type: VoucherType.FIXED_VALUE,
            value: 50000,
            minOrderValue: 300000,
            description: "Fixed discount for orders above 300K",
            isPublic: true,
            limitedUsage: 500,
            isActive: true,
            userId: null // Public voucher
        },
        {
            id: "voucher003",
            code: "VIP20",
            type: VoucherType.PERCENTAGE,
            value: 20,
            minOrderValue: 200000,
            maxDiscountValue: 100000,
            description: "Special discount for VIP customers",
            isPublic: false,
            limitedUsage: 1,
            isActive: true,
            userId: "customer-id" // User-specific voucher
        },
        {
            id: "voucher004",
            code: "SUMMER100K",
            type: VoucherType.FIXED_VALUE,
            value: 100000,
            minOrderValue: 500000,
            description: "Summer special discount",
            isPublic: true,
            limitedUsage: 200,
            isActive: true,
            userId: null // Public voucher
        },
        {
            id: "voucher005",
            code: "BIRTHDAY15",
            type: VoucherType.PERCENTAGE,
            value: 15,
            minOrderValue: 150000,
            maxDiscountValue: 75000,
            description: "Birthday special discount",
            isPublic: false,
            limitedUsage: 1,
            isActive: true,
            userId: "customer-id", // User-specific voucher
            usedAt: "2024-04-05" // This voucher has been used
        },
        {
            id: "voucher006",
            code: "FLASH25",
            type: VoucherType.PERCENTAGE,
            value: 25,
            minOrderValue: 400000,
            maxDiscountValue: 200000,
            description: "Flash sale discount",
            isPublic: true,
            limitedUsage: 100,
            isActive: true,
            userId: null // Public voucher
        },
        {
            id: "voucher007",
            code: "LOYALTY30",
            type: VoucherType.PERCENTAGE,
            value: 30,
            minOrderValue: 1000000,
            maxDiscountValue: 500000,
            description: "Loyalty reward for frequent customers",
            isPublic: false,
            limitedUsage: 1,
            isActive: true,
            userId: "customer-id" // User-specific voucher
        }
    ]
}
