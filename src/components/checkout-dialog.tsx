
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
import { useEffect, useRef, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

interface CheckoutDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const initialState: FormState = {
  success: false,
  message: "",
};

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

  const processCheckoutWithItems = processCheckout.bind(null, cartItems, total);

  const [state, formAction] = useActionState(processCheckoutWithItems, initialState);
  
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      formRef.current?.reset();
    }
    onOpenChange(open);
  }

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? "Pedido Realizado" : "Error",
        description: state.message,
        variant: state.success ? "default" : "destructive",
      });
      if (state.success) {
        clearCart();
        onOpenChange(false);
      }
    }
  }, [state, toast, clearCart, onOpenChange]);

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
            <DialogFooter>
                <SubmitButton />
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
