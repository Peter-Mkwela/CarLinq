/*
  Warnings:

  - The values [CLIENT] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `ContactMessage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PasswordReset` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `accounts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `downloads` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `orders` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `payments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `services` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sessions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `support_ticket_messages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `support_tickets` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `verification_tokens` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[googleId]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Made the column `name` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "public"."CarStatus" AS ENUM ('AVAILABLE', 'SOLD', 'PENDING', 'UNAVAILABLE');

-- AlterEnum
BEGIN;
CREATE TYPE "public"."UserRole_new" AS ENUM ('ADMIN', 'DEALER');
ALTER TABLE "public"."users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "public"."users" ALTER COLUMN "role" TYPE "public"."UserRole_new" USING ("role"::text::"public"."UserRole_new");
ALTER TYPE "public"."UserRole" RENAME TO "UserRole_old";
ALTER TYPE "public"."UserRole_new" RENAME TO "UserRole";
DROP TYPE "public"."UserRole_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."accounts" DROP CONSTRAINT "accounts_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."downloads" DROP CONSTRAINT "downloads_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."orders" DROP CONSTRAINT "orders_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "public"."orders" DROP CONSTRAINT "orders_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."payments" DROP CONSTRAINT "payments_orderId_fkey";

-- DropForeignKey
ALTER TABLE "public"."payments" DROP CONSTRAINT "payments_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."sessions" DROP CONSTRAINT "sessions_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."support_ticket_messages" DROP CONSTRAINT "support_ticket_messages_ticketId_fkey";

-- DropForeignKey
ALTER TABLE "public"."support_ticket_messages" DROP CONSTRAINT "support_ticket_messages_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."support_tickets" DROP CONSTRAINT "support_tickets_userId_fkey";

-- AlterTable
ALTER TABLE "public"."users" DROP CONSTRAINT "users_pkey",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "companyName" TEXT,
ADD COLUMN     "googleId" TEXT,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "provider" TEXT,
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "role" DROP DEFAULT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "users_id_seq";

-- DropTable
DROP TABLE "public"."ContactMessage";

-- DropTable
DROP TABLE "public"."PasswordReset";

-- DropTable
DROP TABLE "public"."accounts";

-- DropTable
DROP TABLE "public"."downloads";

-- DropTable
DROP TABLE "public"."orders";

-- DropTable
DROP TABLE "public"."payments";

-- DropTable
DROP TABLE "public"."services";

-- DropTable
DROP TABLE "public"."sessions";

-- DropTable
DROP TABLE "public"."support_ticket_messages";

-- DropTable
DROP TABLE "public"."support_tickets";

-- DropTable
DROP TABLE "public"."verification_tokens";

-- DropEnum
DROP TYPE "public"."OrderStatus";

-- DropEnum
DROP TYPE "public"."PaymentMethod";

-- DropEnum
DROP TYPE "public"."PaymentStatus";

-- DropEnum
DROP TYPE "public"."Priority";

-- DropEnum
DROP TYPE "public"."TicketStatus";

-- CreateTable
CREATE TABLE "public"."listings" (
    "id" TEXT NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "mileage" INTEGER NOT NULL,
    "status" "public"."CarStatus" NOT NULL DEFAULT 'AVAILABLE',
    "description" TEXT,
    "images" TEXT[],
    "views" INTEGER NOT NULL DEFAULT 0,
    "inquiries" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "dealerId" TEXT NOT NULL,

    CONSTRAINT "listings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_googleId_key" ON "public"."users"("googleId");

-- AddForeignKey
ALTER TABLE "public"."listings" ADD CONSTRAINT "listings_dealerId_fkey" FOREIGN KEY ("dealerId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
