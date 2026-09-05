// src/components/cart-sheet.tsx
"use client";

import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { BadgeCheck, Trash2 } from "lucide-react";
import { CheckoutDialog } from "./checkout-dialog";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { activeCoupons, calculateCouponDiscount, findCoupon, type Coupon } from '@/content/promotions';
import { formatPrice, getProductPricing } from '@/lib/product-pricing';
import { storeConfig } from '@/content/store';

function couponStorageKey(coupon: Coupon) {
  return coupon.legacyStorageKeys?.[0] ?? `craftlab-coupon-${coupon.id}-used`;
}

export function CartSheet() {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, total } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon>();
  const [usedCouponIds, setUsedCouponIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const isDiscountApplied = Boolean(appliedCoupon);
  const hasUsedDiscount = appliedCoupon ? usedCouponIds.has(appliedCoupon.id) : false;
  const discountAmount = calculateCouponDiscount(total, appliedCoupon);
  const finalTotal = total - discountAmount;

  useEffect(() => {
    // La lectura debe ocurrir tras hidratar porque localStorage solo existe en el navegador.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUsedCouponIds(new Set(activeCoupons
      .filter((coupon) => localStorage.getItem(couponStorageKey(coupon)) === 'true')
      .map((coupon) => coupon.id)));
  }, []);

  const handleApplyDiscount = () => {
    const coupon = findCoupon(discountCode);
    if (!coupon) {
      setAppliedCoupon(undefined);
      toast({
        title: "Código no válido",
        description: "Comprueba el código e inténtalo de nuevo.",
        variant: "destructive",
      });
      return;
    }

    if (usedCouponIds.has(coupon.id)) {
      toast({
        title: "Código ya utilizado",
        description: "Este código de descuento solo se puede utilizar una vez.",
        variant: "destructive",
      });
      return;
    }

    if (coupon.minimumSubtotal !== undefined && total < coupon.minimumSubtotal) {
      toast({
        title: "Subtotal insuficiente",
        description: `Este código requiere un subtotal mínimo de ${formatPrice(coupon.minimumSubtotal, storeConfig.currency.symbol)}.`,
        variant: "destructive",
      });
      return;
    }

    setDiscountCode(coupon.code);
    setAppliedCoupon(coupon);
    toast({
      title: "Descuento aplicado",
      description: coupon.discountType === 'percentage'
        ? `Se ha descontado un ${coupon.discountValue} % del total de tu pedido.`
        : `Se han descontado ${formatPrice(coupon.discountValue, storeConfig.currency.symbol)} del total de tu pedido.`,
    });
  };

  const handleDiscountUsed = () => {
    if (!appliedCoupon) return;
    localStorage.setItem(couponStorageKey(appliedCoupon), "true");
    setUsedCouponIds((current) => new Set(current).add(appliedCoupon.id));
    setAppliedCoupon(undefined);
    setDiscountCode("");
  };
  
  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  }

  return (
    <>
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Carrito de Compras ({cartItems.length})</SheetTitle>
        </SheetHeader>
        {cartItems.length > 0 ? (
          <>
            <ScrollArea className="flex-grow pr-4 -mr-6">
              <div className="flex flex-col gap-4">
                {cartItems.map((item, index) => {
                  const pricing = getProductPricing(item);
                  return <div key={`${item.id}-${index}`} className="flex items-start gap-4 p-2 rounded-lg bg-muted/50">
                    <div className="flex shrink-0 gap-1">
                      {item.images.map((imageUrl, imageIndex) => (
                        <Image
                          key={imageUrl}
                          src={imageUrl}
                          alt={`${item.name}${item.images.length > 1 ? `, imagen ${imageIndex + 1}` : ''}`}
                          width={item.images.length > 1 ? 52 : 64}
                          height={64}
                          className="h-16 rounded-md object-cover"
                        />
                      ))}
                    </div>
                    <div className="flex-grow">
                      <p className="font-semibold">{item.name}</p>
                      <div className="flex flex-wrap items-baseline gap-x-1.5">
                        {item.originalPrice !== undefined ? <span className="text-xs text-muted-foreground line-through">{formatPrice(pricing.basePrice, storeConfig.currency.symbol)}</span> : null}
                        <span className="text-sm font-semibold text-primary">{formatPrice(pricing.currentPrice, storeConfig.currency.symbol)}</span>
                      </div>
                      {item.customizationValue && (
                        <p className="text-sm text-primary truncate">
                          {item.customization?.type === 'number' ? 'Número elegido' : 'Personalización'}: {item.customizationValue}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => removeFromCart(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>;
                })}
              </div>
            </ScrollArea>
            <SheetFooter className="mt-auto border-t pt-4">
                <div className="w-full space-y-4">
                    <div className="space-y-2 rounded-lg border border-primary/30 bg-muted/30 p-3">
                      <Label htmlFor="cart-discount-code">Código de descuento</Label>
                      <div className="flex gap-2">
                        <Input
                          id="cart-discount-code"
                          value={discountCode}
                          onChange={(event) => {
                            setDiscountCode(event.target.value);
                            setAppliedCoupon(undefined);
                          }}
                          placeholder="Introduce tu código"
                          autoComplete="off"
                          className="min-w-0 flex-1"
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={handleApplyDiscount}
                          disabled={!discountCode.trim() || isDiscountApplied}
                        >
                          {isDiscountApplied ? <BadgeCheck className="mr-2 h-4 w-4" /> : null}
                          {isDiscountApplied ? "Aplicado" : "Canjear"}
                        </Button>
                      </div>
                      {hasUsedDiscount ? (
                        <p className="text-xs text-muted-foreground">Ya has utilizado este código de descuento.</p>
                      ) : null}
                    </div>

                    <div className="space-y-1">
                      {isDiscountApplied ? (
                        <>
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Subtotal:</span>
                            <span>{formatPrice(total, storeConfig.currency.symbol)}</span>
                          </div>
                          <div className="flex justify-between text-sm text-primary">
                            <span>{appliedCoupon?.name}:</span>
                            <span>−{formatPrice(discountAmount, storeConfig.currency.symbol)}</span>
                          </div>
                        </>
                      ) : null}
                      <div className="flex justify-between items-center text-lg font-bold">
                          <span>Total:</span>
                          <span>{formatPrice(finalTotal, storeConfig.currency.symbol)}</span>
                      </div>
                    </div>
                    <Button size="lg" className="w-full mt-4" onClick={handleCheckout}>
                        Finalizar Compra
                    </Button>
                </div>
            </SheetFooter>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-lg text-muted-foreground">Tu carrito está vacío.</p>
            <p className="text-sm text-muted-foreground mt-2">¡Añade productos para empezar!</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
    <CheckoutDialog
      isOpen={isCheckoutOpen}
      onOpenChange={setIsCheckoutOpen}
      isDiscountApplied={isDiscountApplied}
      discountCode={appliedCoupon?.code}
      hasUsedDiscount={hasUsedDiscount}
      onDiscountUsed={handleDiscountUsed}
    />
    </>
  );
}
