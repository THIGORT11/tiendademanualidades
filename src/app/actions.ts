
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
    const orderDetailsHtml = cartItems.map(item => 
      `<tr>
        <td style="padding: 10px; border-bottom: 1px solid #dddddd;">${item.name} ${item.customizationValue ? `(${item.customizationValue})` : ''}</td>
        <td style="padding: 10px; border-bottom: 1px solid #dddddd; text-align: right;">${item.price}</td>
      </tr>`
    ).join('');

    const emailTemplate = (title: string, content: string) => `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <title>${title}</title>
          <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; margin: 0; padding: 0; background-color: #f4f4f4; }
              .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
              .header { background-color: #2a2a2a; padding: 20px; text-align: center; }
              .header img { max-width: 250px; }
              .content { padding: 30px; color: #333333; line-height: 1.6; }
              .content h1 { color: #f2b736; font-size: 24px; margin-top: 0; }
              .content p { margin-bottom: 20px; }
              .order-details { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
              .order-details th { background-color: #f9f9f9; padding: 10px; text-align: left; border-bottom: 2px solid #eeeeee; }
              .total { text-align: right; font-size: 18px; font-weight: bold; color: #f2b736; margin-top: 20px; }
              .footer { background-color: #fafafa; padding: 20px; text-align: center; font-size: 12px; color: #777777; border-top: 1px solid #dddddd; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <img src="https://i.imgur.com/CWsII5N.png" alt="Tienda de Manualidades Logo">
              </div>
              <div class="content">
                  ${content}
              </div>
              <div class="footer">
                  &copy; ${new Date().getFullYear()} Tienda de Manualidades. Todos los derechos reservados.
              </div>
          </div>
      </body>
      </html>
    `;

    const storeContent = `
        <h1>Nuevo Pedido #${orderId}</h1>
        <p>Has recibido un nuevo pedido de <strong>${name}</strong> (${email}).</p>
        <h2>Detalles del pedido:</h2>
        <table class="order-details">
            <thead>
                <tr>
                    <th>Producto</th>
                    <th style="text-align: right;">Precio</th>
                </tr>
            </thead>
            <tbody>
                ${orderDetailsHtml}
            </tbody>
        </table>
        <div class="total">Total: ${total.toFixed(2)} €</div>
    `;

    const customerContent = `
        <h1>¡Gracias por tu pedido, ${name}!</h1>
        <p>Hemos recibido tu pedido #${orderId} y ya lo estamos preparando. Aquí tienes un resumen de tu compra:</p>
        <table class="order-details">
            <thead>
                <tr>
                    <th>Producto</th>
                    <th style="text-align: right;">Precio</th>
                </tr>
            </thead>
            <tbody>
                ${orderDetailsHtml}
            </tbody>
        </table>
        <div class="total">Total: ${total.toFixed(2)} €</div>
        <p>Nos pondremos en contacto contigo pronto para los detalles del envío.</p>
    `;

    // Send mail to the store
    await transporter.sendMail({
      from: `Tienda de Manualidades <${fromEmail}>`,
      to: storeEmail,
      subject: `Nuevo Pedido #${orderId}`,
      html: emailTemplate(`Nuevo Pedido #${orderId}`, storeContent),
    });

    // Send confirmation to the customer
    await transporter.sendMail({
      from: `Tienda de Manualidades <${fromEmail}>`,
      to: email,
      subject: `Confirmación de tu pedido #${orderId}`,
      html: emailTemplate(`Confirmación de pedido #${orderId}`, customerContent),
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
