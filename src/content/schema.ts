import { z } from 'zod';

const idSchema = z.string().min(1).regex(/^[a-z0-9][a-z0-9-]*$/);
const sortOrderSchema = z.number().int().nonnegative();
const imageUrlSchema = z.string().url().refine((value) => {
  const hostname = new URL(value).hostname;
  return hostname === 'i.imgur.com'
    || hostname === 'placehold.co'
    || hostname === 'd2j6dbq0eux0bg.cloudfront.net';
}, 'La imagen debe usar uno de los alojamientos permitidos por la tienda');

const customizationSchema = z.union([
  z.object({ type: z.literal('text'), label: z.string().min(1) }),
  z.object({
    type: z.literal('radio'),
    label: z.string().min(1),
    options: z.array(z.string().min(1)).min(1),
  }),
  z.object({
    type: z.literal('number'),
    label: z.string().min(1),
    min: z.number().int(),
    max: z.number().int(),
    helpText: z.string().min(1).optional(),
  }).refine((customization) => customization.max >= customization.min, {
    message: 'max debe ser mayor o igual que min',
    path: ['max'],
  }),
]);

export const categorySchema = z.object({
  id: idSchema,
  name: z.string().min(1),
  active: z.boolean(),
  sortOrder: sortOrderSchema,
});

export const productSchema = z.object({
  id: idSchema,
  name: z.string().min(1),
  description: z.string(),
  price: z.number().nonnegative(),
  originalPrice: z.number().positive().optional(),
  images: z.array(imageUrlSchema).min(1),
  categoryId: idSchema,
  tags: z.array(z.string().min(1)),
  aiHint: z.string(),
  availability: z.enum(['available', 'out_of_stock']),
  stock: z.number().int().nonnegative().nullish().transform((value) => value ?? undefined),
  featured: z.boolean(),
  active: z.boolean(),
  sortOrder: sortOrderSchema,
  customization: customizationSchema.optional(),
}).refine((product) => product.originalPrice === undefined || product.originalPrice > product.price, {
  message: 'originalPrice debe ser mayor que price cuando el producto tiene descuento',
  path: ['originalPrice'],
}).refine((product) => product.availability !== 'available' || product.stock !== 0, {
  message: 'Un producto disponible no puede tener stock 0',
  path: ['stock'],
}).refine((product) => product.availability !== 'out_of_stock' || product.stock === undefined || product.stock === 0, {
  message: 'Un producto agotado no puede tener stock positivo',
  path: ['stock'],
});

export const catalogSchema = z.object({
  schemaVersion: z.literal(1),
  categories: z.array(categorySchema),
  products: z.array(productSchema),
});

const discountFields = {
  id: idSchema,
  name: z.string().min(1),
  active: z.boolean(),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z.number().positive(),
  sortOrder: sortOrderSchema,
};

const couponSchema = z.object({
  ...discountFields,
  code: z.string().trim().min(1),
  usageLimitPerDevice: z.literal(1).optional(),
  minimumSubtotal: z.number().nonnegative().optional(),
  startsAt: z.string().datetime({ offset: true }).optional(),
  endsAt: z.string().datetime({ offset: true }).optional(),
  legacyStorageKeys: z.array(z.string().min(1)).optional(),
}).refine((coupon) => coupon.discountType !== 'percentage' || coupon.discountValue <= 100, {
  message: 'Un porcentaje no puede superar 100',
  path: ['discountValue'],
}).refine(
  (coupon) => !coupon.startsAt || !coupon.endsAt || coupon.startsAt < coupon.endsAt,
  { message: 'endsAt debe ser posterior a startsAt', path: ['endsAt'] },
);

const automaticDiscountSchema = z.object({
  ...discountFields,
  displayLabel: z.string().min(1),
  appliesTo: z.literal('order'),
  minimumSubtotal: z.number().nonnegative().optional(),
  startsAt: z.string().datetime({ offset: true }).optional(),
  endsAt: z.string().datetime({ offset: true }).optional(),
  stackable: z.boolean(),
});

const bannerSchema = z.object({
  id: idSchema,
  placement: z.literal('catalog-top'),
  title: z.string().min(1),
  body: z.string(),
  imageUrl: imageUrlSchema.optional(),
  linkLabel: z.string().min(1).optional(),
  linkHref: z.string().min(1).optional(),
  active: z.boolean(),
  startsAt: z.string().datetime({ offset: true }).optional(),
  endsAt: z.string().datetime({ offset: true }).optional(),
  sortOrder: sortOrderSchema,
}).refine((banner) => Boolean(banner.linkLabel) === Boolean(banner.linkHref), {
  message: 'linkLabel y linkHref deben definirse juntos',
});

export const promotionsSchema = z.object({
  schemaVersion: z.literal(1),
  discounts: z.array(automaticDiscountSchema),
  coupons: z.array(couponSchema),
  banners: z.array(bannerSchema),
});

const socialLinkSchema = z.object({
  id: z.enum(['facebook', 'twitter', 'instagram']),
  label: z.string().min(1),
  href: z.string().min(1),
  sortOrder: sortOrderSchema,
});

export const storeSchema = z.object({
  schemaVersion: z.literal(1),
  brand: z.object({
    name: z.string().min(1),
    displayName: z.string().min(1),
    logoUrl: imageUrlSchema,
    faviconUrl: imageUrlSchema,
  }),
  metadata: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    keywords: z.array(z.string().min(1)),
    home: z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      socialTitle: z.string().min(1),
      socialDescription: z.string().min(1),
      socialImageUrl: imageUrlSchema,
    }),
  }),
  catalog: z.object({
    searchPlaceholder: z.string().min(1),
    newBadgeLabel: z.string().min(1),
    featuredBadgeLabel: z.string().min(1),
  }),
  footer: z.object({
    companyName: z.string().min(1),
    copyrightYear: z.number().int().positive(),
    copyrightSuffix: z.string().min(1),
    socialLinks: z.array(socialLinkSchema),
  }),
  orders: z.object({ adminEmail: z.string().email() }),
  currency: z.object({ code: z.string().length(3), symbol: z.string().min(1) }),
});

export type Category = z.infer<typeof categorySchema>;
export type Product = z.infer<typeof productSchema>;
export type Coupon = z.infer<typeof couponSchema>;
