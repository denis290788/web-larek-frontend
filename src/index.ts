import { BasketModal } from './components/Basket';
import { ItemCard } from './components/Card';
import { OrderContactsForm } from './components/ContactsForm';
import { Modal } from './components/Modal';
import { OrderInfoForm } from './components/OrderForm';
import { Page } from './components/Page';
import { OrderSuccess } from './components/Success';
import {
	Basket,
	CatalogChangeEvent,
	Item,
	AppState,
} from './components/appState';
import { EventEmitter } from './components/base/events';
import { AppAPI } from './components/shopAPI';
import './scss/styles.scss';
import { IContactsForm, IOrderForm } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';

const events = new EventEmitter();
const api = new AppAPI(CDN_URL, API_URL);

events.onAll((event) => {
	console.log(event.eventName, event.data);
});

//Шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const appData = new AppState({}, events);
const basketData = new Basket(events);

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basketModal = new BasketModal(cloneTemplate(basketTemplate), events);
const orderForm = new OrderInfoForm(cloneTemplate(orderTemplate), events);
const contactsForm = new OrderContactsForm(
	cloneTemplate(contactsTemplate),
	events
);
const success = new OrderSuccess(cloneTemplate(successTemplate), {
	onClick: () => {
		modal.close();
	},
});

events.on<CatalogChangeEvent>('items:changed', () => {
	page.catalog = appData.items.map((item) => {
		const card = new ItemCard(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('item:selected', item),
		});
		return card.render({
			title: item.title,
			image: item.image,
			category: item.category,
			price: item.price,
		});
	});
});

events.on('item:selected', (item: Item) => {
	appData.setPreview(item);
});

events.on('preview:changed', (item: Item) => {
	const card = new ItemCard(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			basketData.addItem(item);
			card.toggleBasketButton(false);
			events.emit('basket:changed', item);
		},
	});

	if (typeof item.price !== 'number' || basketData.items.includes(item)) {
		card.toggleBasketButton(false);
	} else {
		card.toggleBasketButton(true);
	}

	modal.render({
		content: card.render({
			title: item.title,
			image: item.image,
			description: item.description,
			category: item.category,
			price: item.price,
		}),
	});
});

events.on('basket:open', () => {
	modal.render({
		content: createElement<HTMLElement>('div', {}, [basketModal.render()]),
	});

	basketModal.toggleOrderButton(Boolean(basketData.getTotal()));
});

events.on('basket:changed', () => {
	page.counter = basketData.getItems().length;
	let index = 1;
	basketModal.items = basketData.getItems().map((item: Item) => {
		const card = new ItemCard(cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				basketData.removeItem(item);
			},
		});
		return card.render({
			title: item.title,
			price: item.price,
			index: String(index++),
		});
	});
	basketModal.toggleOrderButton(Boolean(basketData.getItems().length));
	basketModal.total = basketData.getTotal().toString();
});

events.on('basket:order', () => {
	orderForm.setPayment('');
	appData.setPaymentField('');
	appData.setAddressField('');
	appData.order.items = basketData.getItems().map((item) => item.id);
	appData.order.total = basketData.getTotal();
	modal.render({
		content: orderForm.render({
			payment: '',
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on('order.payment:change', (data: { method: string }) => {
	appData.setPaymentField(data.method);
});

events.on('order.address:change', (data: { value: string }) => {
	appData.setAddressField(data.value);
});

events.on('orderFormErrors:change', (errors: Partial<IOrderForm>) => {
	const { payment, address } = errors;
	orderForm.valid = !payment && !address;
	orderForm.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
});

events.on('order:submit', () => {
	appData.setContactsField('phone', '');
	appData.setContactsField('email', '');
	modal.render({
		content: contactsForm.render({
			phone: '',
			email: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on(
	/^contacts\.(email|phone):change$/,
	(data: { field: keyof IContactsForm; value: string }) => {
		appData.setContactsField(data.field, data.value);
	}
);

events.on('contactsFormErrors:change', (errors: Partial<IContactsForm>) => {
	const { email, phone } = errors;
	contactsForm.valid = !email && !phone;
	contactsForm.errors = Object.values({ email, phone })
		.filter((i) => !!i)
		.join('; ');
});

events.on('contacts:submit', () => {
	api
		.orderProducts(appData.order)
		.then((result) => {
			modal.render({
				content: success.render({
					total: appData.order.total,
				}),
			});

			basketData.clearBasket();
			events.emit('basket:changed');
		})
		.catch(console.error);
});

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});

api
	.getProductList()
	.then(appData.setCatalog.bind(appData))
	.catch(console.error);
