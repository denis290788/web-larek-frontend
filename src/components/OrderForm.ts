import { IOrderForm } from '../types';
import { Form } from './Form';
import { IEvents } from './base/events';

export class OrderForm extends Form<IOrderForm> {
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}

	set payment(value: string) {
		(this.container.elements.namedItem(value) as HTMLButtonElement).value =
			value;
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}
}
