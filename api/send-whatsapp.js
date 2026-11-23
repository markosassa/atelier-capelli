// Endpoint Serverless (Vercel / Next.js / Node) per invio sicuro tramite Meta Graph API v21.0
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { clientPhone, clientName, date, time, serviceNames, staffName } = req.body;
  const cleanPhone = clientPhone.replace(/[^0-9]/g, '');

  const PHONE_NUMBER_ID = process.env.META_PHONE_NUMBER_ID;
  const ACCESS_TOKEN = process.env.META_WHATSAPP_TOKEN;

  try {
    const response = await fetch(
      `https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: cleanPhone,
          type: 'template',
          template: {
            name: 'conferma_appuntamento_salone',
            language: { code: 'it' },
            components: [
              {
                type: 'body',
                parameters: [
                  { type: 'text', text: clientName },
                  { type: 'text', text: date },
                  { type: 'text', text: time },
                  { type: 'text', text: serviceNames },
                  { type: 'text', text: staffName },
                ],
              },
            ],
          },
        }),
      }
    );

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'Errore Meta API' });
    }

    return res.status(200).json({ success: true, messageId: data.messages?.[0]?.id });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
