-- AlterTable
ALTER TABLE "products" ADD COLUMN "slug" TEXT;

-- Valores provisórios (únicos) para linhas existentes; o seed regrava a partir do nome
UPDATE "products" SET "slug" = "id" WHERE "slug" IS NULL;

ALTER TABLE "products" ALTER COLUMN "slug" SET NOT NULL;

CREATE UNIQUE INDEX "products_slug_key" ON "products"("slug");
