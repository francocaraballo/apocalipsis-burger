import { useState, useEffect } from 'react';
import { RefreshCw, LogOut, Loader2 } from 'lucide-react';
import { AdminLogin } from '../components/AdminLogin';
import { supabase } from '../lib/supabaseClient';
import { useAdminProducts } from '../hooks/useAdminProducts';
import { ProductForm } from '../components/admin/ProductForm';
import { ProductList } from '../components/admin/ProductList';

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

	const { products, isLoading, handleAddProduct, handleDeleteProduct } =
		useAdminProducts(isAuthenticated);

	async function handleLogout() {
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
					onClick={handleLogout}
					className='flex items-center gap-2 px-4 py-2 rounded-full border-2 border-outline-variant text-sm font-semibold uppercase tracking-wide text-on-surface-variant transition-all hover:bg-surface-container-highest hover:text-[#cd3030]'
				>
					<LogOut size={16} />
					Salir
				</button>
			</div>

			<ProductForm onAddProduct={handleAddProduct} />

			<ProductList
				products={products}
				onDeleteProduct={handleDeleteProduct}
			/>
		</main>
	);
}

