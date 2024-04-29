export interface IItem {
	_id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number;
	add(): void;
	remove(): void;
	isInBasket(id: string): boolean;
}

export type TItemInfo = Pick<IItem, 'image' | 'title' | 'category' | 'price'>;

export type TItemInBasketInfo = Pick<IItem, 'title' | 'price'>;

export interface IItemsData {
	items: IItem[];
	preview: string | null;
	updateItem(item: IItem): void;
	getItem(itemId: string): IItem;
}

export interface IBasket {
	basket: TItemInBasketInfo[];
	total: number;
	getItems(): IItem[];
	makeOrder(items: IItem[]): void;
}

export interface IOrder {
	items: IItem[];
	payment: 'online' | 'cash';
	address: string;
	phone: string;
	email: string;
	total: number;
}

export interface IOrderInfo {
	getOrderInfo(order: IOrder): void;
	payOrder(order: IOrder): IPayedOrder;
	checkOrderInfoValidation(data: Record<keyof TOrderInfo, string>): boolean;
	checkOrderContactsValidation(
		data: Record<keyof TOrderContacts, string>
	): boolean;
}

export interface IPayedOrder {
	id: string;
	total: number;
}

export type TOrderInfo = Pick<IOrder, 'payment' | 'address'>;

export type TOrderContacts = Pick<IOrder, 'phone' | 'email'>;
