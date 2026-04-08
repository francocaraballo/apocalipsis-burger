// Supabase client — listo para cuando conectemos la base de datos
// Para activar:
//   1. Instalar: npm install @supabase/supabase-js
//   2. Crear .env con las variables de entorno
//   3. Descomentar el código de abajo

// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// if (!supabaseUrl || !supabaseAnonKey) {
//   throw new Error('Faltan las variables de entorno VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY');
// }

// export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Por ahora exportamos null — lo activamos cuando tengamos las credenciales
export const supabase = null;
