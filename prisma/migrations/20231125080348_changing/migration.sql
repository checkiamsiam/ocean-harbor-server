/*
  Warnings:

  - You are about to drop the column `url` on the `admin_notifications` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "AdminNotificationType" AS ENUM ('AccountRequest', 'quotationRequest', 'confirmOrder', 'declineOrder');

-- CreateEnum
CREATE TYPE "CustomerNotificationType" AS ENUM ('auotationApproved', 'auotationDeclined', 'invoiceAdded');

-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE 'declined';

-- AlterTable
ALTER TABLE "admin_notifications" DROP COLUMN "url",
ADD COLUMN     "refId" TEXT,
ADD COLUMN     "type" "AdminNotificationType";

-- AlterTable
ALTER TABLE "user_notifications" ADD COLUMN     "refId" TEXT,
ADD COLUMN     "type" "CustomerNotificationType";
