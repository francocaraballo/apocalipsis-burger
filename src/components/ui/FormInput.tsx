import { useRef } from 'react';

interface FormInputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	id: string;
	label: string;
}

export function FormInput({ id, label, ...props }: FormInputProps) {
	const inputRef = useRef<HTMLInputElement>(null);

	function handleFocus() {
		if (inputRef.current) {
			inputRef.current.style.borderBottomColor = 'var(--color-primary)';
		}
	}

	function handleBlur() {
		if (inputRef.current) {
			inputRef.current.style.borderBottomColor =
				'var(--color-outline-variant)';
		}
	}

	return (
		<div className='flex flex-col gap-1.5'>
			<label
				htmlFor={id}
				className='text-xs uppercase tracking-wide text-on-surface-variant'
			>
				{label}
			</label>
			<input
				ref={inputRef}
				id={id}
				className='w-full px-3 py-2.5 rounded-(--radius-button) bg-surface-container-lowest text-on-surface text-sm outline-none transition-all duration-200'
				style={{
					border: '2px solid transparent',
					borderBottom: '2px solid var(--color-outline-variant)',
				}}
				onFocus={handleFocus}
				onBlur={handleBlur}
				{...props}
			/>
		</div>
	);
}
