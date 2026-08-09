// src/components/cart-sheet.tsx
"use client";

import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { CheckoutDialog } from "./checkout-dialog";
import { useState } from "react";

export function CartSheet() {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, total } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  
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
                <div className="w-full">
                    <div className="flex justify-between items-center text-lg font-bold">
                        <span>Total:</span>
                        <span>{total.toFixed(2)} €</span>
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
    <CheckoutDialog isOpen={isCheckoutOpen} onOpenChange={setIsCheckoutOpen} />
    </>
  );
}
