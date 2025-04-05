-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('ADMIN', 'MANAGER', 'STAFF', 'FACTORYOWNER', 'CUSTOMER');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PAYMENT_RECEIVED', 'ASSIGNED_TO_FACTORY', 'ACCEPTED', 'IN_PRODUCTION', 'DONE_PRODUCTION', 'WAITING_PAYMENT', 'WAITING_FILL_INFORMATION', 'DELIVERED', 'CANCELED');

-- CreateEnum
CREATE TYPE "QualityCheckStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('DEPOSIT', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('PAYMENT', 'REFUND');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('VNPAY', 'PAYOS');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('COMPLETED', 'PENDING', 'FAILED');

-- CreateEnum
CREATE TYPE "StaffTaskStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "FactoryStatus" AS ENUM ('PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "FactoryOrderStatus" AS ENUM ('PENDING_ACCEPTANCE', 'ACCEPTED', 'EXPIRED', 'REJECTED', 'WAITING_FOR_MANAGER_ASSIGN_FACTORY', 'IN_PRODUCTION', 'DONE_PRODUCTION', 'WAITING_FOR_CHECKING_QUALITY', 'DONE_CHECK_QUALITY', 'REWORK_REQUIRED', 'REWORK_COMPLETED', 'COMPLETED', 'SHIPPED', 'CANCELLED', 'WAITING_FOR_MANAGER_ASSIGN_STAFF');

-- CreateEnum
CREATE TYPE "OrderDetailStatus" AS ENUM ('PENDING', 'IN_PRODUCTION', 'COMPLETED', 'REJECTED', 'REWORK_REQUIRED', 'REWORK_IN_PROGRESS', 'REWORK_COMPLETED', 'SHIPPED');

