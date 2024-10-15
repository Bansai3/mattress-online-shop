-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('AUTHENTICATED', 'UNAUTHENTICATED');

-- CreateEnum
CREATE TYPE "MattressType" AS ENUM ('SPRINGLESS', 'CHILDREN', 'BONELSPRINGUNIT', 'INDEPENDENTSPRINGUNIT', 'MAJORLEAGUE');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('SOLD', 'AVAILABLE');

-- CreateTable
CREATE TABLE "mattress" (
    "id" SERIAL NOT NULL,
    "type" "MattressType" NOT NULL,
    "recommended" BOOLEAN NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "cost" DECIMAL(65,30) NOT NULL,
    "manufacture_date" TIMESTAMP(3) NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "status" "Status" NOT NULL,

    CONSTRAINT "mattress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart_mattresses" (
    "mattress_id" INTEGER NOT NULL,
    "cart_id" INTEGER NOT NULL,

    CONSTRAINT "cart_mattresses_pkey" PRIMARY KEY ("mattress_id","cart_id")
);

-- CreateTable
CREATE TABLE "order" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "cost" INTEGER NOT NULL,

    CONSTRAINT "order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_mattresses" (
    "mattress_id" INTEGER NOT NULL,
    "order_id" INTEGER NOT NULL,

    CONSTRAINT "order_mattresses_pkey" PRIMARY KEY ("mattress_id","order_id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "fio" TEXT,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "login" VARCHAR(255) NOT NULL,
    "role" "Role" NOT NULL,
    "status" "UserStatus" NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cart_user_id_key" ON "cart"("user_id");

-- AddForeignKey
ALTER TABLE "mattress" ADD CONSTRAINT "mattress_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart" ADD CONSTRAINT "cart_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_mattresses" ADD CONSTRAINT "cart_mattresses_mattress_id_fkey" FOREIGN KEY ("mattress_id") REFERENCES "mattress"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_mattresses" ADD CONSTRAINT "cart_mattresses_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_mattresses" ADD CONSTRAINT "order_mattresses_mattress_id_fkey" FOREIGN KEY ("mattress_id") REFERENCES "mattress"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_mattresses" ADD CONSTRAINT "order_mattresses_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
