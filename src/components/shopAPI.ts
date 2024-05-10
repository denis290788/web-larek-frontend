import { IProduct, IOrder, IPayedOrder } from '../types';
import { Api, ApiListResponse } from './base/api';

export interface IShopAPI {
	getProductList: () => Promise<IProduct[]>;
	orderProducts: (order: IOrder) => Promise<IPayedOrder>;
}

export class shopAPI extends Api implements IShopAPI {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getProductList(): Promise<IProduct[]> {
		return this.get<ApiListResponse<IProduct>>('/product').then(
			(data: ApiListResponse<IProduct>) =>
				data.items.map((item) => ({
					...item,
					image: this.cdn + item.image,
				}))
		);
	}

	orderProducts(order: IOrder): Promise<IPayedOrder> {
		return this.post<IPayedOrder>('/order', order).then(
			(data: IPayedOrder) => data
		);
	}
}
