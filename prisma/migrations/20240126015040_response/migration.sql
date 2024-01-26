/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Response" (
    "id" SERIAL NOT NULL,
    "lastBuildDate" TEXT NOT NULL,
    "total" INTEGER NOT NULL,
    "start" INTEGER NOT NULL,
    "display" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Response_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "lprice" TEXT NOT NULL,
    "hprice" TEXT NOT NULL,
    "mallName" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "productType" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "maker" TEXT NOT NULL,
    "category1" TEXT NOT NULL,
    "category2" TEXT NOT NULL,
    "category3" TEXT NOT NULL,
    "category4" TEXT NOT NULL,
    "responseId" INTEGER NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "Response"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
