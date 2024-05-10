export interface IItem {
	_id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

export interface IProduct {
	id: string;
	price: number | null;
	description: string;
	title: string;
	category: string;
	image: string;
}

export interface IOrder {
	items: string[];
	payment: string;
	address: string;
	phone: string;
	email: string;
	total: number;
}

export interface IPayedOrder {
	id: string;
	total: number;
}

export interface IAppState {
	basket: IProduct[];
	items: IProduct[];
	preview: string | null;
	order: IOrder | null;
}

export interface IContactsForm {
	email: string;
	phone: string;
}

export interface IOrderForm {
	payment: string;
	address: string;
}

export interface IOrder extends IOrderForm, IContactsForm {
	items: string[];
	total: number;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;
