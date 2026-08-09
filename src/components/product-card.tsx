// src/components/product-card.tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Edit, ChevronLeft, ChevronRight } from "lucide-react";
import { useCart } from "@/context/cart-context";

export interface Product {
  name: string;
  price: string;
  imageUrl: string;
  imageUrls?: string[];
  dataAiHint: string;
  description?: string;
  customization?: {
    type: 'text' | 'radio' | 'number';
    label: string;
    options?: string[];
    min?: number;
    max?: number;
    helpText?: string;
  };
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [customizationValue, setCustomizationValue] = useState('');
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [isChoiceDialogOpen, setIsChoiceDialogOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { toast } = useToast();
  const { addToCart } = useCart();

  const productImages = product.imageUrls?.length ? product.imageUrls : [product.imageUrl];
  const isNumberChoice = product.customization?.type === 'number';

  const validateCustomization = () => {
    if (!product.customization || customizationValue.trim()) {
      if (isNumberChoice) {
        const selectedNumber = Number(customizationValue);
        const min = product.customization?.min ?? 1;
        const max = product.customization?.max ?? 8;
        return Number.isInteger(selectedNumber) && selectedNumber >= min && selectedNumber <= max;
      }
      return true;
    }
    return false;
  };

  const handleAddToCart = () => {
    if (!validateCustomization()) {
      toast({
        title: isNumberChoice ? "Elige un número válido" : "Personalización requerida",
        description: isNumberChoice
          ? `Introduce un número del ${product.customization?.min ?? 1} al ${product.customization?.max ?? 8}.`
          : "Por favor, completa la opción de personalización.",
        variant: "destructive",
      });
      return;
    }
    
    addToCart(product, customizationValue);
    
    toast({
      title: "Producto añadido",
      description: `${product.name} ${customizationValue ? `(${customizationValue})` : ''} ha sido añadido al carrito.`,
    });
    
    if (product.customization) {
        setCustomizationValue('');
        setIsCustomizing(false);
        setIsChoiceDialogOpen(false);
    }
  };

  const handleCustomizeClick = () => {
    if (isNumberChoice) {
      setIsChoiceDialogOpen(true);
      return;
    }
    setIsCustomizing(true);
  };

  const showPreviousImage = () => {
    setActiveImageIndex((current) => (current - 1 + productImages.length) % productImages.length);
  };

  const showNextImage = () => {
    setActiveImageIndex((current) => (current + 1) % productImages.length);
  };
  
  const showCustomization = product.customization && isCustomizing && !isNumberChoice;
  const showAddToCart = !product.customization || isCustomizing;
  const showPersonalizeButton = product.customization && !isCustomizing;

  return (
    <Card className="flex flex-col overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-card">
      <CardHeader className="p-0">
        <div className="relative w-full h-64 group">
          <Image
            src={productImages[activeImageIndex]}
            alt={`${product.name}${productImages.length > 1 ? `, imagen ${activeImageIndex + 1} de ${productImages.length}` : ''}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={productImages.length > 1 ? "object-contain bg-white" : "object-cover"}
            data-ai-hint={product.dataAiHint}
          />
          {productImages.length > 1 && (
            <>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full shadow-lg"
                onClick={showPreviousImage}
                aria-label="Ver imagen anterior"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full shadow-lg"
                onClick={showNextImage}
                aria-label="Ver imagen siguiente"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2" aria-hidden="true">
                {productImages.map((_, index) => (
                  <span key={index} className={`h-2 w-2 rounded-full shadow ${index === activeImageIndex ? 'bg-primary' : 'bg-white/70'}`} />
                ))}
              </div>
            </>
          )}
        </div>
        <div className="p-4">
          <CardTitle className="text-xl font-headline text-foreground">{product.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        {showCustomization && product.customization?.type === 'text' && (
          <div className="space-y-2 mb-4">
            <Label htmlFor={`custom-${product.name}`}>{product.customization.label}</Label>
            <Input 
              id={`custom-${product.name}`} 
              value={customizationValue} 
              onChange={(e) => setCustomizationValue(e.target.value)}
              placeholder="..."
              className="bg-background"
            />
          </div>
        )}
        {showCustomization && product.customization?.type === 'radio' && (
          <div className="space-y-3 mb-4">
            <Label>{product.customization.label}</Label>
            <RadioGroup onValueChange={setCustomizationValue} value={customizationValue}>
              {product.customization.options?.map(option => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`${product.name}-${option}`} />
                  <Label htmlFor={`${product.name}-${option}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center bg-muted/30 mt-auto">
        <p className="text-2xl font-bold text-primary">{product.price}</p>
        {showAddToCart ? (
           <Button onClick={handleAddToCart}>
             <ShoppingCart className="mr-2 h-4 w-4" />
             Añadir al carrito
           </Button>
        ) : null}
        {showPersonalizeButton ? (
          <Button onClick={handleCustomizeClick}>
            {isNumberChoice ? <ShoppingCart className="mr-2 h-4 w-4" /> : <Edit className="mr-2 h-4 w-4" />}
            {isNumberChoice ? 'Añadir al carrito' : 'Personalizar'}
          </Button>
        ) : null}
      </CardFooter>

      {isNumberChoice && (
        <Dialog open={isChoiceDialogOpen} onOpenChange={setIsChoiceDialogOpen}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Elige tu Aquabeads</DialogTitle>
              <DialogDescription>{product.description}</DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {productImages.map((imageUrl, index) => (
                <div key={imageUrl} className="relative aspect-square overflow-hidden rounded-lg border bg-muted">
                  <Image
                    src={imageUrl}
                    alt={`${product.name}, opciones ${index * 4 + 1} a ${index * 4 + 4}`}
                    fill
                    sizes="(max-width: 640px) 90vw, 320px"
                    className="object-contain bg-white"
                  />
                  <span className="absolute left-2 top-2 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-foreground shadow">
                    Números {index * 4 + 1}–{index * 4 + 4}
                  </span>
                </div>
              ))}
            </div>

            <div className="rounded-lg border border-primary/30 bg-primary/10 p-4 text-sm leading-relaxed">
              <p className="font-semibold mb-1">Cómo elegir</p>
              <p>En la primera imagen: arriba izquierda es 1, arriba derecha 2, abajo izquierda 3 y abajo derecha 4. En la segunda imagen se repite el orden con los números 5, 6, 7 y 8.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`choice-${product.name}`}>{product.customization?.label}</Label>
              <Input
                id={`choice-${product.name}`}
                type="number"
                inputMode="numeric"
                min={product.customization?.min}
                max={product.customization?.max}
                step={1}
                value={customizationValue}
                onChange={(event) => setCustomizationValue(event.target.value)}
                placeholder="Escribe un número del 1 al 8"
                className="bg-background"
              />
              {product.customization?.helpText && (
                <p className="text-xs text-muted-foreground">{product.customization.helpText}</p>
              )}
            </div>

            <DialogFooter>
              <Button type="button" onClick={handleAddToCart} className="w-full sm:w-auto">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Confirmar y añadir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}
