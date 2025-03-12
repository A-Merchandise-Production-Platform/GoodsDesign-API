-- CreateTable
CREATE TABLE "BlankVariances" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "information" JSONB NOT NULL,
    "blankPrice" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "BlankVariances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductPositionType" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "positionName" TEXT NOT NULL,
    "basePrice" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "ProductPositionType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductDesigns" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "blankVariantId" TEXT NOT NULL,
    "saved3DPreviewUrl" TEXT NOT NULL,
    "isFinalized" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "isTemplate" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ProductDesigns_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "DesignPosition" (
    "id" TEXT NOT NULL,
    "designId" TEXT NOT NULL,
    "productPositionTypeId" TEXT NOT NULL,
    "designJSON" JSONB NOT NULL,

    CONSTRAINT "DesignPosition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerOrders" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "totalPrice" DECIMAL(65,30) NOT NULL,
    "shippingPrice" DECIMAL(65,30) NOT NULL,
    "depositPaid" DECIMAL(65,30) NOT NULL,
    "orderDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerOrders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerOrderDetails" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "designId" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "qualityCheckStatus" TEXT NOT NULL,
    "reworkStatus" TEXT NOT NULL,

    CONSTRAINT "CustomerOrderDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payments" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "type" TEXT NOT NULL,
    "paymentLog" TEXT NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentTransactions" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "paymentGatewayTransactionId" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "type" TEXT NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "transactionLog" TEXT NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentTransactions_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "Tasks" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "taskname" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "expiredTime" TIMESTAMP(3) NOT NULL,
    "qualityCheckStatus" TEXT NOT NULL,

    CONSTRAINT "Tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckQuality" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "orderDetailId" TEXT NOT NULL,
    "totalChecked" INTEGER NOT NULL,
    "passedQuantity" INTEGER NOT NULL,
    "failedQuantity" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "reworkRequired" BOOLEAN NOT NULL,
    "note" TEXT,
    "checkedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CheckQuality_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StaffTasks" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "assignedDate" TIMESTAMP(3) NOT NULL,
    "note" TEXT,
    "status" TEXT NOT NULL,
    "completedDate" TIMESTAMP(3),

    CONSTRAINT "StaffTasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FactoryProducts" (
    "id" TEXT NOT NULL,
    "factoryId" TEXT NOT NULL,
    "blankVarianceId" TEXT NOT NULL,
    "productionCapacity" INTEGER NOT NULL,
    "estimatedProductionTime" INTEGER NOT NULL,

    CONSTRAINT "FactoryProducts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Factory" (
    "factoryOwnerId" TEXT NOT NULL,
    "information" JSONB NOT NULL,
    "contract" JSONB NOT NULL,

    CONSTRAINT "Factory_pkey" PRIMARY KEY ("factoryOwnerId")
);

-- CreateTable
CREATE TABLE "FactoryOrders" (
    "id" TEXT NOT NULL,
    "factoryId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "estimatedCompletionDate" TIMESTAMP(3) NOT NULL,
    "totalItems" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "totalProductionCost" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "FactoryOrders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FactoryOrderDetails" (
    "id" TEXT NOT NULL,
    "designId" TEXT NOT NULL,
    "factoryOrderId" TEXT NOT NULL,
    "orderDetailId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "productionCost" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "FactoryOrderDetails_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BlankVariances" ADD CONSTRAINT "BlankVariances_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductPositionType" ADD CONSTRAINT "ProductPositionType_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductDesigns" ADD CONSTRAINT "ProductDesigns_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductDesigns" ADD CONSTRAINT "ProductDesigns_blankVariantId_fkey" FOREIGN KEY ("blankVariantId") REFERENCES "BlankVariances"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteDesign" ADD CONSTRAINT "FavoriteDesign_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteDesign" ADD CONSTRAINT "FavoriteDesign_designId_fkey" FOREIGN KEY ("designId") REFERENCES "ProductDesigns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesignPosition" ADD CONSTRAINT "DesignPosition_designId_fkey" FOREIGN KEY ("designId") REFERENCES "ProductDesigns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesignPosition" ADD CONSTRAINT "DesignPosition_productPositionTypeId_fkey" FOREIGN KEY ("productPositionTypeId") REFERENCES "ProductPositionType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerOrders" ADD CONSTRAINT "CustomerOrders_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerOrderDetails" ADD CONSTRAINT "CustomerOrderDetails_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "CustomerOrders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerOrderDetails" ADD CONSTRAINT "CustomerOrderDetails_designId_fkey" FOREIGN KEY ("designId") REFERENCES "ProductDesigns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "CustomerOrders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentTransactions" ADD CONSTRAINT "PaymentTransactions_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentTransactions" ADD CONSTRAINT "PaymentTransactions_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "CustomerOrders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentTransactions" ADD CONSTRAINT "PaymentTransactions_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderHistory" ADD CONSTRAINT "OrderHistory_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "CustomerOrders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckQuality" ADD CONSTRAINT "CheckQuality_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckQuality" ADD CONSTRAINT "CheckQuality_orderDetailId_fkey" FOREIGN KEY ("orderDetailId") REFERENCES "CustomerOrderDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffTasks" ADD CONSTRAINT "StaffTasks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffTasks" ADD CONSTRAINT "StaffTasks_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactoryProducts" ADD CONSTRAINT "FactoryProducts_factoryId_fkey" FOREIGN KEY ("factoryId") REFERENCES "Factory"("factoryOwnerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactoryProducts" ADD CONSTRAINT "FactoryProducts_blankVarianceId_fkey" FOREIGN KEY ("blankVarianceId") REFERENCES "BlankVariances"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Factory" ADD CONSTRAINT "Factory_factoryOwnerId_fkey" FOREIGN KEY ("factoryOwnerId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactoryOrders" ADD CONSTRAINT "FactoryOrders_factoryId_fkey" FOREIGN KEY ("factoryId") REFERENCES "Factory"("factoryOwnerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactoryOrderDetails" ADD CONSTRAINT "FactoryOrderDetails_factoryOrderId_fkey" FOREIGN KEY ("factoryOrderId") REFERENCES "FactoryOrders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactoryOrderDetails" ADD CONSTRAINT "FactoryOrderDetails_designId_fkey" FOREIGN KEY ("designId") REFERENCES "ProductDesigns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactoryOrderDetails" ADD CONSTRAINT "FactoryOrderDetails_orderDetailId_fkey" FOREIGN KEY ("orderDetailId") REFERENCES "CustomerOrderDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
