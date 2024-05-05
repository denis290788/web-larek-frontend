import { BasketData, Item, Order, ProductData } from './components/appState';
import { EventEmitter } from './components/base/events';
import { shopAPI } from './components/shopAPI';
import './scss/styles.scss';
import { IProduct } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';

const events = new EventEmitter();
const api = new shopAPI(CDN_URL, API_URL);

events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

//Шаблоны
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

const productData = new ProductData(events);
const basket = new BasketData(events);
const order = new Order(events);

api
	.getProductList()
	.then((value) => {
		value.forEach((item) => productData.items.push(item));

		console.log(productData.getItems());
		console.log(productData.getItem('854cef69-976d-4c2a-a18c-2aa45046c390'));

		basket.addItem(productData.getItem('854cef69-976d-4c2a-a18c-2aa45046c390'));
		console.log(basket.items);

		console.log(basket.makeOrder());
	})
	.catch((err) => {
		console.error(err);
	});

const testOrder = {
	payment: 'online',
	email: 'test@test.ru',
	phone: '+71234567890',
	address: 'Spb Vosstania 1',
	total: 2200,
	items: [
		'854cef69-976d-4c2a-a18c-2aa45046c390',
		'c101ab44-ed99-4a54-990d-47aa2bb4e7d9',
	],
};

order.setOrderInfo(testOrder);

api.orderProducts(order).then((result) => console.log(result));
