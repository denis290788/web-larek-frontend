import { IContactsForm } from '../types';
import { Form } from './Form';
import { IEvents } from './base/Events';

export class OrderContactsForm extends Form<IContactsForm> {
	protected _phoneInput: HTMLInputElement;
	protected _emailInput: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._phoneInput = this.container.elements.namedItem(
			'phone'
		) as HTMLInputElement;

		this._emailInput = this.container.elements.namedItem(
			'email'
		) as HTMLInputElement;
	}

	set phone(value: string) {
		this._phoneInput.value = value;
	}

	set email(value: string) {
		this._emailInput.value = value;
	}
}
