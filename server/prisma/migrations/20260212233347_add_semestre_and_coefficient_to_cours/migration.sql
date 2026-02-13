/*
  Warnings:

  - Added the required column `coefficient` to the `Cours` table without a default value. This is not possible if the table is not empty.
  - Added the required column `semestre` to the `Cours` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Semestre" AS ENUM ('S1', 'S2');

-- AlterTable
ALTER TABLE "Cours" ADD COLUMN     "coefficient" INTEGER NOT NULL,
ADD COLUMN     "semestre" "Semestre" NOT NULL;
