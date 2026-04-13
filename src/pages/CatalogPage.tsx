import { useRef, useState, useEffect } from 'react';
import { Hero } from '../components/Hero';
import { ProductGrid } from '../components/ProductGrid';
import type { Product } from '../types';
import { getProducts } from '../utils/getProducts';
// import productsData from '../data/products.json';

interface CatalogPageProps {
	onCartOpen?: () => void;
}

export function CatalogPage({ onCartOpen }: CatalogPageProps) {
	const catalogRef = useRef<HTMLDivElement>(null);
	const [items, setItems] = useState<Product[]>([]);

	useEffect(() => {
		getProducts()
			.then((data) => {
				if (data) {
					setItems(data);
					console.log(data);
				}
			})
			.catch(console.error);
	}, []);

	function scrollToCatalog() {
		if (!catalogRef.current) return;
		const navbarHeight = 56;
		const top =
			catalogRef.current.getBoundingClientRect().top +
			window.scrollY -
			navbarHeight;
		window.scrollTo({ top, behavior: 'smooth' });
	}

	return (
		<main style={{ paddingTop: '56px' }}>
			<Hero onViewMenu={scrollToCatalog} onOpenCart={onCartOpen} />
			<div ref={catalogRef}>
				<ProductGrid products={items} onAddedToCart={onCartOpen} />
			</div>
		</main>
	);
}

