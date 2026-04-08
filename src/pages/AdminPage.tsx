import { useState } from 'react';
import { Lock, Plus, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import type { Product, ProductCategory } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import productsData from '../data/products.json';

// Contraseña simple de protección — sin backend todavía
const ADMIN_PASSWORD = 'apocalipsis2025';

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
  { value: 'combos', label: 'Combos' },
];

export function AdminPage() {
  // Auth básico
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Productos (base del JSON + los que agrega el admin)
  const [products, setProducts] = useLocalStorage<Product[]>(
    'apocalipsis-products',
    productsData as Product[]
  );

  // Formulario
  const [form, setForm] = useState<Omit<Product, 'id' | 'available'>>(EMPTY_FORM);
  const [formSuccess, setFormSuccess] = useState('');
  const [formError, setFormError] = useState('');

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Contraseña incorrecta. Intentá de nuevo.');
    }
  }

  function handleFieldChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value,
    }));
  }

  function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!form.name.trim() || !form.description.trim() || form.price <= 0) {
      setFormError('Completá nombre, descripción y precio antes de guardar.');
      return;
    }

    const newProduct: Product = {
      ...form,
      id: `custom-${Date.now()}`,
      available: true,
    };

    setProducts((prev) => [...prev, newProduct]);
    setForm(EMPTY_FORM);
    setFormSuccess(`"${newProduct.name}" agregado correctamente.`);
    setTimeout(() => setFormSuccess(''), 3000);
  }

  function handleDeleteProduct(id: string) {
    if (!confirm('¿Seguro que querés eliminar este producto?')) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  // ── Login screen ──────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 pt-20">
        <div
          className="w-full max-w-sm rounded-[var(--radius-card)] p-8"
          style={{ background: 'var(--color-surface-container)' }}
        >
          <div className="flex flex-col items-center gap-4 mb-8">
            <div
              className="p-3 rounded-full"
              style={{ background: 'var(--color-surface-container-high)' }}
            >
              <Lock size={28} className="text-[var(--color-primary)]" aria-hidden="true" />
            </div>
            <h1
              className="text-2xl font-bold uppercase text-[var(--color-on-surface)] text-center"
              style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}
            >
              Panel Admin
            </h1>
            <p className="text-sm text-[var(--color-on-surface-variant)] text-center">
              Ingresá la contraseña para acceder al panel de administración.
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="admin-password-input"
                className="text-xs uppercase tracking-wide text-[var(--color-on-surface-variant)]"
              >
                Contraseña
              </label>
              <input
                id="admin-password-input"
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full px-3 py-2.5 rounded-[var(--radius-button)] bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] text-sm outline-none transition-all duration-200"
                style={{
                  border: '2px solid transparent',
                  borderBottom: '2px solid var(--color-outline-variant)',
                }}
                onFocus={(e) => {
                  e.target.style.borderBottomColor = 'var(--color-primary)';
                }}
                onBlur={(e) => {
                  e.target.style.borderBottomColor = 'var(--color-outline-variant)';
                }}
              />
            </div>

            {authError && (
              <div className="flex items-center gap-2 text-sm text-[var(--color-error)]">
                <AlertCircle size={14} aria-hidden="true" />
                {authError}
              </div>
            )}

            <button
              id="admin-login-btn"
              type="submit"
              className="py-3 rounded-[var(--radius-button)] font-bold uppercase tracking-wide text-[var(--color-on-primary)] transition-all duration-200 hover:scale-[1.01] cursor-pointer"
              style={{
                fontFamily: 'var(--font-display)',
                background: 'linear-gradient(135deg, var(--color-primary-container) 0%, var(--color-secondary-container) 100%)',
              }}
            >
              Acceder
            </button>
          </form>
        </div>
      </main>
    );
  }

  // ── Admin panel ───────────────────────────────────────
  return (
    <main className="min-h-screen px-4 pt-24 pb-16 max-w-4xl mx-auto">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.15em] text-[var(--color-primary)] font-semibold mb-2">
          Panel de administración
        </p>
        <h1
          className="text-4xl font-bold uppercase text-[var(--color-on-surface)]"
          style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}
        >
          Gestión de productos
        </h1>
      </div>

      {/* Add product form */}
      <section
        className="rounded-[var(--radius-card)] p-6 mb-10"
        style={{ background: 'var(--color-surface-container)' }}
        aria-label="Formulario agregar producto"
      >
        <h2
          className="flex items-center gap-2 text-lg font-bold uppercase text-[var(--color-on-surface)] mb-6"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          <Plus size={18} className="text-[var(--color-primary)]" aria-hidden="true" />
          Agregar producto
        </h2>

        <form onSubmit={handleAddProduct} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Nombre */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="product-name" className="text-xs uppercase tracking-wide text-[var(--color-on-surface-variant)]">
              Nombre *
            </label>
            <input
              id="product-name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleFieldChange}
              placeholder="La Condena"
              className="px-3 py-2.5 rounded-[var(--radius-button)] bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] text-sm outline-none"
              style={{ borderBottom: '2px solid var(--color-outline-variant)' }}
            />
          </div>

          {/* Precio */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="product-price" className="text-xs uppercase tracking-wide text-[var(--color-on-surface-variant)]">
              Precio (ARS) *
            </label>
            <input
              id="product-price"
              name="price"
              type="number"
              min={0}
              value={form.price || ''}
              onChange={handleFieldChange}
              placeholder="4500"
              className="px-3 py-2.5 rounded-[var(--radius-button)] bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] text-sm outline-none"
              style={{ borderBottom: '2px solid var(--color-outline-variant)' }}
            />
          </div>

          {/* Categoría */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="product-category" className="text-xs uppercase tracking-wide text-[var(--color-on-surface-variant)]">
              Categoría *
            </label>
            <select
              id="product-category"
              name="category"
              value={form.category}
              onChange={handleFieldChange}
              className="px-3 py-2.5 rounded-[var(--radius-button)] bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] text-sm outline-none cursor-pointer"
              style={{ borderBottom: '2px solid var(--color-outline-variant)' }}
            >
              {CATEGORIES.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Imagen URL */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="product-image" className="text-xs uppercase tracking-wide text-[var(--color-on-surface-variant)]">
              URL de imagen
            </label>
            <input
              id="product-image"
              name="image"
              type="url"
              value={form.image}
              onChange={handleFieldChange}
              placeholder="https://..."
              className="px-3 py-2.5 rounded-[var(--radius-button)] bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] text-sm outline-none"
              style={{ borderBottom: '2px solid var(--color-outline-variant)' }}
            />
          </div>

          {/* Descripción — full width */}
          <div className="sm:col-span-2 flex flex-col gap-1.5">
            <label htmlFor="product-description" className="text-xs uppercase tracking-wide text-[var(--color-on-surface-variant)]">
              Descripción *
            </label>
            <textarea
              id="product-description"
              name="description"
              value={form.description}
              onChange={handleFieldChange}
              placeholder="Doble medallón angus, cheddar ahumado..."
              rows={3}
              className="px-3 py-2.5 rounded-[var(--radius-button)] bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] text-sm outline-none resize-none"
              style={{ borderBottom: '2px solid var(--color-outline-variant)' }}
            />
          </div>

          {/* Feedback messages */}
          {formError && (
            <div className="sm:col-span-2 flex items-center gap-2 text-sm text-[var(--color-error)]">
              <AlertCircle size={14} aria-hidden="true" />
              {formError}
            </div>
          )}
          {formSuccess && (
            <div className="sm:col-span-2 flex items-center gap-2 text-sm text-emerald-400">
              <CheckCircle size={14} aria-hidden="true" />
              {formSuccess}
            </div>
          )}

          {/* Submit */}
          <div className="sm:col-span-2">
            <button
              id="add-product-submit-btn"
              type="submit"
              className="flex items-center gap-2 px-6 py-3 rounded-[var(--radius-button)] font-bold uppercase text-sm text-[var(--color-on-primary)] transition-all duration-200 hover:scale-[1.01] cursor-pointer"
              style={{
                fontFamily: 'var(--font-display)',
                background: 'linear-gradient(135deg, var(--color-primary-container) 0%, var(--color-secondary-container) 100%)',
              }}
            >
              <Plus size={16} aria-hidden="true" />
              Guardar producto
            </button>
          </div>
        </form>
      </section>

      {/* Products list */}
      <section aria-label="Lista de productos">
        <h2
          className="text-xl font-bold uppercase text-[var(--color-on-surface)] mb-4"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Productos actuales ({products.length})
        </h2>
        <div className="flex flex-col gap-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-4 p-4 rounded-[var(--radius-card)]"
              style={{ background: 'var(--color-surface-container)' }}
            >
              <img
                src={product.image || `https://placehold.co/64x64/1c1b1b/ffc788?text=${encodeURIComponent(product.name[0])}`}
                alt=""
                aria-hidden="true"
                className="w-14 h-14 object-cover rounded flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p
                  className="font-semibold text-[var(--color-on-surface)] truncate"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {product.name}
                </p>
                <p className="text-xs text-[var(--color-on-surface-variant)] capitalize">
                  {product.category} — ${product.price.toLocaleString('es-AR')}
                </p>
              </div>
              <button
                id={`delete-product-${product.id}`}
                onClick={() => handleDeleteProduct(product.id)}
                aria-label={`Eliminar producto ${product.name}`}
                className="p-2 text-[var(--color-outline)] hover:text-[var(--color-error)] transition-colors cursor-pointer flex-shrink-0"
              >
                <Trash2 size={16} aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
