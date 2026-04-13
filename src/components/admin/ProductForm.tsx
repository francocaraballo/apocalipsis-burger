import { useState } from 'react';
import { Plus, AlertCircle, CheckCircle } from 'lucide-react';
import type { Product, ProductCategory } from '../../types';

const EMPTY_FORM: Omit<Product, 'id' | 'available'> = {
	name: '',
	description: '',
	price: 0,
	image: '',
	category: 'clasicas',
};

const CATEGORIES: { value: ProductCategory; label: string }[] = [
	{ value: 'clasicas', label: 'Clásicas' },
	{ value: 'premium', label: 'Premium' },
	{ value: 'veggie', label: 'Veggie' },
	{ value: 'extras', label: 'Extras' },
];

interface ProductFormProps {
	onAddProduct: (product: Product) => void;
}

export function ProductForm({ onAddProduct }: ProductFormProps) {
	const [form, setForm] =
		useState<Omit<Product, 'id' | 'available'>>(EMPTY_FORM);
	const [formSuccess, setFormSuccess] = useState('');
	const [formError, setFormError] = useState('');

	function handleFieldChange(
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>,
	) {
		const { name, value } = e.target;
		setForm((prev) => ({
			...prev,
			[name]: name === 'price' ? Number(value) : value,
		}));
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setFormError('');
		setFormSuccess('');

		const currentPrice = form.price || 0;

		if (
			!form.name.trim() ||
			!form.description.trim() ||
			currentPrice <= 0
		) {
			setFormError(
				'Completá nombre, descripción y un precio válido antes de guardar.',
			);
			return;
		}

		const newProduct: Product = {
			...form,
			id: `custom-${Date.now()}`,
			available: true,
		};

		onAddProduct(newProduct);
		setForm(EMPTY_FORM);
		setFormSuccess(`"${newProduct.name}" agregado correctamente.`);
		setTimeout(() => setFormSuccess(''), 3000);
	}

	return (
		<section
			className='rounded-[var(--radius-card)] p-6 mb-10'
			style={{ background: 'var(--color-surface-container)' }}
			aria-label='Formulario agregar producto'
		>
			<h2
				className='flex items-center gap-2 text-lg font-bold uppercase text-[var(--color-on-surface)] mb-6'
				style={{ fontFamily: 'var(--font-display)' }}
			>
				<Plus
					size={18}
					className='text-[var(--color-primary)]'
					aria-hidden='true'
				/>
				Agregar producto
			</h2>

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
						value={form.name}
						onChange={handleFieldChange}
						placeholder='La Condena'
						className='px-3 py-2.5 rounded-[var(--radius-button)] bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] text-sm outline-none'
						style={{
							borderBottom:
								'2px solid var(--color-outline-variant)',
						}}
					/>
				</div>

				<div className='flex flex-col gap-1.5'>
					<label
						htmlFor='product-price'
						className='text-xs uppercase tracking-wide text-[var(--color-on-surface-variant)]'
					>
						Precio (ARS) *
					</label>
					<input
						id='product-price'
						name='price'
						type='number'
						min={0}
						value={form.price || ''}
						onChange={handleFieldChange}
						placeholder='4500'
						className='px-3 py-2.5 rounded-[var(--radius-button)] bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] text-sm outline-none'
						style={{
							borderBottom:
								'2px solid var(--color-outline-variant)',
						}}
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
						value={form.category}
						onChange={handleFieldChange}
						className='px-3 py-2.5 rounded-[var(--radius-button)] bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] text-sm outline-none cursor-pointer'
						style={{
							borderBottom:
								'2px solid var(--color-outline-variant)',
						}}
					>
						{CATEGORIES.map(({ value, label }) => (
							<option key={value} value={value}>
								{label}
							</option>
						))}
					</select>
				</div>

				<div className='flex flex-col gap-1.5'>
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
						value={form.image}
						onChange={handleFieldChange}
						placeholder='https://...'
						className='px-3 py-2.5 rounded-[var(--radius-button)] bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] text-sm outline-none'
						style={{
							borderBottom:
								'2px solid var(--color-outline-variant)',
						}}
					/>
				</div>

				<div className='sm:col-span-2 flex flex-col gap-1.5'>
					<label
						htmlFor='product-description'
						className='text-xs uppercase tracking-wide text-[var(--color-on-surface-variant)]'
					>
						Descripción *
					</label>
					<textarea
						id='product-description'
						name='description'
						value={form.description}
						onChange={handleFieldChange}
						placeholder='Doble medallón angus, cheddar ahumado...'
						rows={3}
						className='px-3 py-2.5 rounded-[var(--radius-button)] bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] text-sm outline-none resize-none'
						style={{
							borderBottom:
								'2px solid var(--color-outline-variant)',
						}}
					/>
				</div>

				<div className='sm:col-span-2 flex flex-col gap-2'>
					{formError && (
						<div className='flex items-center gap-2 text-sm text-[var(--color-error)]'>
							<AlertCircle size={14} aria-hidden='true' />
							{formError}
						</div>
					)}
					{formSuccess && (
						<div className='flex items-center gap-2 text-sm text-emerald-400'>
							<CheckCircle size={14} aria-hidden='true' />
							{formSuccess}
						</div>
					)}
				</div>

				<div className='sm:col-span-2'>
					<button
						id='add-product-submit-btn'
						type='submit'
						className='flex items-center gap-2 px-6 py-3 rounded-[var(--radius-button)] font-bold uppercase text-sm text-[var(--color-on-primary)] transition-all duration-200 hover:scale-[1.01] cursor-pointer'
						style={{
							fontFamily: 'var(--font-display)',
							background:
								'linear-gradient(135deg, var(--color-primary-container) 0%, var(--color-secondary-container) 100%)',
						}}
					>
						<Plus size={16} aria-hidden='true' />
						Guardar producto
					</button>
				</div>
			</form>
		</section>
	);
}

