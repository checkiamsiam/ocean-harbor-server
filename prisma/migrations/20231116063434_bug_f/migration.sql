/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `account_requests` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `account_requests` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `account_requests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "account_requests" ADD COLUMN     "email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "account_requests_email_key" ON "account_requests"("email");

-- CreateIndex
CREATE UNIQUE INDEX "account_requests_phone_key" ON "account_requests"("phone");
