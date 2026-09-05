import type { CartItem } from '@/context/cart-context';
import { storeConfig } from '@/content/store';
import { formatPrice } from '@/lib/product-pricing';

export const generateEmailHtml = (title: string, content: string) => `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Roboto:wght@400;500&display=swap');
        
        body {
            font-family: 'Roboto', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #1a1a1a;
            color: #e0e0e0;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #252525;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 8px 30px rgba(0,0,0,0.5);
            border: 1px solid #333;
        }
        .header {
            background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
            padding: 40px 20px;
            text-align: center;
            border-bottom: 2px solid #f2b736;
        }
        .header img {
            max-width: 180px;
            height: auto;
            filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));
        }
        .content {
            padding: 40px;
        }
        h1 {
            font-family: 'Playfair Display', serif;
            color: #f2b736;
            font-size: 28px;
            margin-top: 0;
            margin-bottom: 20px;
            text-align: center;
            letter-spacing: 0.5px;
        }
        p {
            color: #cccccc;
            line-height: 1.8;
            font-size: 16px;
            margin-bottom: 25px;
        }
        .order-details {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            margin: 30px 0;
            background-color: #2a2a2a;
            border-radius: 8px;
            overflow: hidden;
        }
        .order-details th {
            background-color: #333;
            color: #f2b736;
            padding: 15px;
            text-align: left;
            font-weight: 500;
            text-transform: uppercase;
            font-size: 12px;
            letter-spacing: 1px;
        }
        .order-details td {
            padding: 15px;
            border-bottom: 1px solid #333;
            color: #e0e0e0;
        }
        .order-details tr:last-child td {
            border-bottom: none;
        }
        .total-section {
            background-color: #333;
            padding: 20px;
            border-radius: 8px;
            margin-top: 20px;
            text-align: right;
        }
        .total-label {
            color: #999;
            font-size: 14px;
            margin-right: 10px;
        }
        .total-amount {
            color: #f2b736;
            font-size: 24px;
            font-family: 'Playfair Display', serif;
            font-weight: 700;
        }
        .footer {
            background-color: #1a1a1a;
            padding: 30px;
            text-align: center;
            font-size: 13px;
            color: #666;
            border-top: 1px solid #333;
        }
        .button {
            display: inline-block;
            background: linear-gradient(45deg, #f2b736, #d4a02e);
            color: #1a1a1a;
            text-decoration: none;
            padding: 12px 30px;
            border-radius: 25px;
            font-weight: 500;
            margin-top: 20px;
            transition: transform 0.2s;
        }
        .highlight {
            color: #f2b736;
            font-weight: 500;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="${storeConfig.brand.logoUrl}" alt="${storeConfig.brand.displayName} Logo">
        </div>
        <div class="content">
            ${content}
        </div>
        <div class="footer">
            <p style="margin-bottom: 10px;">Gracias por confiar en nosotros</p>
            &copy; ${new Date().getFullYear()} ${storeConfig.footer.companyName}. ${storeConfig.footer.copyrightSuffix}
        </div>
    </div>
</body>
</html>
`;

export const generateOrderRows = (items: CartItem[]) => {
    return items.map(item => `
        <tr>
            <td>
                <div style="font-weight: 500; color: #fff;">${item.name}</div>
                ${item.customizationValue ? `<div style="font-size: 12px; color: #999; margin-top: 4px;">Personalización: ${item.customizationValue}</div>` : ''}
            </td>
            <td style="text-align: right; font-family: 'Roboto', monospace;">${formatPrice(item.price, storeConfig.currency.symbol)}</td>
        </tr>
    `).join('');
};
