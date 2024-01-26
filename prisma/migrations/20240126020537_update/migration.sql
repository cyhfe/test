/*
  Warnings:

  - Changed the type of `lastBuildDate` on the `Response` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Response" DROP COLUMN "lastBuildDate",
ADD COLUMN     "lastBuildDate" TIMESTAMP(3) NOT NULL;
