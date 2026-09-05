import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { getProductPricing } from '../src/lib/product-pricing.ts';

const contentDirectory = new URL('../src/content/', import.meta.url);
const catalog = JSON.parse(await readFile(new URL('catalog.json', contentDirectory), 'utf8'));
const promotions = JSON.parse(await readFile(new URL('promotions.json', contentDirectory), 'utf8'));
const store = JSON.parse(await readFile(new URL('store.json', contentDirectory), 'utf8'));

test('centraliza todos los productos y categorías existentes', () => {
  assert.equal(catalog.schemaVersion, 1);
  assert.equal(catalog.categories.length, 6);
  assert.equal(catalog.products.length, 19);
  assert.equal(new Set(catalog.products.map((product) => product.id)).size, 19);
});

test('conserva el cupón comercial existente', () => {
  assert.deepEqual(promotions.coupons.map(({ code, discountValue }) => ({ code, discountValue })), [
    { code: 'CUM TM', discountValue: 10 },
  ]);
});

test('conserva marca, moneda y correo de pedidos', () => {
  assert.equal(store.brand.displayName, 'Tienda de Manualidades');
  assert.equal(store.currency.code, 'EUR');
  assert.equal(store.orders.adminEmail, 'tiendademanualidades25@gmail.com');
});

test('interpreta productos normales y rebajados con el contrato compartido', () => {
  assert.deepEqual(getProductPricing({ price: 5 }), { basePrice: 5, currentPrice: 5 });
  assert.deepEqual(getProductPricing({ price: 4, originalPrice: 5 }), {
    basePrice: 5,
    currentPrice: 4,
    savings: 1,
    discountPercentage: 20,
  });
});
