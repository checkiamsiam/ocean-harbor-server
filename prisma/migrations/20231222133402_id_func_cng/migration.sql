/*
  Warnings:

  - The primary key for the `admin_notifications` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `admin_notifications` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `user_notifications` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `user_notifications` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[id]` on the table `account_requests` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `admin_notifications` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `admins` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `brands` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `categories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `customers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `orders` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `products` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `sub_categories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `user_notifications` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "admin_notifications" DROP CONSTRAINT "admin_notifications_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "admin_notifications_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "user_notifications" DROP CONSTRAINT "user_notifications_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "user_notifications_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "account_requests_id_key" ON "account_requests"("id");

-- CreateIndex
CREATE UNIQUE INDEX "admin_notifications_id_key" ON "admin_notifications"("id");

-- CreateIndex
CREATE UNIQUE INDEX "admins_id_key" ON "admins"("id");

-- CreateIndex
CREATE UNIQUE INDEX "brands_id_key" ON "brands"("id");

-- CreateIndex
CREATE UNIQUE INDEX "categories_id_key" ON "categories"("id");

-- CreateIndex
CREATE UNIQUE INDEX "customers_id_key" ON "customers"("id");

-- CreateIndex
CREATE UNIQUE INDEX "orders_id_key" ON "orders"("id");

-- CreateIndex
CREATE UNIQUE INDEX "products_id_key" ON "products"("id");

-- CreateIndex
CREATE UNIQUE INDEX "sub_categories_id_key" ON "sub_categories"("id");

-- CreateIndex
CREATE UNIQUE INDEX "user_notifications_id_key" ON "user_notifications"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "users"("id");
