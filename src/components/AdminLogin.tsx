import { useState } from 'react';
import { Lock, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { FormInput } from './ui/FormInput';

interface AdminLoginProps {
	onLoginSuccess: () => void;
}

export function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
	const [emailInput, setEmailInput] = useState('');
	const [passwordInput, setPasswordInput] = useState('');
	const [authError, setAuthError] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	async function handleLogin(e: React.FormEvent) {
		e.preventDefault();
		setAuthError('');

		if (!emailInput || !passwordInput) {
			setAuthError('Completá email y contraseña.');
			return;
		}

		setIsLoading(true);
		const { error } = await supabase.auth.signInWithPassword({
			email: emailInput,
			password: passwordInput,
		});

		setIsLoading(false);

		if (error) {
			console.error('Error crudo de Supabase:', error);
			setAuthError(error.message || 'Credenciales incorrectas. Intentá de nuevo.');
		} else {
			onLoginSuccess();
		}
	}

	return (
		<main className='min-h-screen flex items-center justify-center px-4 pt-20'>
			<div
				className='w-full max-w-sm rounded-(--radius-card) p-8'
				style={{ background: 'var(--color-surface-container)' }}
			>
				<div className='flex flex-col items-center gap-4 mb-8'>
					<div
						className='p-3 rounded-full'
						style={{
							background: 'var(--color-surface-container-high)',
						}}
					>
						<Lock
							size={28}
							className='text-primary'
							aria-hidden='true'
						/>
					</div>
					<h1
						className='text-2xl font-bold uppercase text-on-surface text-center'
						style={{
							fontFamily: 'var(--font-display)',
							letterSpacing: '-0.02em',
						}}
					>
						Panel Admin
					</h1>
					<p className='text-sm text-on-surface-variant text-center'>
						Ingresá la contraseña para acceder al panel de
						administración.
					</p>
				</div>

				<form onSubmit={handleLogin} className='flex flex-col gap-4'>
					<FormInput
						id='admin-email-input'
						label='Email'
						type='email'
						value={emailInput}
						onChange={(e) => setEmailInput(e.target.value)}
						placeholder=''
						autoComplete='email'
						required
					/>

					<FormInput
						id='admin-password-input'
						label='Contraseña'
						type='password'
						value={passwordInput}
						onChange={(e) => setPasswordInput(e.target.value)}
						placeholder=''
						autoComplete='current-password'
						required
					/>

					{authError && (
						<div className='flex items-center gap-2 text-sm text-[var(--color-error)]'>
							<AlertCircle size={14} aria-hidden='true' />
							{authError}
						</div>
					)}

					<button
						id='admin-login-btn'
						type='submit'
						disabled={isLoading}
						className='py-3 mt-2 flex items-center justify-center rounded-[var(--radius-button)] font-bold uppercase tracking-wide text-[var(--color-on-primary)] transition-all duration-200 hover:scale-[1.01] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100'
						style={{
							fontFamily: 'var(--font-display)',
							background:
								'linear-gradient(135deg, var(--color-primary-container) 0%, var(--color-secondary-container) 100%)',
						}}
					>
						{isLoading ? (
							<Loader2 className='animate-spin' size={20} />
						) : (
							'Acceder'
						)}
					</button>
				</form>
			</div>
		</main>
	);
}

