import type { CartItem } from '../types';

const WHATSAPP_NUMBER = '543425197766';

export function formatOrderForWhatsApp(items: CartItem[]): string {
  if (items.length === 0) return '';

  const header = '🔥 *PEDIDO — APOCALIPSIS BURGER* 🔥\n\n';

  const itemLines = items
    .map(({ product, quantity }) => {
      const subtotal = product.price * quantity;
      return `• *${product.name}* x${quantity} — $${subtotal.toLocaleString('es-AR')}`;
    })
    .join('\n');

  const total = items.reduce(
    (acc, { product, quantity }) => acc + product.price * quantity,
    0
  );

  const footer = `\n\n💰 *TOTAL: $${total.toLocaleString('es-AR')}*\n\nPor favor confirmar disponibilidad y forma de entrega. ¡Gracias! 🍔`;

  return `${header}${itemLines}${footer}`;
}

export function sendWhatsAppOrder(items: CartItem[]): void {
  const message = formatOrderForWhatsApp(items);
  const encodedMessage = encodeURIComponent(message);
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
}
