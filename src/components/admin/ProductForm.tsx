import { useState, useEffect } from 'react';
import { Plus, Check, AlertCircle, X } from 'lucide-react';
import type { Product, ProductCategory, ProductPrices } from '../../types';
import { StatusModal } from '../ui/StatusModal';

const CATEGORIES: { value: ProductCategory; label: string }[] = [
	{ value: 'clasicas', label: 'Clásicas' },
	{ value: 'premium', label: 'Premium' },
	{ value: 'veggie', label: 'Veggie' },
	{ value: 'extras', label: 'Extras' },
];

interface ProductFormProps {
	initialData?: Product;
	onSubmitProduct: (product: Omit<Product, 'id' | 'available'>) => Promise<void>;
	onCancelEdit?: () => void;
}

export function ProductForm({
	initialData,
	onSubmitProduct,
	onCancelEdit,
}: ProductFormProps) {
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [image, setImage] = useState('');
	const [category, setCategory] = useState<ProductCategory>('clasicas');

	const [price, setPrice] = useState<number | ''>('');
	const [prices, setPrices] = useState<Partial<ProductPrices>>({
		simple: undefined,
		doble: undefined,
		triple: undefined,
		cuadruple: undefined,
		quintuple: undefined,
	});

	const [formError, setFormError] = useState('');
	const [modalState, setModalState] = useState<{ status: 'idle' | 'loading' | 'success' | 'error', message?: string }>({ status: 'idle' });
	
	const isLoading = modalState.status === 'loading';

	useEffect(() => {
		if (initialData) {
			setName(initialData.name);
			setDescription(initialData.description);
			setImage(initialData.image || '');
			setCategory(initialData.category);

			if (initialData.category === 'extras') {
				setPrice(initialData.price || '');
				setPrices({});
			} else {
				setPrice('');
				setPrices(
					initialData.prices || {
						simple: initialData.price, // fallback if it had a single price
					},
				);
			}
		} else {
			resetForm();
		}
	}, [initialData]);

	// Cuando cambia la categoría, resetear el precio apropiado para no mandar basura
	function handleCategoryChange(e: React.ChangeEvent<HTMLSelectElement>) {
		const newCat = e.target.value as ProductCategory;
		setCategory(newCat);
		if (newCat === 'extras') {
			setPrices({});
		} else {
			setPrice('');
		}
	}

	function handlePriceVariantChange(
		variant: keyof ProductPrices,
		value: string,
	) {
		setPrices((prev) => ({
			...prev,
			[variant]: value === '' ? undefined : Number(value),
		}));
	}

	function resetForm() {
		setName('');
		setDescription('');
		setImage('');
		setCategory('clasicas');
		setPrice('');
		setPrices({
			simple: undefined,
			doble: undefined,
			triple: undefined,
			cuadruple: undefined,
			quintuple: undefined,
		});
		setFormError('');
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setFormError('');

		if (!name.trim() || !description.trim()) {
			setFormError('Completá nombre y descripción.');
			return;
		}

		let finalPrice: number | undefined = undefined;
		let finalPrices: ProductPrices | undefined = undefined;

		if (category === 'extras') {
			if (price === '' || Number(price) <= 0) {
				setFormError('Completá un precio válido para el producto.');
				return;
			}
			finalPrice = Number(price);
		} else {
			// Si es multiple precio, minimo debe tener el simple o doble
			if (!prices.simple && !prices.doble) {
				setFormError(
					'Para hamburguesas, debés ingresar al menos el precio de la Simple o Doble.',
				);
				return;
			}
			finalPrices = {
				simple: prices.simple || 0,
				doble: prices.doble || 0,
				triple: prices.triple || 0,
				...(prices.cuadruple && { cuadruple: prices.cuadruple }),
				...(prices.quintuple && { quintuple: prices.quintuple }),
			};
		}

		setModalState({ status: 'loading' });
		
		try {
			await onSubmitProduct({
				name: name.trim(),
				description: description.trim(),
				image: image.trim(),
				category,
				price: finalPrice,
				prices: finalPrices,
			});

			if (!initialData) {
				resetForm();
			}
			setModalState({ 
				status: 'success', 
				message: initialData ? 'Los cambios se aplicaron correctamente.' : 'El producto se agregó exitosamente.' 
			});
		} catch (error: any) {
			setModalState({ 
				status: 'error', 
				message: error.message || 'Ocurrió un problema, volvé a intentarlo.' 
			});
		}
	}

	const isEditing = !!initialData;

	return (
		<section
			className={`rounded-[var(--radius-card)] p-6 mb-10 transition-colors duration-300 ${isEditing ? 'ring-2 ring-[var(--color-primary)]' : ''}`}
			style={{ background: 'var(--color-surface-container)' }}
			aria-label={isEditing ? 'Formulario editar producto' : 'Formulario agregar producto'}
		>
			<StatusModal 
				status={modalState.status} 
				message={modalState.message} 
				title={modalState.status === 'success' ? 'Trámite exitoso' : undefined}
				onOpenChange={(open) => {
					if (!open && modalState.status !== 'loading') {
						setModalState({ status: 'idle' });
					}
				}}
			/>
			<div className='flex items-center justify-between mb-6'>
				<h2
					className='flex items-center gap-2 text-lg font-bold uppercase text-[var(--color-on-surface)]'
					style={{ fontFamily: 'var(--font-display)' }}
				>
					{isEditing ? (
						<>
							<Check
								size={18}
								className='text-[var(--color-primary)]'
								aria-hidden='true'
							/>
							Editando: {initialData.name}
						</>
					) : (
						<>
							<Plus
								size={18}
								className='text-[var(--color-primary)]'
								aria-hidden='true'
							/>
							Agregar producto
						</>
					)}
				</h2>

				{isEditing && onCancelEdit && (
					<button
						onClick={onCancelEdit}
						type='button'
						className='text-sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-error)] flex items-center gap-1 transition-colors'
					>
						<X size={16} /> Cancelar edición
					</button>
				)}
			</div>

			<form
				onSubmit={handleSubmit}
				className='grid grid-cols-1 sm:grid-cols-2 gap-4'
			>
				<div className='flex flex-col gap-1.5'>
					<label
						htmlFor='product-name'
						className='text-xs uppercase tracking-wide text-[var(--color-on-surface-variant)]'
					>
						Nombre *
					</label>
					<input
						id='product-name'
						name='name'
						type='text'
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder='La Condena'
						className='px-3 py-2.5 rounded-[var(--radius-button)] bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] text-sm outline-none'
						style={{ borderBottom: '2px solid var(--color-outline-variant)' }}
						disabled={isLoading}
					/>
				</div>

				<div className='flex flex-col gap-1.5'>
					<label
						htmlFor='product-category'
						className='text-xs uppercase tracking-wide text-[var(--color-on-surface-variant)]'
					>
						Categoría *
					</label>
					<select
						id='product-category'
						name='category'
						value={category}
						onChange={handleCategoryChange}
						className='px-3 py-2.5 rounded-[var(--radius-button)] bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] text-sm outline-none cursor-pointer'
						style={{ borderBottom: '2px solid var(--color-outline-variant)' }}
						disabled={isLoading}
					>
						{CATEGORIES.map(({ value, label }) => (
							<option key={value} value={value}>
								{label}
							</option>
						))}
					</select>
				</div>

				<div className='flex flex-col gap-1.5 sm:col-span-2'>
					<label
						htmlFor='product-image'
						className='text-xs uppercase tracking-wide text-[var(--color-on-surface-variant)]'
					>
						URL de imagen
					</label>
					<input
						id='product-image'
						name='image'
						type='url'
						value={image}
						onChange={(e) => setImage(e.target.value)}
						placeholder='https://...'
						className='px-3 py-2.5 rounded-[var(--radius-button)] bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] text-sm outline-none'
						style={{ borderBottom: '2px solid var(--color-outline-variant)' }}
						disabled={isLoading}
					/>
				</div>

				{category === 'extras' ? (
					<div className='flex flex-col gap-1.5 sm:col-span-2'>
						<label
							htmlFor='product-price'
							className='text-xs uppercase tracking-wide text-[var(--color-on-surface-variant)]'
						>
							Precio Único (ARS) *
						</label>
						<input
							id='product-price'
							name='price'
							type='number'
							min={0}
							value={price}
							onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
							placeholder='4500'
							className='w-full sm:w-1/2 px-3 py-2.5 rounded-[var(--radius-button)] bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] text-sm outline-none'
							style={{ borderBottom: '2px solid var(--color-outline-variant)' }}
							disabled={isLoading}
						/>
					</div>
				) : (
					<div className='sm:col-span-2 p-4 mt-2 rounded-[var(--radius-card)] bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)]'>
						<p className='text-xs uppercase tracking-wide text-[var(--color-on-surface-variant)] mb-3 font-semibold'>
							Variantes de Precios (ARS) *
						</p>
						<div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
							{['simple', 'doble', 'triple', 'cuadruple', 'quintuple'].map((size) => (
								<div key={size} className='flex flex-col gap-1'>
									<label htmlFor={`price-${size}`} className='text-[10px] uppercase text-[var(--color-on-surface-variant)]'>
										{size}
									</label>
									<input
										id={`price-${size}`}
										type='number'
										min={0}
										value={prices[size as keyof ProductPrices] || ''}
										onChange={(e) => handlePriceVariantChange(size as keyof ProductPrices, e.target.value)}
										placeholder='0'
										className='px-2 py-1.5 rounded-[var(--radius-button)] bg-[var(--color-surface-container)] text-[var(--color-on-surface)] text-sm outline-none'
										style={{ borderBottom: '1px solid var(--color-outline-variant)' }}
										disabled={isLoading}
									/>
								</div>
							))}
						</div>
					</div>
				)}

				<div className='sm:col-span-2 flex flex-col gap-1.5 mt-2'>
					<label
						htmlFor='product-description'
						className='text-xs uppercase tracking-wide text-[var(--color-on-surface-variant)]'
					>
						Descripción *
					</label>
					<textarea
						id='product-description'
						name='description'
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						placeholder='Doble medallón angus, cheddar ahumado...'
						rows={3}
						className='px-3 py-2.5 rounded-[var(--radius-button)] bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] text-sm outline-none resize-none'
						style={{ borderBottom: '2px solid var(--color-outline-variant)' }}
						disabled={isLoading}
					/>
				</div>

				<div className='sm:col-span-2 flex flex-col gap-2'>
					{formError && (
						<div className='flex items-center gap-2 text-sm text-[var(--color-error)]'>
							<AlertCircle size={14} aria-hidden='true' />
							{formError}
						</div>
					)}
				</div>

				<div className='sm:col-span-2 mt-2'>
					<button
						id='add-product-submit-btn'
						type='submit'
						disabled={isLoading}
						className='flex items-center gap-2 px-6 py-3 rounded-[var(--radius-button)] font-bold uppercase text-sm text-[var(--color-on-primary)] transition-all duration-200 hover:scale-[1.01] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
						style={{
							fontFamily: 'var(--font-display)',
							background:
								'linear-gradient(135deg, var(--color-primary-container) 0%, var(--color-secondary-container) 100%)',
						}}
					>
						{isEditing ? (
							<>
								<Check size={16} aria-hidden='true' />
								Guardar cambios
							</>
						) : (
							<>
								<Plus size={16} aria-hidden='true' />
								Crear producto
							</>
						)}
					</button>
				</div>
			</form>
		</section>
	);
}
