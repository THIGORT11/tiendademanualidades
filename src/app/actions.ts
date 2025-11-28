
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

import { generateEmailHtml, generateOrderRows } from '@/lib/email-template';

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

  // Use environment variables but allow fallbacks for the TO address if needed, 
  // though credentials MUST be present.
  const storeEmail = process.env.EMAIL_TO || 'tiendademanualidades25@gmail.com';
  const fromEmail = process.env.EMAIL_SERVER_USER;
  const emailPassword = process.env.EMAIL_SERVER_PASSWORD;

  if (!fromEmail || !emailPassword) {
    console.error("CRITICAL ERROR: Email server credentials are missing.");
    console.error("EMAIL_SERVER_USER:", fromEmail ? "Set" : "Missing");
    console.error("EMAIL_SERVER_PASSWORD:", emailPassword ? "Set" : "Missing");

    return {
      success: false,
      message: "Error de configuración del servidor (Credenciales de correo faltantes). Por favor contacta al administrador.",
    };
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: fromEmail,
      pass: emailPassword,
    },
  });

  try {
    const orderRowsHtml = generateOrderRows(cartItems);

    const storeContent = `
        <h1>Nuevo Pedido <span class="highlight">#${orderId}</span></h1>
        <p>Has recibido un nuevo pedido de <strong>${name}</strong> (<a href="mailto:${email}" style="color: #f2b736;">${email}</a>).</p>
        
        <table class="order-details">
            <thead>
                <tr>
                    <th>Producto</th>
                    <th style="text-align: right;">Precio</th>
                </tr>
            </thead>
            <tbody>
                ${orderRowsHtml}
            </tbody>
        </table>
        
        <div class="total-section">
            <span class="total-label">Total del Pedido</span>
            <div class="total-amount">${total.toFixed(2)} €</div>
        </div>
    `;

    const customerContent = `
        <h1>¡Gracias por tu pedido!</h1>
        <p>Hola <span class="highlight">${name}</span>,</p>
        <p>Hemos recibido tu pedido <strong>#${orderId}</strong> correctamente. Estamos preparando todo con mucho cuidado.</p>
        
        <table class="order-details">
            <thead>
                <tr>
                    <th>Producto</th>
                    <th style="text-align: right;">Precio</th>
                </tr>
            </thead>
            <tbody>
                ${orderRowsHtml}
            </tbody>
        </table>
        
        <div class="total-section">
            <span class="total-label">Total a Pagar</span>
            <div class="total-amount">${total.toFixed(2)} €</div>
        </div>
        
        <p style="text-align: center; margin-top: 30px;">
            Nos pondremos en contacto contigo pronto si necesitamos más detalles.
        </p>
    `;

    // Send mail to the store
    await transporter.sendMail({
      from: `"Tienda de Manualidades" <${fromEmail}>`,
      to: storeEmail,
      subject: `✨ Nuevo Pedido #${orderId} - ${name}`,
      html: generateEmailHtml(`Nuevo Pedido #${orderId}`, storeContent),
    });

    // Send confirmation to the customer
    await transporter.sendMail({
      from: `"Tienda de Manualidades" <${fromEmail}>`,
      to: email,
      subject: `✨ Confirmación de tu pedido #${orderId}`,
      html: generateEmailHtml(`Confirmación de Pedido`, customerContent),
    });

    return {
      success: true,
      message: "¡Pedido realizado con éxito! Revisa tu correo para ver la confirmación.",
    };

  } catch (error) {
    console.error("Error sending emails:", error);
    return {
      success: false,
      message: "Tu pedido se guardó, pero hubo un error al enviar los correos de confirmación.",
    };
  }
}
