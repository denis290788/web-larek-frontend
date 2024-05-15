import {
	FormErrors,
	IItemsData,
	IContactsForm,
	IOrder,
	IProduct,
	IBasket,
} from '../types';
import { IEvents } from './base/Events';
import { Model } from './base/Model';

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

export class AppState extends Model<IItemsData> {
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

	setPaymentField(value: string) {
		this.order.payment = value;
		this.validateOrder();
	}

	setAddressField(value: string) {
		this.order.address = value;
		this.validateOrder();
	}

	setContactsField(field: keyof IContactsForm, value: string) {
		this.order[field] = value;
		this.validateContacts();
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};
		if (!this.order.payment) {
			errors.payment = 'Необходимо указать способ оплаты';
		}
		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}
		this.formErrors = errors;
		this.events.emit('orderFormErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	validateContacts() {
		const errors: typeof this.formErrors = {};
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		this.formErrors = errors;
		this.events.emit('contactsFormErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}
}

export class Basket extends Model<IBasket> {
	items: IProduct[];
	total: number;

	constructor(events: IEvents) {
		super({}, events);
		this.items = [];
		this.total = 0;
	}

	getItems(): IProduct[] {
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
