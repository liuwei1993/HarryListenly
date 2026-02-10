-- HarryListenly 数据库初始化脚本（建库+建表）
-- 用法: mysql -u root -p < init.sql 或 mysql -u root -p -h 主机 -P 端口 < init.sql
-- 生产/云RDS: 若库已在控制台创建，请用 init-tables.sql

CREATE DATABASE IF NOT EXISTS harrylistenly
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE harrylistenly;

-- 分类表（支持父子层级）
CREATE TABLE IF NOT EXISTS `Category` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `cover` VARCHAR(191) NULL,
  `parentId` VARCHAR(191) NULL,
  PRIMARY KEY (`id`),
  INDEX `Category_parentId_idx` (`parentId`),
  CONSTRAINT `Category_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Category` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 专辑表
CREATE TABLE IF NOT EXISTS `Album` (
  `id` VARCHAR(191) NOT NULL,
  `title` VARCHAR(191) NOT NULL,
  `cover` VARCHAR(191) NOT NULL,
  `description` LONGTEXT NOT NULL,
  `author` VARCHAR(191) NOT NULL,
  `categoryId` VARCHAR(191) NOT NULL,
  `playCount` INT NOT NULL DEFAULT 0,
  `subscribeCount` INT NOT NULL DEFAULT 0,
  `episodeCount` INT NOT NULL DEFAULT 0,
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `Album_categoryId_idx` (`categoryId`),
  CONSTRAINT `Album_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 单集表
CREATE TABLE IF NOT EXISTS `Episode` (
  `id` VARCHAR(191) NOT NULL,
  `albumId` VARCHAR(191) NOT NULL,
  `title` VARCHAR(191) NOT NULL,
  `duration` INT NOT NULL,
  `audioUrl` VARCHAR(191) NOT NULL,
  `order` INT NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `Episode_albumId_idx` (`albumId`),
  CONSTRAINT `Episode_albumId_fkey` FOREIGN KEY (`albumId`) REFERENCES `Album` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
