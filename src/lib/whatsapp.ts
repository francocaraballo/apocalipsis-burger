import type { CartItem } from '../types';

export interface DeliveryInfo {
	method: 'delivery' | 'takeaway';
	address: string;
}

export function formatOrderForWhatsApp(
	items: CartItem[],
	delivery: DeliveryInfo,
	shippingCost: number,
	notes?: string,
): string {
	if (items.length === 0) return '';

	const header = '*PEDIDO — APOCALIPSIS BURGER*\n\n';

	const itemLines = items
		.map(({ product, quantity }) => {
			const price = product.price ?? 0;
			const subtotal = price * quantity;
			return `• *${product.name}* x${quantity} — $${subtotal.toLocaleString('es-AR')}`;
		})
		.join('\n');

	const subtotal = items.reduce(
		(acc, { product, quantity }) => acc + (product.price ?? 0) * quantity,
		0,
	);

	const envio = delivery.method === 'delivery' ? shippingCost : 0;
	const total = subtotal + envio;

	const notesLine = notes?.trim() ? `\n\n*NOTAS:* ${notes.trim()}` : '';

	const deliveryLine =
		delivery.method === 'takeaway'
			? '\n\n*RETIRO EN LOCAL* — Lavaisse 4050'
			: `\n\n*ENVÍO A DOMICILIO*\n ${delivery.address}`;

	const footer = `${notesLine}${deliveryLine}\n\n *SUBTOTAL: $${subtotal.toLocaleString('es-AR')}*\n *ENVÍO: ${delivery.method === 'takeaway' ? 'GRATIS' : `$${envio.toLocaleString('es-AR')}`}*\n *TOTAL: $${total.toLocaleString('es-AR')}*\n\n¡Gracias por tu  compra! `;

	return `${header}${itemLines}${footer}`;
}

export function sendWhatsAppOrder(
	items: CartItem[],
	delivery: DeliveryInfo,
	shippingCost: number,
	whatsappNumber: string,
	notes?: string,
): void {
	const message = formatOrderForWhatsApp(
		items,
		delivery,
		shippingCost,
		notes,
	);
	const encodedMessage = encodeURIComponent(message);
	window.open(
		`https://wa.me/${whatsappNumber}?text=${encodedMessage}`,
		'_blank',
	);
}

