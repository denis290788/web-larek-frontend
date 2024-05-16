export type ApiListResponse<Type> = {
	total: number;
	items: Type[];
};

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export class Api {
	readonly baseUrl: string;
	protected options: RequestInit;

	constructor(baseUrl: string, options: RequestInit = {}) {
		this.baseUrl = baseUrl;
		this.options = {
			headers: {
				'Content-Type': 'application/json',
				...((options.headers as object) ?? {}),
			},
		};
	}

	protected handleResponse<T>(response: Response): Promise<T> {
		if (response.ok) return response.json();
		else
			return response
				.json()
				.then((data) => Promise.reject(data.error ?? response.statusText));
	}

	_request<T>(uri: string, options: object) {
		return fetch(this.baseUrl + uri, options).then(this.handleResponse<T>);
	}

	get<T>(uri: string) {
		return this._request<T>(uri, {
			...this.options,
			method: 'GET',
		});
	}

	post<T>(uri: string, data: object, method: ApiPostMethods = 'POST') {
		return this._request<T>(uri, {
			...this.options,
			method,
			body: JSON.stringify(data),
		});
	}
}
