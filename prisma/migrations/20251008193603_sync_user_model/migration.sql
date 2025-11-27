-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "phone" TEXT,
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "password" DROP NOT NULL;
