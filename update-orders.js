import fs from 'fs';
import path from 'path';
import TelegramBot from 'node-telegram-bot-api';

const bot = new TelegramBot('7414598655:AAEroWQ277kT5Yy-1kpVblOjRXhOQc_9BAY', { polling: false });
const ADMIN_CHAT_ID = '7845232622';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const data = req.body;

  fs.writeFileSync(path.join(process.cwd(), 'public/orders.json'), JSON.stringify(data, null, 2));

  const lastOrder = data[data.length - 1];
  const notif = `✅ Order Baru Masuk\nNama: ${lastOrder.nama}\nWA: ${lastOrder.wa}\nProduk: ${lastOrder.produk}\n${lastOrder.gmail ? 'Gmail: ' + lastOrder.gmail + '\n' : ''}Catatan: ${lastOrder.catatan || '-'}`;

  await bot.sendMessage(ADMIN_CHAT_ID, notif);

  res.status(200).json({ status: 'ok' });
}
