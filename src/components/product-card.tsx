
"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Edit } from "lucide-react";

export interface Product {
  name: string;
  price: string;
  imageUrl: string;
  dataAiHint: string;
  customization?: {
    type: 'text' | 'radio';
    label: string;
    options?: string[];
  };
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [customizationValue, setCustomizationValue] = useState('');
  const [isCustomizing, setIsCustomizing] = useState(!!product.customization);
  const { toast } = useToast();

  const handleAddToCart = () => {
    if (product.customization && !customizationValue) {
      toast({
        title: "Personalización requerida",
        description: "Por favor, completa la opción de personalización.",
        variant: "destructive",
      });
      return;
    }
    
    setIsCustomizing(false);
    
    toast({
      title: "Producto añadido",
      description: `${product.name} ${customizationValue ? `(${customizationValue})` : ''} ha sido añadido al carrito.`,
    });
    
    if (product.customization) {
        setCustomizationValue('');
        setTimeout(() => setIsCustomizing(true), 100);
    }
  };

  const handleCustomizeClick = () => {
    setIsCustomizing(true);
  };

  return (
    <Card className="flex flex-col overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-card">
      <CardHeader className="p-0">
        <div className="relative w-full h-64">
          <Image
            src={product.imageUrl}
            alt={product.name}
            layout="fill"
            objectFit="cover"
            data-ai-hint={product.dataAiHint}
          />
        </div>
        <div className="p-4">
          <CardTitle className="text-xl font-headline text-foreground">{product.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        {isCustomizing && product.customization?.type === 'text' && (
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
        {isCustomizing && product.customization?.type === 'radio' && (
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
      <CardFooter className="p-4 flex justify-between items-center bg-muted/30">
        <p className="text-2xl font-bold text-primary">{product.price}</p>
        {!product.customization || isCustomizing ? (
           <Button onClick={handleAddToCart}>
             <ShoppingCart className="mr-2 h-4 w-4" />
             Añadir al carrito
           </Button>
        ) : (
          <Button onClick={handleCustomizeClick}>
            <Edit className="mr-2 h-4 w-4" />
            Personalizar
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}