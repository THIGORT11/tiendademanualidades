import rawPromotions from './promotions.json';
import { promotionsSchema } from './schema';
import { assertUnique } from './validation';

export const promotionConfig = promotionsSchema.parse(rawPromotions);

assertUnique(promotionConfig.discounts.map((discount) => discount.id), 'IDs de descuento');
assertUnique(promotionConfig.coupons.map((coupon) => coupon.id), 'IDs de cupón');
assertUnique(
  promotionConfig.coupons.map((coupon) => coupon.code.trim().replace(/\s+/g, ' ').toUpperCase()),
  'Códigos de cupón',
);
assertUnique(promotionConfig.banners.map((banner) => banner.id), 'IDs de banner');

export const activeCoupons = promotionConfig.coupons
  .filter((coupon) => coupon.active)
  .sort((a, b) => a.sortOrder - b.sortOrder);

export function normalizeCouponCode(code: string) {
  return code.trim().replace(/\s+/g, ' ').toUpperCase();
}

function isAvailableNow(coupon: (typeof activeCoupons)[number], now = new Date()) {
  const timestamp = now.getTime();
  return (!coupon.startsAt || Date.parse(coupon.startsAt) <= timestamp)
    && (!coupon.endsAt || Date.parse(coupon.endsAt) >= timestamp);
}

export function findCoupon(code: string, now = new Date()) {
  const normalized = normalizeCouponCode(code);
  return activeCoupons.find((coupon) => normalizeCouponCode(coupon.code) === normalized && isAvailableNow(coupon, now));
}

export function calculateCouponDiscount(total: number, coupon: (typeof activeCoupons)[number] | undefined) {
  if (!coupon || (coupon.minimumSubtotal !== undefined && total < coupon.minimumSubtotal)) return 0;
  const value = coupon.discountType === 'percentage'
    ? total * (coupon.discountValue / 100)
    : coupon.discountValue;
  return Math.min(total, Math.round((value + Number.EPSILON) * 100) / 100);
}

export type { Coupon } from './schema';
