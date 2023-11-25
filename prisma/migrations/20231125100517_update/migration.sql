/*
  Warnings:

  - The values [auotationApproved,auotationDeclined] on the enum `CustomerNotificationType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CustomerNotificationType_new" AS ENUM ('quotationApproved', 'quotationDeclined', 'invoiceAdded');
ALTER TABLE "user_notifications" ALTER COLUMN "type" TYPE "CustomerNotificationType_new" USING ("type"::text::"CustomerNotificationType_new");
ALTER TYPE "CustomerNotificationType" RENAME TO "CustomerNotificationType_old";
ALTER TYPE "CustomerNotificationType_new" RENAME TO "CustomerNotificationType";
DROP TYPE "CustomerNotificationType_old";
COMMIT;
