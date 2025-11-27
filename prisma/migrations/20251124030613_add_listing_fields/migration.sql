/*
  Warnings:

  - Added the required column `location` to the `listings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."listings" ADD COLUMN     "fuelType" TEXT,
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "transmission" TEXT;
