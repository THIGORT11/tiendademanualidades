# Contrato administrable de Tienda de Manualidades

Los tres JSON de esta carpeta son la fuente de verdad editable. Los componentes no deben contener productos, categorías, cupones ni textos de configuración duplicados.

## Archivos editables

- `catalog.json`: categorías, productos, disponibilidad, imágenes y personalizaciones.
- `promotions.json`: descuentos de pedido, cupones y futuros banners.
- `store.json`: marca, metadatos, textos generales, pie, correo de pedidos y moneda.

`schema.ts` valida la estructura. `catalog.ts`, `promotions.ts` y `store.ts` publican datos validados para la aplicación. El dashboard debe modificar únicamente los tres JSON.

## Compatibilidad con el dashboard

Los campos comunes siguen el contrato v1 de AliStore: `schemaVersion`, IDs estables, `sortOrder`, `active`, `availability`, `stock`, `featured`, `tags`, `price`, `originalPrice`, `discounts`, `coupons`, `banners`, marca, metadatos, pie, pedidos y moneda.

Esta tienda necesita un adaptador de contrato para dos diferencias reales:

1. admite imágenes existentes de `d2j6dbq0eux0bg.cloudfront.net`;
2. conserva personalizaciones de tipo `text`, `radio` y `number`, en vez del modelo de opciones con recargo de AliStore.

## Precios y descuentos de producto

- `price` es el precio final que paga el cliente.
- `originalPrice` solo existe cuando el producto está rebajado y debe ser estrictamente mayor que `price`.
- Sin `originalPrice`, la tienda muestra únicamente `price`.
- El porcentaje se calcula en la interfaz y no se almacena.

Los cupones y promociones de pedido son independientes de los descuentos propios de producto.

## Reglas

- Mantener `schemaVersion` en `1` hasta una migración explícita.
- Los IDs usan minúsculas, números y guiones y no se reutilizan.
- Los importes son números sin símbolo de moneda.
- Cada producto referencia una categoría existente mediante `categoryId`.
- `active: false` oculta una categoría o producto sin eliminarlo.
- `featured` y el tag `nuevo` son independientes: cada uno muestra su propio distintivo y ambos pueden aparecer a la vez sin alterar los demás tags.
- `stock` ausente o `null` significa stock no controlado y no muestra cantidades. Con `availability: available` debe ser un entero positivo; `0` exige `availability: out_of_stock`. Un producto `out_of_stock` no puede declarar stock positivo.
- El límite de stock se aplica al total de unidades físicas con el mismo `productId`, aunque tengan personalizaciones distintas.
- Los JSON deben validarse y publicarse juntos cuando cambien relaciones.
