import { useState } from 'react';
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
  const [activeCategory, setActiveCategory] = useState<ProductCategory | null>(null);

  // Agrupar productos por categoría
  const grouped = CATEGORY_ORDER.reduce<Record<ProductCategory, Product[]>>(
    (acc, cat) => {
      acc[cat] = products.filter((p) => p.category === cat && p.available);
      return acc;
    },
    { premium: [], clasicas: [], veggie: [], extras: [] }
  );

  // Categorías que tienen al menos un producto disponible
  const availableCategories = CATEGORY_ORDER.filter((cat) => grouped[cat].length > 0);

  // Categorías a renderizar según el filtro activo
  const categoriesToRender = activeCategory
    ? availableCategories.filter((cat) => cat === activeCategory)
    : availableCategories;

  return (
    <section id="catalogo" aria-label="Catálogo de productos" className="product-grid-section">
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

      {/* Filtros de categoría */}
      <div
        className="flex gap-2 px-4 pb-4 overflow-x-auto"
        style={{ scrollbarWidth: 'none' }}
        role="tablist"
        aria-label="Filtrar por categoría"
      >
        {/* Botón "Todas" */}
        <button
          role="tab"
          aria-selected={activeCategory === null}
          onClick={() => setActiveCategory(null)}
          className="flex-shrink-0 px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer"
          style={{
            fontFamily: 'var(--font-display)',
            letterSpacing: '0.08em',
            borderRadius: '4px',
            border: '1px solid',
            borderColor: activeCategory === null ? 'var(--color-primary)' : 'var(--color-outline-variant)',
            background: activeCategory === null ? 'var(--color-primary)' : 'transparent',
            color: activeCategory === null ? 'var(--color-on-primary)' : 'var(--color-on-surface-variant)',
          }}
        >
          Todas
        </button>

        {availableCategories.map((cat) => (
          <button
            key={cat}
            role="tab"
            aria-selected={activeCategory === cat}
            onClick={() => setActiveCategory(cat)}
            className="flex-shrink-0 px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer"
            style={{
              fontFamily: 'var(--font-display)',
              letterSpacing: '0.08em',
              borderRadius: '4px',
              border: '1px solid',
              borderColor: activeCategory === cat ? 'var(--color-primary)' : 'var(--color-outline-variant)',
              background: activeCategory === cat ? 'var(--color-primary)' : 'transparent',
              color: activeCategory === cat ? 'var(--color-on-primary)' : 'var(--color-on-surface-variant)',
            }}
          >
            {SECTION_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Lista vertical de productos */}
      <div className="flex flex-col">
        {categoriesToRender.map((cat) => {
          const catProducts = grouped[cat];

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

              {/* Cards — grid en desktop, columna en mobile */}
              <div className="product-grid-container">
                {catProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddedToCart={onAddedToCart}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

