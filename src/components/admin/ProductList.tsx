import { Trash2, Pencil } from 'lucide-react';
import type { Product } from '../../types';

interface ProductListProps {
	products: Product[];
	onDeleteProduct: (id: string) => void;
	onEditProduct: (product: Product) => void;
}

export function ProductList({ products, onDeleteProduct, onEditProduct }: ProductListProps) {
	return (
		<section aria-label='Lista de productos'>
			<h2
				className='text-xl font-bold uppercase text-[var(--color-on-surface)] mb-4'
				style={{ fontFamily: 'var(--font-display)' }}
			>
				Productos actuales ({products.length})
			</h2>
			<div className='flex flex-col gap-3'>
				{products.map((product) => (
					<div
						key={product.id}
						className='flex items-center gap-4 p-4 rounded-[var(--radius-card)]'
						style={{
							background: 'var(--color-surface-container)',
						}}
					>
						<img
							src={
								product.image ||
								`https://placehold.co/64x64/1c1b1b/ffc788?text=${encodeURIComponent(product.name[0])}`
							}
							alt=''
							aria-hidden='true'
							className='w-14 h-14 object-cover rounded shrink-0'
						/>
						<div className='flex-1 min-w-0'>
							<p
								className='font-semibold text-[var(--color-on-surface)] truncate'
								style={{
									fontFamily: 'var(--font-display)',
								}}
							>
								{product.name}
							</p>
							<p className='text-xs text-[var(--color-on-surface-variant)] capitalize'>
								{product.category} — $
								{(
									product.price ??
									product.prices?.simple ??
									0
								).toLocaleString('es-AR')}
							</p>
						</div>
						<div className='flex items-center gap-1 shrink-0'>
							<button
								id={`edit-product-${product.id}`}
								onClick={() => onEditProduct(product)}
								aria-label={`Editar producto ${product.name}`}
								className='p-2 text-[var(--color-outline)] hover:text-[var(--color-primary)] transition-colors cursor-pointer'
							>
								<Pencil size={16} aria-hidden='true' />
							</button>
							<button
								id={`delete-product-${product.id}`}
								onClick={() => onDeleteProduct(product.id)}
								aria-label={`Eliminar producto ${product.name}`}
								className='p-2 text-[var(--color-outline)] hover:text-[var(--color-error)] transition-colors cursor-pointer'
							>
								<Trash2 size={16} aria-hidden='true' />
							</button>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}

