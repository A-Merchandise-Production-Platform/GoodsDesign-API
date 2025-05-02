import { VoucherType } from "@prisma/client"

export const vouchersData = {
    vouchers: [
        {
            id: "voucher001",
            code: "WELCOME10",
            type: VoucherType.PERCENTAGE,
            value: 10,
            minOrderValue: 100000,
            startDate: "2024-01-01",
            endDate: "2025-12-31",
            isActive: true,
            userId: "customer001" // Customer ID from users.data.ts
        },
        {
            id: "voucher002",
            code: "FIXED50K",
            type: VoucherType.FIXED_VALUE,
            value: 50000,
            minOrderValue: 300000,
            startDate: "2024-01-01",
            endDate: "2025-12-31",
            isActive: true,
            userId: "customer001" // Customer ID from users.data.ts
        },
        {
            id: "voucher003",
            code: "NEWUSER20",
            type: VoucherType.PERCENTAGE,
            value: 20,
            minOrderValue: 200000,
            startDate: "2024-01-01",
            endDate: "2025-12-31",
            isActive: true,
            userId: "customer001" // Customer ID from users.data.ts
        },
        {
            id: "voucher004",
            code: "SUMMER100K",
            type: VoucherType.FIXED_VALUE,
            value: 100000,
            minOrderValue: 500000,
            startDate: "2024-06-01",
            endDate: "2024-08-31",
            isActive: true,
            userId: "customer001" // Customer ID from users.data.ts
        },
        {
            id: "voucher005",
            code: "USED15PCT",
            type: VoucherType.PERCENTAGE,
            value: 15,
            minOrderValue: 150000,
            startDate: "2024-01-01",
            endDate: "2025-12-31",
            isActive: true,
            userId: "customer001", // Customer ID from users.data.ts
            usedAt: "2025-04-05" // This voucher has been used
        }
    ]
}
