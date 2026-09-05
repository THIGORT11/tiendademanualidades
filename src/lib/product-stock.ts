import type { Product } from '@/content/catalog';

export function isProductOutOfStock(product: Pick<Product, 'availability' | 'stock'>) {
  return product.availability === 'out_of_stock' || product.stock === 0;
}

export function hasNewProductTag(product: Pick<Product, 'tags'>) {
  return product.tags.some((tag) => tag.trim().toLocaleLowerCase('es') === 'nuevo');
}

export function getProductStockLabel(product: Pick<Product, 'availability' | 'stock'>) {
  if (isProductOutOfStock(product)) return 'Agotado';
  if (product.stock === undefined) return null;
  return product.stock === 1 ? 'Queda 1 unidad' : `Quedan ${product.stock} unidades`;
}

export function getCartQuantityForProduct(lines: Array<Pick<Product, 'id'>>, productId: string) {
  return lines.reduce((quantity, line) => line.id === productId ? quantity + 1 : quantity, 0);
}

export function canAddProduct(
  product: Pick<Product, 'availability' | 'stock'>,
  quantityInCart: number,
) {
  return !isProductOutOfStock(product)
    && (product.stock === undefined || quantityInCart < product.stock);
}

export function getStockValidationError(
  lines: Array<Pick<Product, 'id'>>,
  catalogProducts: Product[],
) {
  const productsById = new Map(catalogProducts.map((product) => [product.id, product]));
  const quantities = new Map<string, number>();

  for (const line of lines) {
    if (!productsById.has(line.id)) return 'Uno de los productos del carrito ya no está disponible.';
    quantities.set(line.id, (quantities.get(line.id) ?? 0) + 1);
  }

  for (const [productId, quantity] of quantities) {
    const product = productsById.get(productId)!;
    if (isProductOutOfStock(product)) {
      return `${product.name} ya no está disponible.`;
    }
    if (product.stock !== undefined && quantity > product.stock) {
      return `La cantidad solicitada de ${product.name} supera el stock disponible.`;
    }
  }

  return null;
}
