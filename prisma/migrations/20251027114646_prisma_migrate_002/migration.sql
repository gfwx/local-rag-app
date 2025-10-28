/*
  Warnings:

  - You are about to drop the `Chats` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Chats" DROP CONSTRAINT "Chats_projectId_fkey";

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "chats" TEXT[];

-- DropTable
DROP TABLE "public"."Chats";
