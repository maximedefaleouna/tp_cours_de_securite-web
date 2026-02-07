/*
  Warnings:

  - Added the required column `createdById` to the `Cours` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedById` to the `Cours` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `Formation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedById` to the `Formation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `FormationResponsable` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedById` to the `FormationResponsable` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `Note` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedById` to the `Note` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Administration" ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "updatedById" TEXT;

-- AlterTable
ALTER TABLE "Cours" ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "updatedById" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Formation" ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "updatedById" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "FormationResponsable" ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "updatedById" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "updatedById" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Administration" ADD CONSTRAINT "Administration_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Administration"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Administration" ADD CONSTRAINT "Administration_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "Administration"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Formation" ADD CONSTRAINT "Formation_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Administration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Formation" ADD CONSTRAINT "Formation_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "Administration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormationResponsable" ADD CONSTRAINT "FormationResponsable_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Administration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormationResponsable" ADD CONSTRAINT "FormationResponsable_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "Administration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cours" ADD CONSTRAINT "Cours_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Administration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cours" ADD CONSTRAINT "Cours_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "Administration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Administration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "Administration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
