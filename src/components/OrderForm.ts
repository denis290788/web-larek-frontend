import { IOrderForm } from '../types';
import { ensureElement } from '../utils/utils';
import { Form } from './Form';
import { IEvents } from './base/events';

export class OrderInfoForm extends Form<IOrderForm> {
	protected _paymentContainer: HTMLDivElement;
	protected _paymentButton: HTMLButtonElement[];
	protected _addressInput: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._paymentContainer = ensureElement<HTMLDivElement>(
			'.order__buttons',
			this.container
		);

		this._paymentButton = Array.from(
			this._paymentContainer.querySelectorAll('.button_alt')
		);

		this._addressInput = this.container.elements.namedItem(
			'address'
		) as HTMLInputElement;

		this._paymentContainer.addEventListener('click', (event) => {
			const method = event.target as HTMLButtonElement;
			if (method.classList.contains('button_alt')) {
				this.setPayment(method.name);
				this.events.emit('order.payment:change', {
					method: method.name,
				});
			}
		});
	}

	setPayment(className: string) {
		this._paymentButton.forEach((button) => {
			this.toggleClass(button, 'button_alt-active', button.name === className);
		});
	}

	set address(value: string) {
		this._addressInput.value = value;
	}
}
