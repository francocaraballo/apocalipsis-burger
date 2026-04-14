import { supabase } from '../lib/supabaseClient';
import type { Product } from '../types';

export const getProducts = async (): Promise<Product[]> => {
	// Hacemos el JOIN con categories y product_variants adaptándonos a tu schema real
	const { data, error } = await supabase.from('products').select(`
			id,
			name,
			description,
			image_url,
			is_available,
			categories ( slug ),
			product_variants ( size_name, price )
		`);

	if (error) {
		console.error('Error al traer los productos:', error.message);
		throw error;
	}

	// Parseamos la data cruda para que matchee perfecto con tu interfaz Product del front
	const parsedData: Product[] = (data || []).map((item: any) => {
		let price: number | undefined = undefined;
		let prices: Product['prices'] = undefined;

		// Mapeamos las variantes a price o prices según corresponda
		if (item.product_variants && item.product_variants.length > 0) {
			const variants = item.product_variants;

			if (variants.length === 1) {
				// Único precio (ej: papas, gaseosa) o una sola variante definida
				price = Number(variants[0].price);
			} else {
				// Mapa para normalizar nombres de la BD a las keys que usa tu interfaz TypeScript
				const sizeMap: Record<string, string> = {
					simple: 'simple',
					doble: 'doble',
					triple: 'triple',
					cuadruple: 'cuadruple',
					quintuple: 'quintuple',
				};

				// Iteramos las variantes UNA SOLA VEZ (patrón reduce + diccionario) en vez de hacer 5 .find()
				const builtPrices = variants.reduce((acc: any, v: any) => {
					const matchedKey = sizeMap[v.size_name.toLowerCase()];
					if (matchedKey) acc[matchedKey] = Number(v.price);
					return acc;
				}, {});

				// Verificamos si al armarlo nos quedaron las variantes core (simple y doble)
				if (builtPrices.simple && builtPrices.doble) {
					prices = builtPrices as Product['prices'];
				} else {
					price = Number(variants[0].price); // Fallback robusto
				}
			}
		}

		return {
			id: item.id,
			name: item.name,
			description: item.description || '',
			image: item.image_url || '',
			available: item.is_available ?? true,
			category: (item.categories?.slug ||
				'clasicas') as Product['category'],
			price,
			prices,
		};
	});

	return parsedData;
};
