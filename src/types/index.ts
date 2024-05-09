export interface IItem {
	_id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
	// add(): void;
	// remove(): void;
	// isInBasket(id: string): boolean;
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

export type TItemInfo = Pick<IItem, 'image' | 'title' | 'category' | 'price'>;

export type TItemInBasketInfo = Pick<IItem, 'title' | 'price'>;

export interface IItemsData {
	items: IProduct[];
	preview: string | null;
}

export interface IAppState {
	basket: IProduct[];
	items: IProduct[];
	preview: string | null;
	order: IOrder | null;
}

export interface IBasket {
	basket: TItemInBasketInfo[];
	total: number;
	getItems(): IItem[];
	makeOrder(items: IItem[]): void;
}

export interface IOrderInfo {
	getOrderInfo(order: IOrder): void;
	payOrder(order: IOrder): IPayedOrder;
	checkOrderInfoValidation(data: Record<keyof TOrderInfo, string>): boolean;
	checkOrderContactsValidation(
		data: Record<keyof TOrderContacts, string>
	): boolean;
}

export type TOrderInfo = Pick<IOrder, 'payment' | 'address'>;

export type TOrderContacts = Pick<IOrder, 'phone' | 'email'>;

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
