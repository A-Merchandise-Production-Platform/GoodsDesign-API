import { PrismaClient, VoucherType } from "@prisma/client"
import { vouchersData } from "../data/vouchers.data"

export const seedVouchers = async (prisma: PrismaClient) => {
    console.log(" Seeding vouchers...")

    const vouchers = []

    for (const voucherData of vouchersData.vouchers) {
        // Only check for user if the voucher is not public
        if (!voucherData.isPublic && voucherData.userId) {
            const user = await prisma.user.findFirst({
                where: { id: voucherData.userId }
            })

            if (!user) {
                console.log(
                    `⚠️ User ${voucherData.userId} not found. Skipping voucher ${voucherData.code}.`
                )
                continue
            }
        }

        const voucher = await prisma.voucher.create({
            data: {
                id: voucherData.id,
                code: voucherData.code,
                type: voucherData.type as VoucherType,
                value: voucherData.value,
                minOrderValue: voucherData.minOrderValue,
                maxDiscountValue: voucherData.maxDiscountValue,
                description: voucherData.description,
                isPublic: voucherData.isPublic,
                limitedUsage: voucherData.limitedUsage,
                isActive: voucherData.isActive,
                userId: voucherData.userId
            }
        })

        vouchers.push(voucher)
    }

    console.log(`Created ${vouchers.length} vouchers successfully!`)
    return vouchers
}
