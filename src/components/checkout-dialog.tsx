
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/hooks/use-toast";
import { processCheckout, type FormState } from "@/app/actions";
import { useEffect, useRef, useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { BadgeCheck, Loader2 } from "lucide-react";

interface CheckoutDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const initialState: FormState = {
  success: false,
  message: "",
};

const DISCOUNT_CODE = "CUM TM";
const DISCOUNT_STORAGE_KEY = "craftlab-discount-cum-tm-used";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button 
      type="submit" 
      aria-disabled={pending} 
      disabled={pending}
      className="w-full"
    >
      {pending ? <Loader2 className="animate-spin" /> : "Confirmar Pedido"}
    </Button>
  );
}

export function CheckoutDialog({ isOpen, onOpenChange }: CheckoutDialogProps) {
  const { cartItems, total, clearCart } = useCart();
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [discountCode, setDiscountCode] = useState("");
  const [isDiscountApplied, setIsDiscountApplied] = useState(false);
  const [hasUsedDiscount, setHasUsedDiscount] = useState(false);

  const discountAmount = isDiscountApplied ? total * 0.1 : 0;
  const finalTotal = total - discountAmount;

  const processCheckoutWithItems = processCheckout.bind(null, cartItems, total, hasUsedDiscount);

  const [state, formAction] = useActionState(processCheckoutWithItems, initialState);
  
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      formRef.current?.reset();
      setDiscountCode("");
      setIsDiscountApplied(false);
    }
    onOpenChange(open);
  }

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

  useEffect(() => {
    setHasUsedDiscount(localStorage.getItem(DISCOUNT_STORAGE_KEY) === "true");
  }, []);

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? "Pedido Realizado" : "Error",
        description: state.message,
        variant: state.success ? "default" : "destructive",
      });
      if (state.success) {
        if (state.discountApplied) {
          localStorage.setItem(DISCOUNT_STORAGE_KEY, "true");
          setHasUsedDiscount(true);
        }
        clearCart();
        onOpenChange(false);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Finalizar Compra</DialogTitle>
          <DialogDescription>
            Introduce tus datos para completar el pedido. Te enviaremos una confirmación por correo electrónico.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} ref={formRef} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Nombre Completo</Label>
                <Input id="name" name="name" placeholder="Tu nombre" required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input id="email" name="email" type="email" placeholder="tu@email.com" required />
            </div>
            <div className="space-y-2 rounded-lg border p-4">
                <Label htmlFor="discountCode">Código de descuento</Label>
                <div className="flex gap-2">
                    <Input
                      id="discountCode"
                      value={discountCode}
                      onChange={(event) => {
                        setDiscountCode(event.target.value);
                        setIsDiscountApplied(false);
                      }}
                      placeholder="Introduce tu código"
                      disabled={hasUsedDiscount}
                      autoComplete="off"
                    />
                    <input type="hidden" name="discountCode" value={isDiscountApplied ? DISCOUNT_CODE : ""} />
                    <Button type="button" variant="secondary" onClick={handleApplyDiscount} disabled={hasUsedDiscount || isDiscountApplied}>
                      {isDiscountApplied ? <BadgeCheck className="mr-2 h-4 w-4" /> : null}
                      {isDiscountApplied ? "Aplicado" : "Canjear"}
                    </Button>
                </div>
                {hasUsedDiscount && (
                  <p className="text-sm text-muted-foreground">Ya has utilizado este código de descuento.</p>
                )}
            </div>
            <div className="space-y-2 rounded-lg bg-muted/50 p-4 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{total.toFixed(2)} €</span>
              </div>
              {isDiscountApplied && (
                <div className="flex justify-between text-primary">
                  <span>Descuento (10 %)</span>
                  <span>−{discountAmount.toFixed(2)} €</span>
                </div>
              )}
              <div className="flex justify-between border-t pt-2 text-base font-bold">
                <span>Total</span>
                <span>{finalTotal.toFixed(2)} €</span>
              </div>
            </div>
            <DialogFooter>
                <SubmitButton />
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
