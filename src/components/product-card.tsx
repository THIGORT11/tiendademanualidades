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
import type { Product } from '@/content/catalog';
import { storeConfig } from '@/content/store';
import { formatPrice, getProductPricing } from '@/lib/product-pricing';
import { getProductStockLabel, hasNewProductTag, isProductOutOfStock } from '@/lib/product-stock';

export type { Product } from '@/content/catalog';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [customizationValue, setCustomizationValue] = useState('');
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [isChoiceDialogOpen, setIsChoiceDialogOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { toast } = useToast();
  const { addToCart, canAddToCart } = useCart();

  const productImages = product.images;
  const numberCustomization = product.customization?.type === 'number' ? product.customization : undefined;
  const isNumberChoice = Boolean(numberCustomization);
  const pricing = getProductPricing(product);
  const isOutOfStock = isProductOutOfStock(product);
  const hasNewTag = hasNewProductTag(product);
  const stockLabel = getProductStockLabel(product);
  const isAtStockLimit = !isOutOfStock && !canAddToCart(product);

  const validateCustomization = () => {
    if (!product.customization || customizationValue.trim()) {
      if (isNumberChoice) {
        const selectedNumber = Number(customizationValue);
        const min = numberCustomization?.min ?? 1;
        const max = numberCustomization?.max ?? 8;
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
          ? `Introduce un número del ${numberCustomization?.min ?? 1} al ${numberCustomization?.max ?? 8}.`
          : "Por favor, completa la opción de personalización.",
        variant: "destructive",
      });
      return;
    }
    
    addToCart(product, customizationValue);
    
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
          {(product.featured || hasNewTag) ? (
            <div className="absolute left-3 top-3 z-10 flex flex-col items-start gap-1 pointer-events-none">
              {product.featured ? (
                <span className="rounded-md bg-primary px-2 py-1 text-xs font-bold text-primary-foreground shadow">
                  {storeConfig.catalog.featuredBadgeLabel}
                </span>
              ) : null}
              {hasNewTag ? (
                <span className="rounded-md bg-amber-500 px-2 py-1 text-xs font-bold text-amber-950 shadow">
                  {storeConfig.catalog.newBadgeLabel}
                </span>
              ) : null}
            </div>
          ) : null}
          <Image
            src={productImages[activeImageIndex]}
            alt={`${product.name}${productImages.length > 1 ? `, imagen ${activeImageIndex + 1} de ${productImages.length}` : ''}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={productImages.length > 1 ? "object-contain bg-white" : "object-cover"}
            data-ai-hint={product.aiHint}
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
        {stockLabel ? (
          <p className={`mt-3 text-sm font-medium ${isOutOfStock ? 'text-destructive' : 'text-muted-foreground'}`}>
            {stockLabel}
          </p>
        ) : null}
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center bg-muted/30 mt-auto">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          {product.originalPrice !== undefined ? <span className="text-sm text-muted-foreground line-through">{formatPrice(pricing.basePrice, storeConfig.currency.symbol)}</span> : null}
          <span className="text-2xl font-bold text-primary">{formatPrice(pricing.currentPrice, storeConfig.currency.symbol)}</span>
          {pricing.discountPercentage !== undefined ? (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary" aria-label={`${pricing.discountPercentage}% de descuento`}>
              −{pricing.discountPercentage}%
            </span>
          ) : null}
        </div>
        {isOutOfStock ? <Button disabled>Agotado</Button> : null}
        {!isOutOfStock && showAddToCart ? (
           <Button onClick={handleAddToCart} disabled={isAtStockLimit}>
             <ShoppingCart className="mr-2 h-4 w-4" />
             {isAtStockLimit ? 'Máximo en carrito' : 'Añadir al carrito'}
           </Button>
        ) : null}
        {!isOutOfStock && showPersonalizeButton ? (
          <Button onClick={handleCustomizeClick} disabled={isAtStockLimit}>
            {isNumberChoice ? <ShoppingCart className="mr-2 h-4 w-4" /> : <Edit className="mr-2 h-4 w-4" />}
            {isAtStockLimit ? 'Máximo en carrito' : isNumberChoice ? 'Añadir al carrito' : 'Personalizar'}
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
                min={numberCustomization?.min}
                max={numberCustomization?.max}
                step={1}
                value={customizationValue}
                onChange={(event) => setCustomizationValue(event.target.value)}
                placeholder="Escribe un número del 1 al 8"
                className="bg-background"
              />
              {numberCustomization?.helpText && (
                <p className="text-xs text-muted-foreground">{numberCustomization.helpText}</p>
              )}
            </div>

            <DialogFooter>
              <Button type="button" onClick={handleAddToCart} className="w-full sm:w-auto" disabled={isAtStockLimit}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                {isAtStockLimit ? 'Máximo en carrito' : 'Confirmar y añadir'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}
