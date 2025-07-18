
"use server";

import { z } from "zod";
import type { CartItem } from '@/context/cart-context';

const contactSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres."),
  email: z.string().email("Por favor, introduce un correo electrónico válido."),
  message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres."),
});

export type FormState = {
  success: boolean;
  message: string;
};

export async function submitContactForm(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!validatedFields.success) {
    const errorMessages = validatedFields.error.errors.map(e => e.message).join('. ');
    return {
      success: false,
      message: errorMessages,
    };
  }

  try {
    // In a real app, you would process the data, e.g., send an email or save to a DB.
    console.log("Contact form submitted successfully:");
    console.log(validatedFields.data);

    return {
      success: true,
      message: "¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.",
    };
  } catch (error) {
    console.error("Error submitting form:", error);
    return {
      success: false,
      message: "Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo.",
    };
  }
}

const checkoutSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres."),
  email: z.string().email("Por favor, introduce un correo electrónico válido."),
});

export async function processCheckout(
  cartItems: CartItem[],
  total: number,
  prevState: FormState,
  formData: FormData
): Promise<FormState> {

  const validatedFields = checkoutSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
  });

  if (!validatedFields.success) {
    const errorMessages = validatedFields.error.errors.map(e => e.message).join('. ');
    return {
      success: false,
      message: errorMessages,
    };
  }

  const { name, email } = validatedFields.data;
  const orderId = `order_${Date.now()}`;
  const storeEmail = "tiendademanualidades25@gmail.com";

  try {
    // --- SIMULACIÓN DE ENVÍO DE CORREO ---
    // En una aplicación real, aquí iría la lógica para enviar correos.
    
    // 1. Preparar contenido del correo
    const orderDetailsText = cartItems.map(item => 
      `- ${item.name} (${item.price}) ${item.customizationValue ? `[Personalización: ${item.customizationValue}]` : ''}`
    ).join('\n');

    const emailToStore = {
      to: storeEmail,
      subject: `Nuevo Pedido #${orderId}`,
      body: `Has recibido un nuevo pedido de ${name} (${email}).\n\nDetalles del pedido:\n${orderDetailsText}\n\nTotal: ${total.toFixed(2)} €`
    };

    const emailToCustomer = {
      to: email,
      subject: `Confirmación de tu pedido #${orderId} en Tienda de Manualidades`,
      body: `¡Gracias por tu compra, ${name}!\n\nHemos recibido tu pedido.\n\nResumen:\n${orderDetailsText}\n\nTotal: ${total.toFixed(2)} €\n\nNos pondremos en contacto contigo pronto para los detalles del envío.`
    };

    // 2. Mostrar en consola (simulación)
    console.log("--- CORREO PARA LA TIENDA ---");
    console.log(emailToStore);
    console.log("-----------------------------");
    console.log("--- CORREO PARA EL CLIENTE ---");
    console.log(emailToCustomer);
    console.log("------------------------------");
    
    return {
      success: true,
      message: "¡Gracias por tu pedido! Hemos enviado una confirmación a tu correo.",
    };

  } catch (error) {
    console.error("Error procesando el pago:", error);
    return {
      success: false,
      message: "Hubo un error al procesar tu pedido. Por favor, inténtalo de nuevo.",
    };
  }
}
