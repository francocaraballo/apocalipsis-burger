import type { Product, ProductCategory } from '../types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  onAddedToCart?: () => void;
}

const SECTION_LABELS: Record<ProductCategory, string> = {
  clasicas: 'Clásicas',
  premium: 'Premium',
  veggie: 'Veggie',
  extras: 'Extras'
};

const CATEGORY_ORDER: ProductCategory[] = ['premium', 'clasicas', 'veggie', 'extras'];

export function ProductGrid({ products, onAddedToCart }: ProductGridProps) {
  // Agrupar productos por categoría
  const grouped = CATEGORY_ORDER.reduce<Record<ProductCategory, Product[]>>(
    (acc, cat) => {
      acc[cat] = products.filter((p) => p.category === cat && p.available);
      return acc;
    },
    { premium: [], clasicas: [], veggie: [], extras: [] }
  );

  return (
    <section id="catalogo" aria-label="Catálogo de productos">
      {/* Header de sección */}
      <div className="px-4 pt-6 pb-4">
        <p
          className="text-xs uppercase tracking-[0.15em] font-semibold mb-1"
          style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-display)' }}
        >
          NUESTRAS BURGERS
        </p>
        <h2
          className="font-bold uppercase leading-none"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2rem',
            color: 'var(--color-on-surface)',
            letterSpacing: '-0.02em',
          }}
        >
          NUESTRAS{' '}
          <span style={{ color: 'var(--color-primary)' }}>BURGERS</span>
        </h2>
      </div>

      {/* Lista vertical de productos —  una columna, como en Stitch */}
      <div className="flex flex-col">
        {CATEGORY_ORDER.map((cat) => {
          const catProducts = grouped[cat];
          if (catProducts.length === 0) return null;

          return (
            <div key={cat}>
              {/* Separador de categoría */}
              <div
                className="px-4 py-2 flex items-center gap-3"
                style={{ background: 'var(--color-surface-container-lowest)' }}
              >
                <div
                  className="w-1 h-4 rounded-full flex-shrink-0"
                  style={{ background: 'var(--color-primary)' }}
                  aria-hidden="true"
                />
                <span
                  className="text-xs uppercase font-bold tracking-wider"
                  style={{
                    color: 'var(--color-primary)',
                    fontFamily: 'var(--font-display)',
                    letterSpacing: '0.1em',
                  }}
                >
                  {SECTION_LABELS[cat]}
                </span>
              </div>

              {/* Cards en columna */}
              {catProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddedToCart={onAddedToCart}
                />
              ))}
            </div>
          );
        })}
      </div>
    </section>
  );
}
