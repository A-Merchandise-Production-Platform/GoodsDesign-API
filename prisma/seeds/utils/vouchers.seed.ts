import { PrismaClient, VoucherType } from "@prisma/client"
import { vouchersData } from "../data/vouchers.data"

export const seedVouchers = async (prisma: PrismaClient) => {
    console.log("🌱 Seeding vouchers...")

    // Get the customer from the database
    const customer = await prisma.user.findFirst({
        where: { id: vouchersData.vouchers[0].userId }
    })

    if (!customer) {
        console.log("⚠️ Customer not found. Skipping voucher seeding.")
        return
    }

    const vouchers = []

    for (const voucherData of vouchersData.vouchers) {
        const voucher = await prisma.voucher.create({
            data: {
                id: voucherData.id,
                code: voucherData.code,
                type: voucherData.type as VoucherType,
                value: voucherData.value,
                minOrderValue: voucherData.minOrderValue,
                startDate: new Date(voucherData.startDate),
                endDate: new Date(voucherData.endDate),
                isActive: voucherData.isActive,
                userId: voucherData.userId,
                usedAt: voucherData.usedAt ? new Date(voucherData.usedAt) : null
            }
        })

        vouchers.push(voucher)
    }

    console.log(`✅ Created ${vouchers.length} vouchers successfully!`)
    return vouchers
}
