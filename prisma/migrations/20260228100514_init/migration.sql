/*
  Warnings:

  - A unique constraint covering the columns `[formId,userId]` on the table `Response` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Response` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Response" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Response_formId_userId_key" ON "Response"("formId", "userId");

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
