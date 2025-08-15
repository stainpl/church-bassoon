/*
  Warnings:

  - Added the required column `addedBy` to the `Notice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Notice" ADD COLUMN     "addedBy" TEXT NOT NULL,
ADD COLUMN     "removedAt" TIMESTAMP(3),
ADD COLUMN     "removedBy" TEXT;

-- AddForeignKey
ALTER TABLE "public"."Notice" ADD CONSTRAINT "Notice_addedBy_fkey" FOREIGN KEY ("addedBy") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notice" ADD CONSTRAINT "Notice_removedBy_fkey" FOREIGN KEY ("removedBy") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
