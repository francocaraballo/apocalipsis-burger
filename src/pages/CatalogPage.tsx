import { useRef } from 'react';
import { Hero } from '../components/Hero';
import { ProductGrid } from '../components/ProductGrid';
import type { Product } from '../types';
import productsData from '../data/products.json';

const products = productsData as Product[];

interface CatalogPageProps {
  onCartOpen?: () => void;
}

export function CatalogPage({ onCartOpen }: CatalogPageProps) {
  const catalogRef = useRef<HTMLDivElement>(null);

  function scrollToCatalog() {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <main className="pb-nav" style={{ paddingTop: '56px' }}>
      <Hero onViewMenu={scrollToCatalog} onOpenCart={onCartOpen} />
      <div ref={catalogRef}>
        <ProductGrid products={products} onAddedToCart={onCartOpen} />
      </div>
    </main>
  );
}
