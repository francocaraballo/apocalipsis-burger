import { useState, useEffect, useCallback } from 'react';
import type { Product } from '../types';
import { getProducts } from '../utils/getProducts';
import { supabase } from '../lib/supabaseClient';

export function useAdminProducts(isAuthenticated: boolean) {
	const [products, setProducts] = useState<Product[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isActionLoading, setIsActionLoading] = useState(false);

	const fetchProducts = useCallback(async () => {
		setIsLoading(true);
		try {
			const data = await getProducts();
			setProducts(data);
		} catch (error) {
			console.error('Error fetching products:', error);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		if (isAuthenticated) {
			fetchProducts();
		}
	}, [isAuthenticated, fetchProducts]);

	async function getCategoryIdBySlug(slug: string): Promise<string> {
		const { data, error } = await supabase
			.from('categories')
			.select('id, slug');
			
		if (error || !data) throw new Error(`Could not fetch categories`);
		
		const category = data.find(c => c.slug.toLowerCase() === slug.toLowerCase());
		
		if (!category) {
			console.error(`Categoría "${slug}" no encontrada. Las categorías válidas en DB son:`, data.map(c => c.slug));
			throw new Error(`Categoría "${slug}" no existe en la base de datos de Supabase.`);
		}
		
		return category.id;
	}

	async function saveProductVariants(productId: string, product: Partial<Product>) {
		// Clean existing variants before inserting new ones
		await supabase.from('product_variants').delete().eq('product_id', productId);

		if (product.category === 'extras') {
			await supabase.from('product_variants').insert({
				product_id: productId,
				size_name: 'único',
				price: product.price,
			});
		} else if (product.prices) {
			const variants = [];
			const sizeMap: Record<string, string> = {
				simple: 'simple',
				doble: 'doble',
				triple: 'triple',
				cuadruple: 'cuadruple',
				quintuple: 'quintuple',
			};

			for (const [key, value] of Object.entries(product.prices)) {
				if (value && typeof value === 'number') {
					variants.push({
						product_id: productId,
						size_name: sizeMap[key] || key,
						price: value,
					});
				}
			}
			
			if (variants.length > 0) {
				await supabase.from('product_variants').insert(variants);
			}
		}
	}

	async function handleAddProduct(product: Omit<Product, 'id' | 'available'>) {
		setIsActionLoading(true);
		try {
			const categoryId = await getCategoryIdBySlug(product.category);

			const { data: newDbProd, error: insertError } = await supabase
				.from('products')
				.insert({
					name: product.name,
					description: product.description,
					image_url: product.image,
					category_id: categoryId,
					is_available: true,
				})
				.select('id')
				.single();

			if (insertError) throw insertError;

			await saveProductVariants(newDbProd.id, product);
			await fetchProducts(); // Refetch to update list
		} catch (error: any) {
			console.error('Error adding product:', error);
			throw error;
		} finally {
			setIsActionLoading(false);
		}
	}

	async function handleEditProduct(id: string, updatedProduct: Omit<Product, 'id' | 'available'>) {
		setIsActionLoading(true);
		try {
			const categoryId = await getCategoryIdBySlug(updatedProduct.category);

			const { error: updateError } = await supabase
				.from('products')
				.update({
					name: updatedProduct.name,
					description: updatedProduct.description,
					image_url: updatedProduct.image,
					category_id: categoryId,
				})
				.eq('id', id);

			if (updateError) throw updateError;

			await saveProductVariants(id, updatedProduct);
			await fetchProducts();
		} catch (error: any) {
			console.error('Error editing product:', error);
			throw error;
		} finally {
			setIsActionLoading(false);
		}
	}

	async function handleDeleteProduct(id: string) {
		setIsActionLoading(true);
		try {
			// Wipe variants first just in case there's no cascade delete configured
			await supabase.from('product_variants').delete().eq('product_id', id);
			
			const { error } = await supabase.from('products').delete().eq('id', id);
			if (error) throw error;
			
			setProducts((prev) => prev.filter((p) => p.id !== id));
		} catch (error: any) {
			console.error('Error deleting product:', error);
			throw error;
		} finally {
			setIsActionLoading(false);
		}
	}

	return {
		products,
		isLoading,
		isActionLoading,
		handleAddProduct,
		handleEditProduct,
		handleDeleteProduct,
	};
}
