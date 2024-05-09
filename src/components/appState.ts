import {
	FormErrors,
	IAppState,
	IContactsForm,
	IItem,
	IItemsData,
	IOrder,
	IProduct,
} from '../types';
import { EventEmitter, IEvents } from './base/events';

abstract class Model<T> {
	constructor(data: Partial<T>, protected events: IEvents) {
		Object.assign(this, data);
	}

	emitChanges(event: string, payload?: object) {
		this.events.emit(event, payload ?? {});
	}
}

export type CatalogChangeEvent = {
	catalog: Item[];
};

export class Item extends Model<IProduct> {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

export class ProductData extends Model<IAppState> {
	basket: IProduct[];
	items: IProduct[];
	preview: string | null;
	order: IOrder = {
		email: '',
		phone: '',
		items: [],
		payment: '',
		address: '',
		total: 0,
	};
	formErrors: FormErrors = {};

	setCatalog(items: IProduct[]) {
		this.items = items.map((item) => new Item(item, this.events));
		this.emitChanges('items:changed', { items: this.items });
	}

	setPreview(item: Item) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

	setContactsField(field: keyof IContactsForm, value: string) {
		this.order[field] = value;

		if (this.validateContactsForm()) {
			this.events.emit('order:ready', this.order);
		}
	}

	validateContactsForm() {
		const errors: typeof this.formErrors = {};
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
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

	getItems() {
		return this.items;
	}

	addItem(item: IProduct) {
		this.items.push(item);
		this.events.emit('basket:changed');
	}
	removeItem(itemToRemove: IProduct) {
		this.items = this.items.filter((item) => item.id !== itemToRemove.id);
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
}
// 	makeOrder() {
// 		const order = new Order(this.events);
// 		order.setOrderInfo({
// 			items: this.items.map((item) => item.id),
// 			payment: '',
// 			address: '',
// 			phone: '',
// 			email: '',
// 			total: this.getTotal(),
// 		});
// 		this.events.emit('basket:order');
// 		return order;
// 	}
// }

// export class Order implements IOrder {
// 	items: string[];
// 	payment: string;
// 	address: string;
// 	phone: string;
// 	email: string;
// 	total: number;
// 	events: IEvents;
// 	formErrors: string;

// 	constructor(events: IEvents) {
// 		this.events = events;
// 	}

// 	getOrderInfo() {
// 		return {
// 			items: this.items,
// 			payment: this.payment,
// 			address: this.address,
// 			phone: this.phone,
// 			email: this.email,
// 			total: this.total,
// 		};
// 	}

// 	setOrderInfo(orderData: IOrder) {
// 		this.items = orderData.items;
// 		this.payment = orderData.payment;
// 		this.address = orderData.address;
// 		this.phone = orderData.phone;
// 		this.email = orderData.email;
// 		this.total = orderData.total;
// 		this.events.emit('order:changed');
// 	}

// 	setContactsField(field: keyof IContactsForm, value: string) {
// 		this[field] = value;

// 		if (this.validateContacts()) {
// 			this.events.emit('order:ready', this);
// 		}
// 	}

// 	validateContacts() {
// 		if (!this.email || !this.phone) {
// 			this.formErrors = 'Необходимо заполнить контактные данные';
// 		}
// 		this.events.emit('formErrors:change');
// 		return Boolean(this.formErrors);
// 	}
// }
