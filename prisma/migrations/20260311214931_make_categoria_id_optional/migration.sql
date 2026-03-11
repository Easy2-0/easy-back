-- DropForeignKey
ALTER TABLE `transacao` DROP FOREIGN KEY `transacao_categoriaId_fkey`;

-- AlterTable
ALTER TABLE `transacao` MODIFY `categoriaId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `transacao` ADD CONSTRAINT `transacao_categoriaId_fkey` FOREIGN KEY (`categoriaId`) REFERENCES `categoria`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
