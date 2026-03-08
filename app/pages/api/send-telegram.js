// pages/api/send-telegram.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;
  const BOT_TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN; // Stocke ton token dans les variables d'environnement
  const CHAT_ID = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID; // Stocke ton chat_id dans les variables d'environnement
  const TELEGRAM_URL = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  try {
    const response = await fetch(TELEGRAM_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    const data = await response.json();
    if (!data.ok) {
      throw new Error(data.description || 'Failed to send message');
    }

    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error('Erreur envoi Telegram:', err);
    return res.status(500).json({ error: err.message });
  }
}
