
"use server";

import { z } from "zod";
import type { CartItem } from '@/context/cart-context';
import nodemailer from 'nodemailer';
import 'dotenv/config';

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
  const storeEmail = process.env.EMAIL_TO;
  const fromEmail = process.env.EMAIL_SERVER_USER;

  if (!storeEmail || !fromEmail || !process.env.EMAIL_SERVER_PASSWORD) {
    console.error("Email environment variables are not set.");
    return {
        success: false,
        message: "Error de configuración del servidor. No se pudo procesar el pedido.",
    };
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: fromEmail,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });

  try {
    const orderDetailsText = cartItems.map(item => 
      `- ${item.name} (${item.price}) ${item.customizationValue ? `[Personalización: ${item.customizationValue}]` : ''}`
    ).join('\n');
    
    const emailHtmlToStore = `
      <h1>Nuevo Pedido #${orderId}</h1>
      <p>Has recibido un nuevo pedido de <strong>${name}</strong> (${email}).</p>
      <h2>Detalles del pedido:</h2>
      <pre>${orderDetailsText}</pre>
      <h3>Total: ${total.toFixed(2)} €</h3>
    `;

    const emailHtmlToCustomer = `
      <h1>¡Gracias por tu pedido, ${name}!</h1>
      <p>Hemos recibido tu pedido #${orderId} y ya lo estamos preparando.</p>
      <h2>Resumen de tu compra:</h2>
      <pre>${orderDetailsText}</pre>
      <h3>Total: ${total.toFixed(2)} €</h3>
      <p>Nos pondremos en contacto contigo pronto para los detalles del envío.</p>
    `;

    // Send mail to the store
    await transporter.sendMail({
      from: `Tienda de Manualidades <${fromEmail}>`,
      to: storeEmail,
      subject: `Nuevo Pedido #${orderId}`,
      html: emailHtmlToStore,
    });

    // Send confirmation to the customer
    await transporter.sendMail({
      from: `Tienda de Manualidades <${fromEmail}>`,
      to: email,
      subject: `Confirmación de tu pedido #${orderId}`,
      html: emailHtmlToCustomer,
    });
    
    return {
      success: true,
      message: "¡Gracias por tu pedido! Hemos enviado una confirmación a tu correo.",
    };

  } catch (error) {
    console.error("Error procesando el pago y enviando correos:", error);
    return {
      success: false,
      message: "Hubo un error al procesar tu pedido. Por favor, inténtalo de nuevo.",
    };
  }
}
