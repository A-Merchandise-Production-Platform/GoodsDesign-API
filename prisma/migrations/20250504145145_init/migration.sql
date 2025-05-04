-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('ADMIN', 'MANAGER', 'STAFF', 'FACTORYOWNER', 'CUSTOMER');

-- CreateEnum
CREATE TYPE "VoucherType" AS ENUM ('FIXED_VALUE', 'PERCENTAGE');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('DEPOSIT', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('PAYMENT', 'REFUND');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('VNPAY', 'PAYOS', 'BANK');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('COMPLETED', 'PENDING', 'FAILED');

-- CreateEnum
CREATE TYPE "FactoryStatus" AS ENUM ('PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PAYMENT_RECEIVED', 'WAITING_FILL_INFORMATION', 'NEED_MANAGER_HANDLE', 'NEED_MANAGER_HANDLE_REWORK', 'PENDING_ACCEPTANCE', 'REJECTED', 'WAITING_FOR_REFUND', 'REFUNDED', 'IN_PRODUCTION', 'WAITING_FOR_CHECKING_QUALITY', 'REWORK_REQUIRED', 'REWORK_IN_PROGRESS', 'WAITING_PAYMENT', 'READY_FOR_SHIPPING', 'SHIPPING', 'SHIPPED', 'COMPLETED', 'CANCELED');

-- CreateEnum
CREATE TYPE "OrderDetailStatus" AS ENUM ('PENDING', 'IN_PRODUCTION', 'DONE_PRODUCTION', 'WAITING_FOR_CHECKING_QUALITY', 'DONE_CHECK_QUALITY', 'REWORK_REQUIRED', 'REWORK_IN_PROGRESS', 'REWORK_DONE', 'READY_FOR_SHIPPING', 'SHIPPING', 'SHIPPED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'EXPIRED', 'NEED_ASSIGN', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('QUALITY_CHECK');

-- CreateEnum
CREATE TYPE "QualityCheckStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "SystemConfigOrderType" AS ENUM ('SYSTEM_CONFIG_ORDER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "phoneNumber" TEXT,
    "password" TEXT NOT NULL DEFAULT '',
    "gender" BOOLEAN NOT NULL DEFAULT false,
    "dateOfBirth" TIMESTAMP(3),
    "imageUrl" TEXT DEFAULT '',
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" TEXT,
    "deletedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "role" "Roles" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "provinceID" INTEGER NOT NULL,
    "districtID" INTEGER NOT NULL,
    "wardCode" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "factoryId" TEXT,
    "formattedAddress" TEXT,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "model3DUrl" TEXT,
    "weight" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemConfigBank" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "bin" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SystemConfigBank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemConfigDiscount" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "minQuantity" INTEGER NOT NULL,
    "discountPercent" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "SystemConfigDiscount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemConfigVariant" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "size" TEXT,
    "color" TEXT,
    "model" TEXT,
    "price" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SystemConfigVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductPositionType" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "positionName" TEXT NOT NULL,
    "basePrice" INTEGER NOT NULL,

    CONSTRAINT "ProductPositionType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductDesign" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "systemConfigVariantId" TEXT NOT NULL,
    "isFinalized" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "isTemplate" BOOLEAN NOT NULL DEFAULT false,
    "thumbnailUrl" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ProductDesign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DesignPosition" (
    "designId" TEXT NOT NULL,
    "productPositionTypeId" TEXT NOT NULL,
    "designJSON" JSONB NOT NULL,

    CONSTRAINT "DesignPosition_pkey" PRIMARY KEY ("designId","productPositionTypeId")
);

-- CreateTable
CREATE TABLE "FavoriteDesign" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "designId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FavoriteDesign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "type" "PaymentType" NOT NULL,
    "paymentLog" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "status" "PaymentStatus" NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentTransaction" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "paymentGatewayTransactionId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "type" "TransactionType" NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "status" "TransactionStatus" NOT NULL,
    "transactionLog" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "imageUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "userBankId" TEXT,

    CONSTRAINT "PaymentTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "content" TEXT,
    "url" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CartItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "designId" TEXT NOT NULL,
    "systemConfigVariantId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FactoryProduct" (
    "factoryId" TEXT NOT NULL,
    "systemConfigVariantId" TEXT NOT NULL,
    "productionCapacity" INTEGER NOT NULL,
    "productionTimeInMinutes" INTEGER NOT NULL DEFAULT 300,

    CONSTRAINT "FactoryProduct_pkey" PRIMARY KEY ("factoryId","systemConfigVariantId")
);

-- CreateTable
CREATE TABLE "Factory" (
    "factoryOwnerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "businessLicenseUrl" TEXT,
    "taxIdentificationNumber" TEXT,
    "addressId" TEXT,
    "website" TEXT,
    "establishedDate" TIMESTAMP(3) NOT NULL,
    "qualityCertifications" TEXT,
    "printingMethods" TEXT[],
    "specializations" TEXT[],
    "contactPersonName" TEXT,
    "contactPersonRole" TEXT,
    "contactPhone" TEXT,
    "maxPrintingCapacity" INTEGER NOT NULL,
    "leadTime" INTEGER,
    "legitPoint" INTEGER NOT NULL DEFAULT 100,
    "factoryStatus" "FactoryStatus" NOT NULL DEFAULT 'PENDING_APPROVAL',
    "isSubmitted" BOOLEAN NOT NULL DEFAULT false,
    "statusNote" TEXT,
    "contractAccepted" BOOLEAN NOT NULL DEFAULT false,
    "contractAcceptedAt" TIMESTAMP(3),
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "contractUrl" TEXT,
    "staffId" TEXT,

    CONSTRAINT "Factory_pkey" PRIMARY KEY ("factoryOwnerId")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "factoryId" TEXT,
    "status" "OrderStatus" NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "shippingPrice" INTEGER NOT NULL DEFAULT 0,
    "orderDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalItems" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3),
    "totalProductionCost" INTEGER,
    "voucherId" TEXT,
    "currentProgress" INTEGER NOT NULL DEFAULT 0,
    "delayReason" TEXT,
    "isDelayed" BOOLEAN NOT NULL DEFAULT false,
    "rating" INTEGER,
    "ratingComment" TEXT,
    "ratedAt" TIMESTAMP(3),
    "ratedBy" TEXT,
    "assignedAt" TIMESTAMP(3),
    "acceptanceDeadline" TIMESTAMP(3),
    "acceptedAt" TIMESTAMP(3),
    "sendForShippingAt" TIMESTAMP(3),
    "shippedAt" TIMESTAMP(3),
    "estimatedShippingAt" TIMESTAMP(3) NOT NULL,
    "doneProductionAt" TIMESTAMP(3),
    "estimatedDoneProductionAt" TIMESTAMP(3) NOT NULL,
    "doneCheckQualityAt" TIMESTAMP(3),
    "estimatedCheckQualityAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "estimatedCompletionAt" TIMESTAMP(3) NOT NULL,
    "addressId" TEXT,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderDetail" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "designId" TEXT NOT NULL,
    "systemConfigVariantId" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "status" "OrderDetailStatus" NOT NULL DEFAULT 'PENDING',
    "completedQty" INTEGER NOT NULL DEFAULT 0,
    "rejectedQty" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "productionCost" INTEGER,
    "reworkTime" INTEGER NOT NULL DEFAULT 0,
    "isRework" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "OrderDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderProgressReport" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "reportDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,
    "imageUrls" TEXT[],

    CONSTRAINT "OrderProgressReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RejectedOrder" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "factoryId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "rejectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reassignedTo" TEXT,
    "reassignedAt" TIMESTAMP(3),

    CONSTRAINT "RejectedOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "taskname" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "expiredTime" TIMESTAMP(3) NOT NULL,
    "taskType" "TaskType" NOT NULL DEFAULT 'QUALITY_CHECK',
    "orderId" TEXT,
    "userId" TEXT,
    "assignedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "TaskStatus" NOT NULL DEFAULT 'PENDING',
    "completedDate" TIMESTAMP(3),
    "note" TEXT,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckQuality" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "orderDetailId" TEXT NOT NULL,
    "totalChecked" INTEGER NOT NULL DEFAULT 0,
    "passedQuantity" INTEGER NOT NULL DEFAULT 0,
    "failedQuantity" INTEGER NOT NULL DEFAULT 0,
    "status" "QualityCheckStatus" NOT NULL DEFAULT 'PENDING',
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "checkedAt" TIMESTAMP(3) NOT NULL,
    "checkedBy" TEXT,
    "imageUrls" TEXT[],

    CONSTRAINT "CheckQuality_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemConfigOrder" (
    "id" TEXT NOT NULL,
    "type" "SystemConfigOrderType" NOT NULL DEFAULT 'SYSTEM_CONFIG_ORDER',
    "limitFactoryRejectOrders" INTEGER NOT NULL DEFAULT 3,
    "checkQualityTimesDays" INTEGER NOT NULL DEFAULT 2,
    "limitReworkTimes" INTEGER NOT NULL DEFAULT 2,
    "shippingDays" INTEGER NOT NULL DEFAULT 2,
    "reduceLegitPointIfReject" INTEGER NOT NULL DEFAULT 3,
    "legitPointToSuspend" INTEGER NOT NULL DEFAULT 20,
    "acceptHoursForFactory" INTEGER NOT NULL DEFAULT 12,
    "maxLegitPoint" INTEGER NOT NULL DEFAULT 100,
    "maxProductionTimeInMinutes" INTEGER NOT NULL DEFAULT 300,
    "maxProductionCapacity" INTEGER NOT NULL DEFAULT 1000,
    "capacityScoreWeight" DOUBLE PRECISION NOT NULL DEFAULT 0.25,
    "leadTimeScoreWeight" DOUBLE PRECISION NOT NULL DEFAULT 0.15,
    "specializationScoreWeight" DOUBLE PRECISION NOT NULL DEFAULT 0.15,
    "legitPointScoreWeight" DOUBLE PRECISION NOT NULL DEFAULT 0.25,
    "productionCapacityScoreWeight" DOUBLE PRECISION NOT NULL DEFAULT 0.2,
    "voucherBaseValueForRefund" INTEGER NOT NULL DEFAULT 20000,
    "voucherBaseTypeForRefund" "VoucherType" NOT NULL DEFAULT 'FIXED_VALUE',

    CONSTRAINT "SystemConfigOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserBank" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bankId" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserBank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Voucher" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" "VoucherType" NOT NULL,
    "value" INTEGER NOT NULL,
    "minOrderValue" INTEGER,
    "maxDiscountValue" INTEGER,
    "description" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "limitedUsage" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "userId" TEXT,

    CONSTRAINT "Voucher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VoucherUsage" (
    "id" TEXT NOT NULL,
    "voucherId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "usedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "orderId" TEXT NOT NULL,

    CONSTRAINT "VoucherUsage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "SystemConfigDiscount_productId_minQuantity_key" ON "SystemConfigDiscount"("productId", "minQuantity");

-- CreateIndex
CREATE UNIQUE INDEX "Factory_factoryOwnerId_key" ON "Factory"("factoryOwnerId");

-- CreateIndex
CREATE UNIQUE INDEX "Factory_addressId_key" ON "Factory"("addressId");

-- CreateIndex
CREATE UNIQUE INDEX "Factory_staffId_key" ON "Factory"("staffId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_voucherId_key" ON "Order"("voucherId");

-- CreateIndex
CREATE UNIQUE INDEX "SystemConfigOrder_type_key" ON "SystemConfigOrder"("type");

-- CreateIndex
CREATE UNIQUE INDEX "Voucher_code_key" ON "Voucher"("code");

-- CreateIndex
CREATE UNIQUE INDEX "VoucherUsage_voucherId_userId_key" ON "VoucherUsage"("voucherId", "userId");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SystemConfigDiscount" ADD CONSTRAINT "SystemConfigDiscount_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SystemConfigVariant" ADD CONSTRAINT "SystemConfigVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductPositionType" ADD CONSTRAINT "ProductPositionType_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductDesign" ADD CONSTRAINT "ProductDesign_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductDesign" ADD CONSTRAINT "ProductDesign_systemConfigVariantId_fkey" FOREIGN KEY ("systemConfigVariantId") REFERENCES "SystemConfigVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesignPosition" ADD CONSTRAINT "DesignPosition_designId_fkey" FOREIGN KEY ("designId") REFERENCES "ProductDesign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesignPosition" ADD CONSTRAINT "DesignPosition_productPositionTypeId_fkey" FOREIGN KEY ("productPositionTypeId") REFERENCES "ProductPositionType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteDesign" ADD CONSTRAINT "FavoriteDesign_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteDesign" ADD CONSTRAINT "FavoriteDesign_designId_fkey" FOREIGN KEY ("designId") REFERENCES "ProductDesign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentTransaction" ADD CONSTRAINT "PaymentTransaction_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentTransaction" ADD CONSTRAINT "PaymentTransaction_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentTransaction" ADD CONSTRAINT "PaymentTransaction_userBankId_fkey" FOREIGN KEY ("userBankId") REFERENCES "UserBank"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_designId_fkey" FOREIGN KEY ("designId") REFERENCES "ProductDesign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_systemConfigVariantId_fkey" FOREIGN KEY ("systemConfigVariantId") REFERENCES "SystemConfigVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactoryProduct" ADD CONSTRAINT "FactoryProduct_factoryId_fkey" FOREIGN KEY ("factoryId") REFERENCES "Factory"("factoryOwnerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactoryProduct" ADD CONSTRAINT "FactoryProduct_systemConfigVariantId_fkey" FOREIGN KEY ("systemConfigVariantId") REFERENCES "SystemConfigVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Factory" ADD CONSTRAINT "Factory_factoryOwnerId_fkey" FOREIGN KEY ("factoryOwnerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Factory" ADD CONSTRAINT "Factory_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Factory" ADD CONSTRAINT "Factory_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_factoryId_fkey" FOREIGN KEY ("factoryId") REFERENCES "Factory"("factoryOwnerId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_voucherId_fkey" FOREIGN KEY ("voucherId") REFERENCES "Voucher"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDetail" ADD CONSTRAINT "OrderDetail_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDetail" ADD CONSTRAINT "OrderDetail_designId_fkey" FOREIGN KEY ("designId") REFERENCES "ProductDesign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDetail" ADD CONSTRAINT "OrderDetail_systemConfigVariantId_fkey" FOREIGN KEY ("systemConfigVariantId") REFERENCES "SystemConfigVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderProgressReport" ADD CONSTRAINT "OrderProgressReport_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RejectedOrder" ADD CONSTRAINT "RejectedOrder_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RejectedOrder" ADD CONSTRAINT "RejectedOrder_factoryId_fkey" FOREIGN KEY ("factoryId") REFERENCES "Factory"("factoryOwnerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckQuality" ADD CONSTRAINT "CheckQuality_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckQuality" ADD CONSTRAINT "CheckQuality_orderDetailId_fkey" FOREIGN KEY ("orderDetailId") REFERENCES "OrderDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBank" ADD CONSTRAINT "UserBank_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBank" ADD CONSTRAINT "UserBank_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "SystemConfigBank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Voucher" ADD CONSTRAINT "Voucher_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoucherUsage" ADD CONSTRAINT "VoucherUsage_voucherId_fkey" FOREIGN KEY ("voucherId") REFERENCES "Voucher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoucherUsage" ADD CONSTRAINT "VoucherUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoucherUsage" ADD CONSTRAINT "VoucherUsage_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