-- CreateEnum
CREATE TYPE "QualityIssueStatus" AS ENUM ('REPORTED', 'INVESTIGATING', 'RESOLVED', 'REJECTED');

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
CREATE TABLE "Addresses" (
    "id" TEXT NOT NULL,
    "provinceID" INTEGER NOT NULL,
    "districtID" INTEGER NOT NULL,
    "wardCode" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "factoryId" TEXT,

    CONSTRAINT "Addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categories" (
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

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Products" (
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

    CONSTRAINT "Products_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "CustomerOrder" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "shippingPrice" INTEGER NOT NULL,
    "depositPaid" INTEGER NOT NULL,
    "orderDate" TIMESTAMP(3) NOT NULL,
    "rating" INTEGER,
    "ratingComment" TEXT,
    "ratedAt" TIMESTAMP(3),
    "ratedBy" TEXT,

    CONSTRAINT "CustomerOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerOrderDetail" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "designId" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "status" "OrderDetailStatus" NOT NULL,

    CONSTRAINT "CustomerOrderDetail_pkey" PRIMARY KEY ("id")
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

    CONSTRAINT "PaymentTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderHistory" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "note" TEXT,

    CONSTRAINT "OrderHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "taskname" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "expiredTime" TIMESTAMP(3) NOT NULL,
    "qualityCheckStatus" "QualityCheckStatus" NOT NULL,
    "taskType" TEXT,
    "factoryOrderId" TEXT,
    "assignedBy" TEXT,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StaffTask" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "assignedDate" TIMESTAMP(3) NOT NULL,
    "note" TEXT,
    "status" "StaffTaskStatus" NOT NULL,
    "completedDate" TIMESTAMP(3),

    CONSTRAINT "StaffTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckQuality" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "orderDetailId" TEXT NOT NULL,
    "factoryOrderDetailId" TEXT,
    "totalChecked" INTEGER NOT NULL,
    "passedQuantity" INTEGER NOT NULL,
    "failedQuantity" INTEGER NOT NULL,
    "status" "QualityCheckStatus" NOT NULL,
    "reworkRequired" BOOLEAN NOT NULL,
    "note" TEXT,
    "checkedAt" TIMESTAMP(3) NOT NULL,
    "checkedBy" TEXT,

    CONSTRAINT "CheckQuality_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FactoryProduct" (
    "factoryId" TEXT NOT NULL,
    "systemConfigVariantId" TEXT NOT NULL,
    "productionCapacity" INTEGER NOT NULL,
    "estimatedProductionTime" INTEGER NOT NULL,

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
    "totalEmployees" INTEGER NOT NULL,
    "maxPrintingCapacity" INTEGER NOT NULL,
    "qualityCertifications" TEXT,
    "printingMethods" TEXT[],
    "specializations" TEXT[],
    "contactPersonName" TEXT,
    "contactPersonRole" TEXT,
    "contactPhone" TEXT,
    "operationalHours" TEXT NOT NULL,
    "leadTime" INTEGER,
    "minimumOrderQuantity" INTEGER NOT NULL,
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
CREATE TABLE "FactoryOrder" (
    "id" TEXT NOT NULL,
    "factoryId" TEXT NOT NULL,
    "customerOrderId" TEXT NOT NULL,
    "status" "FactoryOrderStatus" NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL,
    "acceptanceDeadline" TIMESTAMP(3) NOT NULL,
    "acceptedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "estimatedCompletionDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "shippedAt" TIMESTAMP(3),
    "totalItems" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "totalProductionCost" INTEGER NOT NULL,
    "lastUpdated" TIMESTAMP(3),
    "currentProgress" INTEGER,
    "delayReason" TEXT,
    "isDelayed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "FactoryOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RejectedFactoryOrders" (
    "id" TEXT NOT NULL,
    "factoryOrderId" TEXT NOT NULL,
    "factoryId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "rejectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reassignedTo" TEXT,
    "reassignedAt" TIMESTAMP(3),

    CONSTRAINT "RejectedFactoryOrders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FactoryOrderDetail" (
    "id" TEXT NOT NULL,
    "designId" TEXT NOT NULL,
    "factoryOrderId" TEXT NOT NULL,
    "orderDetailId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "status" "OrderDetailStatus" NOT NULL DEFAULT 'PENDING',
    "completedQty" INTEGER NOT NULL DEFAULT 0,
    "rejectedQty" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "productionCost" INTEGER NOT NULL,
    "isRework" BOOLEAN NOT NULL DEFAULT false,
    "qualityStatus" "QualityCheckStatus",
    "qualityCheckedAt" TIMESTAMP(3),
    "qualityCheckedBy" TEXT,

    CONSTRAINT "FactoryOrderDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FactoryProgressReport" (
    "id" TEXT NOT NULL,
    "factoryOrderId" TEXT NOT NULL,
    "reportDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed" INTEGER,
    "estimatedCompletion" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "photoUrls" TEXT[],

    CONSTRAINT "FactoryProgressReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QualityIssue" (
    "id" TEXT NOT NULL,
    "factoryOrderId" TEXT NOT NULL,
    "reportedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reportedBy" TEXT,
    "assignedTo" TEXT,
    "issueType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "photoUrls" TEXT[],
    "status" "QualityIssueStatus" NOT NULL,
    "resolution" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "resolvedBy" TEXT,

    CONSTRAINT "QualityIssue_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "CartItems" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "designId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CartItems_pkey" PRIMARY KEY ("id")
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

-- AddForeignKey
ALTER TABLE "Addresses" ADD CONSTRAINT "Addresses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Products" ADD CONSTRAINT "Products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SystemConfigDiscount" ADD CONSTRAINT "SystemConfigDiscount_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SystemConfigVariant" ADD CONSTRAINT "SystemConfigVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductPositionType" ADD CONSTRAINT "ProductPositionType_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
ALTER TABLE "CustomerOrder" ADD CONSTRAINT "CustomerOrder_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerOrderDetail" ADD CONSTRAINT "CustomerOrderDetail_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "CustomerOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerOrderDetail" ADD CONSTRAINT "CustomerOrderDetail_designId_fkey" FOREIGN KEY ("designId") REFERENCES "ProductDesign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "CustomerOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentTransaction" ADD CONSTRAINT "PaymentTransaction_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentTransaction" ADD CONSTRAINT "PaymentTransaction_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderHistory" ADD CONSTRAINT "OrderHistory_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "CustomerOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_factoryOrderId_fkey" FOREIGN KEY ("factoryOrderId") REFERENCES "FactoryOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffTask" ADD CONSTRAINT "StaffTask_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffTask" ADD CONSTRAINT "StaffTask_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckQuality" ADD CONSTRAINT "CheckQuality_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckQuality" ADD CONSTRAINT "CheckQuality_orderDetailId_fkey" FOREIGN KEY ("orderDetailId") REFERENCES "CustomerOrderDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckQuality" ADD CONSTRAINT "CheckQuality_factoryOrderDetailId_fkey" FOREIGN KEY ("factoryOrderDetailId") REFERENCES "FactoryOrderDetail"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactoryProduct" ADD CONSTRAINT "FactoryProduct_factoryId_fkey" FOREIGN KEY ("factoryId") REFERENCES "Factory"("factoryOwnerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactoryProduct" ADD CONSTRAINT "FactoryProduct_systemConfigVariantId_fkey" FOREIGN KEY ("systemConfigVariantId") REFERENCES "SystemConfigVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Factory" ADD CONSTRAINT "Factory_factoryOwnerId_fkey" FOREIGN KEY ("factoryOwnerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Factory" ADD CONSTRAINT "Factory_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Factory" ADD CONSTRAINT "Factory_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactoryOrder" ADD CONSTRAINT "FactoryOrder_factoryId_fkey" FOREIGN KEY ("factoryId") REFERENCES "Factory"("factoryOwnerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactoryOrder" ADD CONSTRAINT "FactoryOrder_customerOrderId_fkey" FOREIGN KEY ("customerOrderId") REFERENCES "CustomerOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RejectedFactoryOrders" ADD CONSTRAINT "RejectedFactoryOrders_factoryOrderId_fkey" FOREIGN KEY ("factoryOrderId") REFERENCES "FactoryOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RejectedFactoryOrders" ADD CONSTRAINT "RejectedFactoryOrders_factoryId_fkey" FOREIGN KEY ("factoryId") REFERENCES "Factory"("factoryOwnerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactoryOrderDetail" ADD CONSTRAINT "FactoryOrderDetail_factoryOrderId_fkey" FOREIGN KEY ("factoryOrderId") REFERENCES "FactoryOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactoryOrderDetail" ADD CONSTRAINT "FactoryOrderDetail_designId_fkey" FOREIGN KEY ("designId") REFERENCES "ProductDesign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactoryOrderDetail" ADD CONSTRAINT "FactoryOrderDetail_orderDetailId_fkey" FOREIGN KEY ("orderDetailId") REFERENCES "CustomerOrderDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactoryProgressReport" ADD CONSTRAINT "FactoryProgressReport_factoryOrderId_fkey" FOREIGN KEY ("factoryOrderId") REFERENCES "FactoryOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QualityIssue" ADD CONSTRAINT "QualityIssue_factoryOrderId_fkey" FOREIGN KEY ("factoryOrderId") REFERENCES "FactoryOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItems" ADD CONSTRAINT "CartItems_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItems" ADD CONSTRAINT "CartItems_designId_fkey" FOREIGN KEY ("designId") REFERENCES "ProductDesign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
