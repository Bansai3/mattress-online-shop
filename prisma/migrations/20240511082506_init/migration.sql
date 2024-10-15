-- CreateTable
CREATE TABLE "statistics" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "count" INTEGER NOT NULL,

    CONSTRAINT "statistics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "statistics_url_key" ON "statistics"("url");
