ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS images text[] NOT NULL DEFAULT ARRAY[]::text[];

UPDATE public.products
SET images = ARRAY[image]
WHERE image IS NOT NULL
  AND cardinality(images) = 0;
