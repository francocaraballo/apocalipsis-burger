import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, CheckCircle, AlertCircle, HelpCircle } from 'lucide-react';

export type ModalStatus = 'idle' | 'loading' | 'success' | 'error' | 'confirm';

interface StatusModalProps {
	status: ModalStatus;
	title?: string;
	message?: string;
	onOpenChange?: (open: boolean) => void;
	onConfirm?: () => void;
}

export function StatusModal({ status, title, message, onOpenChange, onConfirm }: StatusModalProps) {
	const isOpen = status !== 'idle';

	return (
		<Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
			<AnimatePresence>
				{isOpen && (
					<Dialog.Portal forceMount>
						<Dialog.Overlay asChild>
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
							/>
						</Dialog.Overlay>
						<Dialog.Content asChild>
							<motion.div
								initial={{ opacity: 0, scale: 0.95, y: 20 }}
								animate={{ opacity: 1, scale: 1, y: 0 }}
								exit={{ opacity: 0, scale: 0.95, y: 20 }}
								className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-sm rounded-[var(--radius-card)] bg-[var(--color-surface-container)] p-6 shadow-2xl z-50 text-center"
							>
								<div className="flex flex-col items-center justify-center gap-4">
									{status === 'loading' && (
										<motion.div
											animate={{ rotate: 360 }}
											transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
										>
											<Loader2 size={48} className="text-[var(--color-primary)]" />
										</motion.div>
									)}
									{status === 'success' && (
										<motion.div
											initial={{ scale: 0 }}
											animate={{ scale: 1 }}
											transition={{ type: 'spring', bounce: 0.5 }}
										>
											<CheckCircle size={48} className="text-emerald-500" />
										</motion.div>
									)}
									{status === 'error' && (
										<motion.div
											initial={{ scale: 0 }}
											animate={{ scale: 1 }}
											transition={{ type: 'spring', bounce: 0.5 }}
										>
											<AlertCircle size={48} className="text-[var(--color-error)]" />
										</motion.div>
									)}
									{status === 'confirm' && (
										<motion.div
											initial={{ scale: 0 }}
											animate={{ scale: 1 }}
											transition={{ type: 'spring', bounce: 0.5 }}
										>
											<HelpCircle size={48} className="text-amber-500" />
										</motion.div>
									)}

									<Dialog.Title className="text-xl font-bold uppercase text-[var(--color-on-surface)] m-0" style={{ fontFamily: 'var(--font-display)' }}>
										{title || (status === 'loading' ? 'Procesando...' : status === 'success' ? '¡Éxito!' : status === 'confirm' ? '¿Estás seguro?' : 'Error')}
									</Dialog.Title>
									
									<Dialog.Description className="text-sm text-[var(--color-on-surface-variant)] m-0">
										{message || (status === 'loading' ? 'Por favor, aguardá un instante...' : status === 'success' ? 'La operación se completó correctamente.' : status === 'confirm' ? 'Esta acción requiere confirmación.' : 'Ocurrió un problema, intentalo de nuevo.')}
									</Dialog.Description>
								</div>
								
								{status === 'confirm' ? (
									<div className="mt-6 flex gap-3">
										<Dialog.Close asChild>
											<button
												className="flex-1 rounded-[var(--radius-button)] bg-[var(--color-surface-container-highest)] px-4 py-2 font-bold uppercase text-sm text-[var(--color-on-surface)] transition-colors hover:brightness-95 cursor-pointer"
											>
												Cancelar
											</button>
										</Dialog.Close>
										<button
											onClick={onConfirm}
											className="flex-1 rounded-[var(--radius-button)] bg-[var(--color-error)] px-4 py-2 font-bold uppercase text-sm text-[var(--color-on-error)] transition-colors hover:brightness-110 cursor-pointer"
										>
											Confirmar
										</button>
									</div>
								) : status !== 'loading' ? (
									<Dialog.Close asChild>
										<button
											className="mt-6 w-full cursor-pointer rounded-[var(--radius-button)] bg-[var(--color-primary-container)] px-4 py-2 font-bold uppercase text-sm text-[var(--color-on-primary-container)] transition-colors hover:brightness-110"
										>
											Cerrar
										</button>
									</Dialog.Close>
								) : null}
							</motion.div>
						</Dialog.Content>
					</Dialog.Portal>
				)}
			</AnimatePresence>
		</Dialog.Root>
	);
}
