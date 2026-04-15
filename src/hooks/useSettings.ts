import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useSettings<T = any>(key: string, defaultValue: T) {
	const [value, setValue] = useState<T>(defaultValue);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchSetting() {
			setIsLoading(true);
			setError(null);
			try {
				const { data, error } = await supabase
					.from('settings')
					.select('value')
					.eq('key', key)
					.single();

				if (error) {
					// Supabase returns PGRST116 when no rows are found
					if (error.code !== 'PGRST116') {
						console.error(
							`Error fetching setting ${key}:`,
							error.message,
						);
						setError(error.message);
					}
				} else if (data) {
					setValue(data.value as T);
				}
			} catch (err: any) {
				setError(err.message);
			} finally {
				setIsLoading(false);
			}
		}

		fetchSetting();
	}, [key]);

	const updateSetting = async (newValue: T) => {
		setIsLoading(true);
		try {
			setError(null);
			const { error } = await supabase
				.from('settings')
				.upsert({ key, value: newValue }, { onConflict: 'key' });

			if (error) throw error;
			setValue(newValue);
			return true;
		} catch (err: any) {
			console.error(`Error updating setting ${key}:`, err.message);
			setError(err.message);
			return false;
		} finally {
			setIsLoading(false);
		}
	};

	return { value, isLoading, error, updateSetting };
}
