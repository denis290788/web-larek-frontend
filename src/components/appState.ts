import { IItem, IItemsData, IOrder, IProduct } from '../types';
import { EventEmitter, IEvents } from './base/events';

export class Item implements IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
	// add(): void;
	// remove(): void;
	// isInBasket(id: string): boolean;
}

// export class AppState implements IItemsData {
// 	basket: string[];
// 	items: Item[];
// 	preview: string | null;
// 	order: IOrder = {
// 		payment: '',
// 		email: '',
// 		phone: '',
// 		address: '',
// 		total: 0,
// 		items: [],
// 	};

// 	clearBasket() {
// 		this.basket = [];
// 	}

// 	getTotal() {
// 		return this.order.items.reduce(
// 			(a, c) => a + this.items.find((it) => it._id === c).price,
// 			0
// 		);
// 	}

// 	setCatalog(items: Item[]) {
// 		this.items = items.map((item) => new Item());
// 		this.emit('items:changed', { items: this.items });
// 	}
// }

export class ProductData implements IItemsData {
	items: IProduct[];
	preview: string | null;
	events: IEvents;

	constructor(events: IEvents) {
		this.items = [];
		this.events = events;
	}
	setItems(items: IProduct[]) {
		this.items = items;
		this.events.emit('items:changed');
	}
	getItems() {
		return this.items;
	}
	getItem(itemId: string) {
		return this.items.find((item) => item.id === itemId);
	}
	setPreview(itemId: string | null) {
		if (!itemId) {
			this.preview = null;
			return;
		}
		const selectedItem = this.getItem(itemId);
		if (selectedItem) {
			this.preview = itemId;
			this.events.emit('item:selected');
		}
	}
	getPreview() {
		return this.preview;
	}
}

export class BasketData {
	items: IProduct[];
	total: number;
	events: IEvents;

	constructor(events: IEvents) {
		this.items = [];
		this.total = 0;
		this.events = events;
	}
	addItem(item: IProduct) {
		this.items.push(item);
		this.events.emit('basket:changed');
	}
	removeItem(itemId: string) {
		this.items = this.items.filter((item) => item.id !== itemId);
		this.events.emit('basket:changed');
	}
	clearBasket() {
		this.items = [];
		this.events.emit('basket:changed');
	}
	getTotal() {
		return this.items.reduce(
			(a, c) => a + this.items.find((item) => item.id === c.id).price,
			0
		);
	}
	makeOrder() {
		const order = new Order(this.events);
		order.setOrderInfo({
			items: this.items.map((item) => item.id),
			payment: '',
			address: '',
			phone: '',
			email: '',
			total: this.getTotal(),
		});
		this.events.emit('basket:order');
		return order;
	}
}

export class Order implements IOrder {
	items: string[];
	payment: string;
	address: string;
	phone: string;
	email: string;
	total: number;
	events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
	}

	getOrderInfo() {
		return {
			items: this.items,
			payment: this.payment,
			address: this.address,
			phone: this.phone,
			email: this.email,
			total: this.total,
		};
	}

	setOrderInfo(orderData: IOrder) {
		this.items = orderData.items;
		this.payment = orderData.payment;
		this.address = orderData.address;
		this.phone = orderData.phone;
		this.email = orderData.email;
		this.total = orderData.total;
		this.events.emit('order:changed');
	}
}
