import { useState, useEffect } from 'react';
import type { Product } from '../types';
import { getProducts } from '../utils/getProducts';

export function useAdminProducts(isAuthenticated: boolean) {
	const [products, setProducts] = useState<Product[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchProducts() {
			setIsLoading(true);
			try {
				const data = await getProducts();
				setProducts(data);
			} catch (error) {
				console.error('Error fetching products:', error);
			} finally {
				setIsLoading(false);
			}
		}

		if (isAuthenticated) {
			fetchProducts();
		}
	}, [isAuthenticated]);

	function handleAddProduct(newProduct: Product) {
		setProducts((prev) => [...prev, newProduct]);
	}

	function handleDeleteProduct(id: string) {
		if (!confirm('¿Seguro que querés eliminar este producto?')) return;
		setProducts((prev) => prev.filter((p) => p.id !== id));
	}

	return {
		products,
		isLoading,
		handleAddProduct,
		handleDeleteProduct,
	};
}

