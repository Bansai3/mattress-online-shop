-- DropForeignKey
ALTER TABLE "mattress" DROP CONSTRAINT "mattress_owner_id_fkey";

-- AlterTable
ALTER TABLE "mattress" ALTER COLUMN "owner_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "mattress" ADD CONSTRAINT "mattress_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
