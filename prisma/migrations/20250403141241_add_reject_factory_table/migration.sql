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

-- AddForeignKey
ALTER TABLE "RejectedFactoryOrders" ADD CONSTRAINT "RejectedFactoryOrders_factoryOrderId_fkey" FOREIGN KEY ("factoryOrderId") REFERENCES "FactoryOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RejectedFactoryOrders" ADD CONSTRAINT "RejectedFactoryOrders_factoryId_fkey" FOREIGN KEY ("factoryId") REFERENCES "Factory"("factoryOwnerId") ON DELETE RESTRICT ON UPDATE CASCADE;
