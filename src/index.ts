import { Basket } from './components/Basket';
import { Card, ICard } from './components/Card';
import { ContactsForm } from './components/ContactsForm';
import { Modal } from './components/Modal';
import { Page } from './components/Page';
import { Success } from './components/Success';
import {
	BasketData,
	CatalogChangeEvent,
	Item,
	ProductData,
} from './components/appState';
import { EventEmitter } from './components/base/events';
import { shopAPI } from './components/shopAPI';
import './scss/styles.scss';
import { IProduct } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';

const events = new EventEmitter();
const api = new shopAPI(CDN_URL, API_URL);

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

const appData = new ProductData({}, events);
const basketData = new BasketData(events);

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const contactsForm = new ContactsForm(cloneTemplate(contactsTemplate), events);
const contacts = new ContactsForm(cloneTemplate(contactsTemplate), events);

events.on<CatalogChangeEvent>('items:changed', () => {
	page.catalog = appData.items.map((item) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			title: item.title,
			image: item.image,
			category: item.category,
			price: item.price,
		});
	});
});

events.on('card:select', (item: Item) => {
	appData.setPreview(item);
});

events.on('preview:changed', (item: Item) => {
	const card = new Card(cloneTemplate(cardPreviewTemplate), {
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
		content: createElement<HTMLElement>('div', {}, [basket.render()]),
	});

	if (basketData.getTotal()) {
		basket.toggleOrderButton(true);
	} else {
		basket.toggleOrderButton(false);
	}
});

events.on('basket:changed', () => {
	page.counter = basketData.getItems().length;
	let index = 1;
	basket.items = basketData.getItems().map((item: Item) => {
		const card = new Card(cloneTemplate(cardBasketTemplate), {
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
	// basket.selected = appData.order.items;
	basket.total = basketData.getTotal().toString();
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
	.catch((err) => {
		console.error(err);
	});

// basket.items = testBasket.map((item) => {
// 	const card = new Card(cloneTemplate(cardBasketTemplate), {
// 		onClick: () => {},
// 	});
// 	return card.render({
// 		title: item.title,
// 		price: `${item.price} синапсов`,
// 	});
// });
// basket.total = testBasket.reduce(
// 	(a, c) => a + testBasket.find((item) => item.id === c.id).price,
// 	0
// );

// modal.render({
// 	content: createElement<HTMLElement>('div', {}, [basket.render()]),
// });

// const productData = new ProductData(events);
// const basket = new BasketData(events);
// const order = new Order(events);

// api
// 	.getProductList()
// 	.then((value) => {
// 		value.forEach((item) => productData.items.push(item));

// 		console.log(productData.getItems());
// 		console.log(productData.getItem('854cef69-976d-4c2a-a18c-2aa45046c390'));

// 		basket.addItem(productData.getItem('854cef69-976d-4c2a-a18c-2aa45046c390'));
// 		console.log(basket.items);

// 		console.log(basket.makeOrder());
// 	})
// 	.catch((err) => {
// 		console.error(err);
// 	});

// order.setOrderInfo(testOrder);

// api.orderProducts(order).then((result) => console.log(result));
