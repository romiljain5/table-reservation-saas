/*
  Warnings:

  - You are about to drop the column `guests` on the `Reservation` table. All the data in the column will be lost.
  - Added the required column `guestName` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `partySize` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "guests",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "guestName" TEXT NOT NULL,
ADD COLUMN     "partySize" INTEGER NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
