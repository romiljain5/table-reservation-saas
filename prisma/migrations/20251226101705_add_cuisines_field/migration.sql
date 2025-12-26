-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN     "cuisines" TEXT[] DEFAULT ARRAY[]::TEXT[];
