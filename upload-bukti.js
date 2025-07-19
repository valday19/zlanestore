import fs from 'fs';
import path from 'path';
import formidable from 'formidable';
import TelegramBot from 'node-telegram-bot-api';

const bot = new TelegramBot('7414598655:AAEroWQ277kT5Yy-1kpVblOjRXhOQc_9BAY', { polling: false });
const ADMIN_CHAT_ID = '7845232622';

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req, res) {
  const form = new formidable.IncomingForm();
  form.uploadDir = path.join(process.cwd(), '/public/bukti');
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    const wa = fields.wa[0];
    const image = files.bukti[0];
    const ext = path.extname(image.originalFilename);
    const newFilename = `${wa}${ext}`;
    const newPath = path.join(form.uploadDir, newFilename);

    fs.renameSync(image.filepath, newPath);

    const orders = JSON.parse(fs.readFileSync('public/orders.json'));
    const current = orders.find(o => o.wa === wa);

    const text = `🧾 Bukti Pembayaran Masuk\nProduk: ${current?.produk}\nWA: ${wa}\n${current?.gmail ? 'Gmail: ' + current.gmail + '\n' : ''}File: public/bukti/${newFilename}`;

    await bot.sendMessage(ADMIN_CHAT_ID, text);

    res.status(200).json({ message: 'Bukti pembayaran berhasil diupload!' });
  });
}
