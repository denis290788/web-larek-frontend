import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';

interface ISuccess {
	total: number;
}

interface ISuccessActions {
	onClick: () => void;
}

export class OrderSuccess extends Component<ISuccess> {
	protected _total: HTMLElement;
	protected _close: HTMLButtonElement;

	constructor(container: HTMLElement, actions: ISuccessActions) {
		super(container);

		this._total = this.container.querySelector('.order-success__description');
		this._close = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			this.container
		);

		if (actions?.onClick) {
			this._close.addEventListener('click', actions.onClick);
		}
	}

	set total(value: string) {
		this.setText(this._total, `Списано ${value} синапсов`);
	}
	get total(): string {
		return this._total.textContent || '';
	}
}
