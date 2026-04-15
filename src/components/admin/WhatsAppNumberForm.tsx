import { useState, useEffect } from 'react';
import { useSettings } from '../../hooks/useSettings';
import { Loader2, Save } from 'lucide-react';

export function WhatsAppNumberForm() {
	const { value, isLoading, updateSetting } = useSettings(
		'whatsapp_number',
		'543425197766',
	);
	const [inputValue, setInputValue] = useState('');
	const [isSaving, setIsSaving] = useState(false);
	const [message, setMessage] = useState('');

	useEffect(() => {
		if (!isLoading) {
			setInputValue(String(value));
		}
	}, [value, isLoading]);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		const strValue = inputValue.trim();
		if (!strValue) {
			setMessage('Ingrese un número de WhatsApp válido');
			return;
		}

		setIsSaving(true);
		setMessage('');
		const success = await updateSetting(strValue);
		if (success) {
			setMessage('Número de WhatsApp actualizado con éxito');
			setTimeout(() => setMessage(''), 3000);
		} else {
			setMessage('Hubo un error al actualizar el número');
		}
		setIsSaving(false);
	}

	return (
		<form
			onSubmit={handleSubmit}
			className='p-6 rounded-2xl mb-8 flex flex-col gap-4'
			style={{ background: 'var(--color-surface-container)' }}
		>
			<div>
				<h2
					className='text-xl font-bold uppercase mb-2'
					style={{
						fontFamily: 'var(--font-display)',
						color: 'var(--color-on-surface)',
					}}
				>
					Número de WhatsApp
				</h2>
				<p
					className='text-sm'
					style={{ color: 'var(--color-on-surface-variant)' }}
				>
					Configurá el número al que se enviarán los pedidos. Incluí
					el código de país (ej. 549342...).
				</p>
			</div>

			<div className='flex gap-4 items-end'>
				<div className='flex-1'>
					<label
						htmlFor='whatsapp_number'
						className='block text-xs uppercase tracking-wider mb-2 font-semibold'
						style={{
							color: 'var(--color-on-surface-variant)',
							fontFamily: 'var(--font-display)',
						}}
					>
						Número
					</label>
					<input
						id='whatsapp_number'
						type='text'
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						disabled={isLoading || isSaving}
						placeholder='543425197766'
						className='w-full px-4 py-3 rounded-lg outline-none transition-colors'
						style={{
							background: 'var(--color-surface-container-high)',
							color: 'var(--color-on-surface)',
							border: '1px solid rgba(255,160,0,0.15)',
						}}
					/>
				</div>
				<button
					type='submit'
					disabled={isLoading || isSaving}
					className='flex items-center gap-2 px-6 py-3 font-bold uppercase tracking-wider text-sm transition-all duration-200 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg'
					style={{
						fontFamily: 'var(--font-display)',
						background: 'var(--color-primary)',
						color: 'var(--color-on-primary)',
					}}
				>
					{isLoading || isSaving ? (
						<Loader2 size={18} className='animate-spin' />
					) : (
						<Save size={18} />
					)}
					Guardar
				</button>
			</div>

			{message && (
				<p
					className={`text-sm font-semibold ${
						message.includes('error')
							? 'text-red-500'
							: 'text-green-500'
					}`}
				>
					{message}
				</p>
			)}
		</form>
	);
}
