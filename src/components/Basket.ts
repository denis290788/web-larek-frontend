import { createElement, ensureElement } from '../utils/utils';
import { Component } from './base/Component';
import { EventEmitter } from './base/Events';

interface IBasketView {
	items: HTMLElement[];
	total: string;
}

export class BasketModal extends Component<IBasketView> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLButtonElement;
	protected _removeButton: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = this.container.querySelector('.basket__price');
		this._button = this.container.querySelector('.basket__button');
		this._removeButton = this.container.querySelector(
			'.basket__item-delete card__button'
		);

		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('basket:order');
			});
		}

		if (this._removeButton) {
			this._removeButton.addEventListener('click', () => {
				events.emit('basket:change');
			});
		}

		this.items = [];
	}

	toggleOrderButton(value: boolean) {
		this.setDisabled(this._button, !value);
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
		} else {
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		}
	}

	set total(total: string) {
		this.setText(this._total, `${total} синапсов`);
	}
}
