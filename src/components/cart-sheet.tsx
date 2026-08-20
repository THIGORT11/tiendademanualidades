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

const DISCOUNT_CODE = "CUM TM";
const DISCOUNT_STORAGE_KEY = "craftlab-discount-cum-tm-used";

export function CartSheet() {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, total } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [isDiscountApplied, setIsDiscountApplied] = useState(false);
  const [hasUsedDiscount, setHasUsedDiscount] = useState(false);
  const { toast } = useToast();

  const discountAmount = isDiscountApplied ? total * 0.1 : 0;
  const finalTotal = total - discountAmount;

  useEffect(() => {
    setHasUsedDiscount(localStorage.getItem(DISCOUNT_STORAGE_KEY) === "true");
  }, []);

  const handleApplyDiscount = () => {
    if (hasUsedDiscount) {
      toast({
        title: "Código ya utilizado",
        description: "Este código de descuento solo se puede utilizar una vez.",
        variant: "destructive",
      });
      return;
    }

    if (discountCode.trim().toUpperCase().replace(/\s+/g, " ") !== DISCOUNT_CODE) {
      setIsDiscountApplied(false);
      toast({
        title: "Código no válido",
        description: "Comprueba el código e inténtalo de nuevo.",
        variant: "destructive",
      });
      return;
    }

    setDiscountCode(DISCOUNT_CODE);
    setIsDiscountApplied(true);
    toast({
      title: "Descuento aplicado",
      description: "Se ha descontado un 10 % del total de tu pedido.",
    });
  };

  const handleDiscountUsed = () => {
    localStorage.setItem(DISCOUNT_STORAGE_KEY, "true");
    setHasUsedDiscount(true);
    setIsDiscountApplied(false);
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
                {cartItems.map((item, index) => (
                  <div key={`${item.name}-${index}`} className="flex items-start gap-4 p-2 rounded-lg bg-muted/50">
                    <div className="flex shrink-0 gap-1">
                      {(item.imageUrls?.length ? item.imageUrls : [item.imageUrl]).map((imageUrl, imageIndex) => (
                        <Image
                          key={imageUrl}
                          src={imageUrl}
                          alt={`${item.name}${item.imageUrls?.length ? `, imagen ${imageIndex + 1}` : ''}`}
                          width={item.imageUrls?.length ? 52 : 64}
                          height={64}
                          className="h-16 rounded-md object-cover"
                        />
                      ))}
                    </div>
                    <div className="flex-grow">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.price}</p>
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
                  </div>
                ))}
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
                            setIsDiscountApplied(false);
                          }}
                          placeholder="Introduce tu código"
                          disabled={hasUsedDiscount}
                          autoComplete="off"
                          className="min-w-0 flex-1"
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={handleApplyDiscount}
                          disabled={hasUsedDiscount || isDiscountApplied}
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
                            <span>{total.toFixed(2)} €</span>
                          </div>
                          <div className="flex justify-between text-sm text-primary">
                            <span>Descuento (10 %):</span>
                            <span>−{discountAmount.toFixed(2)} €</span>
                          </div>
                        </>
                      ) : null}
                      <div className="flex justify-between items-center text-lg font-bold">
                          <span>Total:</span>
                          <span>{finalTotal.toFixed(2)} €</span>
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
      hasUsedDiscount={hasUsedDiscount}
      onDiscountUsed={handleDiscountUsed}
    />
    </>
  );
}
