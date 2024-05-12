import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export interface ICard {
	title: string;
	description?: string;
	image?: string;
	category?: string;
	price: number;
	index?: string;
}

const categoryColor: { [key: string]: string } = {
	'софт-скил': 'card__category_soft',
	другое: 'card__category_other',
	дополнительное: 'card__category_additional',
	кнопка: 'card__category_button',
	'хард-скил': 'card__category_hard',
};

export class ItemCard extends Component<ICard> {
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _description?: HTMLElement;
	protected _category?: HTMLElement;
	protected _button?: HTMLButtonElement;
	protected _index?: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);

		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._image = container.querySelector('.card__image');
		this._button = container.querySelector('.button');
		this._description = container.querySelector('.card__text');
		this._category = container.querySelector('.card__category');
		this._index = container.querySelector('.basket__item-index');

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	toggleBasketButton(value: boolean) {
		if (value) {
			this.setDisabled(this._button, false);
		} else {
			this.setDisabled(this._button, true);
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}
	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}
	get title(): string {
		return this._title.textContent || '';
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set price(value: string) {
		if (typeof value === 'number') {
			this.setText(this._price, `${value} синапсов`);
		} else {
			this.setText(this._price, 'Бесценно');
		}
	}
	get price(): string {
		return this._price.textContent || '';
	}

	set description(value: string) {
		this.setText(this._description, value);
	}
	get description(): string {
		return this._description.textContent || '';
	}

	set category(value: string) {
		this._category.classList.add(categoryColor[value]);
		this.setText(this._category, value);
	}
	get category(): string {
		return this._category.textContent || '';
	}

	set index(value: string) {
		this.setText(this._index, value);
	}
}
