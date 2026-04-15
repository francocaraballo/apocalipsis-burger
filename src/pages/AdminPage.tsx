import { useState, useEffect } from 'react';
import {
	RefreshCw,
	LogOut,
	Loader2,
	ChevronDown,
	ChevronUp,
} from 'lucide-react';
import type { Product } from '../types';
import { AdminLogin } from '../components/AdminLogin';
import { supabase } from '../lib/supabaseClient';
import { useAdminProducts } from '../hooks/useAdminProducts';
import { ProductForm } from '../components/admin/ProductForm';
import { ProductList } from '../components/admin/ProductList';
import { ShippingCostForm } from '../components/admin/ShippingCostForm';
import { WhatsAppNumberForm } from '../components/admin/WhatsAppNumberForm';
import { StatusModal } from '../components/ui/StatusModal';

export function AdminPage() {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isAuthLoading, setIsAuthLoading] = useState(true);

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setIsAuthenticated(!!session);
			setIsAuthLoading(false);
		});

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setIsAuthenticated(!!session);
		});

		return () => subscription.unsubscribe();
	}, []);

	const {
		products,
		isLoading,
		handleAddProduct,
		handleEditProduct,
		handleDeleteProduct,
	} = useAdminProducts(isAuthenticated);

	const [editingProduct, setEditingProduct] = useState<Product | undefined>(
		undefined,
	);

	const [isShippingOpen, setIsShippingOpen] = useState(false);
	const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
	const [isProductFormOpen, setIsProductFormOpen] = useState(false);
	const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

	async function handleLogout() {
		setIsLogoutModalOpen(false);
		await supabase.auth.signOut();
	}

	if (isAuthLoading) {
		return (
			<main className='min-h-screen flex items-center justify-center'>
				<Loader2 className='animate-spin text-primary' size={32} />
			</main>
		);
	}

	if (!isAuthenticated) {
		return <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />;
	}

	if (isLoading) {
		return (
			<main className='min-h-screen px-4 pt-24 pb-16 flex items-center justify-center'>
				<div className='flex flex-col items-center gap-4 text-primary'>
					<RefreshCw
						size={32}
						className='animate-spin'
						aria-hidden='true'
					/>
					<p className='text-sm uppercase tracking-widest font-bold'>
						Cargando menú...
					</p>
				</div>
			</main>
		);
	}

	return (
		<main className='min-h-screen px-4 pt-24 pb-16 max-w-4xl mx-auto'>
			<div className='mb-10 flex items-center justify-between'>
				<div>
					<p className='text-xs uppercase tracking-[0.15em] text-primary font-semibold mb-2'>
						Panel de administración
					</p>
					<h1
						className='text-4xl font-bold uppercase text-on-surface'
						style={{
							fontFamily: 'var(--font-display)',
							letterSpacing: '-0.02em',
						}}
					>
						Gestión de productos
					</h1>
				</div>
				<button
					onClick={() => setIsLogoutModalOpen(true)}
					className='flex items-center gap-2 px-4 py-2 rounded-full border-2 border-outline-variant text-sm font-semibold uppercase tracking-wide text-on-surface-variant transition-all hover:bg-surface-container-highest hover:text-[#cd3030]'
				>
					<LogOut size={16} />
					Salir
				</button>
			</div>

			<div className='flex flex-col gap-4 mb-10'>
				<div>
					<button
						onClick={() => setIsShippingOpen(!isShippingOpen)}
						className='w-full flex items-center justify-between px-6 py-4 rounded-full border-2 transition-all hover:bg-surface-container-highest'
						style={{
							borderColor: isShippingOpen
								? 'var(--color-primary)'
								: 'var(--color-outline-variant)',
							color: isShippingOpen
								? 'var(--color-primary)'
								: 'var(--color-on-surface-variant)',
							background: isShippingOpen
								? 'var(--color-surface-container)'
								: 'transparent',
						}}
					>
						<span className='font-bold uppercase tracking-wide text-sm'>
							Ajustes de Envío
						</span>
						{isShippingOpen ? (
							<ChevronUp size={20} />
						) : (
							<ChevronDown size={20} />
						)}
					</button>
					{isShippingOpen && (
						<div className='mt-4 animate-in fade-in slide-in-from-top-2'>
							<ShippingCostForm />
						</div>
					)}
				</div>

				<div>
					<button
						onClick={() => setIsWhatsAppOpen(!isWhatsAppOpen)}
						className='w-full flex items-center justify-between px-6 py-4 rounded-full border-2 transition-all hover:bg-surface-container-highest'
						style={{
							borderColor: isWhatsAppOpen
								? 'var(--color-primary)'
								: 'var(--color-outline-variant)',
							color: isWhatsAppOpen
								? 'var(--color-primary)'
								: 'var(--color-on-surface-variant)',
							background: isWhatsAppOpen
								? 'var(--color-surface-container)'
								: 'transparent',
						}}
					>
						<span className='font-bold uppercase tracking-wide text-sm'>
							Número de WhatsApp
						</span>
						{isWhatsAppOpen ? (
							<ChevronUp size={20} />
						) : (
							<ChevronDown size={20} />
						)}
					</button>
					{isWhatsAppOpen && (
						<div className='mt-4 animate-in fade-in slide-in-from-top-2'>
							<WhatsAppNumberForm />
						</div>
					)}
				</div>

				<div>
					<button
						onClick={() => {
							if (editingProduct) {
								setEditingProduct(undefined);
								setIsProductFormOpen(false);
							} else {
								setIsProductFormOpen(!isProductFormOpen);
							}
						}}
						className='w-full flex items-center justify-between px-6 py-4 rounded-full border-2 transition-all hover:bg-surface-container-highest'
						style={{
							borderColor:
								isProductFormOpen || editingProduct
									? 'var(--color-primary)'
									: 'var(--color-outline-variant)',
							color:
								isProductFormOpen || editingProduct
									? 'var(--color-primary)'
									: 'var(--color-on-surface-variant)',
							background:
								isProductFormOpen || editingProduct
									? 'var(--color-surface-container)'
									: 'transparent',
						}}
					>
						<span className='font-bold uppercase tracking-wide text-sm'>
							{editingProduct
								? 'Editando Producto...'
								: 'Agregar Nuevo Producto'}
						</span>
						{isProductFormOpen || editingProduct ? (
							<ChevronUp size={20} />
						) : (
							<ChevronDown size={20} />
						)}
					</button>
					{(isProductFormOpen || editingProduct) && (
						<div className='mt-4 animate-in fade-in slide-in-from-top-2'>
							<ProductForm
								initialData={editingProduct}
								onSubmitProduct={async (product) => {
									if (editingProduct) {
										await handleEditProduct(
											editingProduct.id,
											product,
										);
										setEditingProduct(undefined);
									} else {
										await handleAddProduct(product);
									}
									setIsProductFormOpen(false);
								}}
								onCancelEdit={() => {
									setEditingProduct(undefined);
									setIsProductFormOpen(false);
								}}
							/>
						</div>
					)}
				</div>
			</div>

			<ProductList
				products={products}
				onDeleteProduct={handleDeleteProduct}
				onEditProduct={(product) => {
					setEditingProduct(product);
					setIsProductFormOpen(true);
					window.scrollTo({ top: 0, behavior: 'smooth' });
				}}
			/>

			<StatusModal
				status={isLogoutModalOpen ? 'confirm' : 'idle'}
				title='¿CERRAR SESIÓN?'
				message='Te vas a desconectar del panel de administración. Tendrás que volver a ingresar tu contraseña para entrar.'
				onOpenChange={setIsLogoutModalOpen}
				onConfirm={handleLogout}
			/>
		</main>
	);
}

