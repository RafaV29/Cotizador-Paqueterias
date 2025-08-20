// api/rate.js
export default async function handler(req, res) {
  // ✅ Encabezados CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { origin, destination, packages } = req.body;

  if (!origin?.postalCode || !destination?.postalCode) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  try {
    const response = await fetch('https://api.envia.com/ship/rate/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ENVIACOM_TOKEN}`
      },
      body: JSON.stringify({
        origin,
        destination,
        packages,
        shipment: { type: 0 },
        settings: { currency: 'MXN' }
      })
    });

    const data = await response.json();
    res.status(response.ok ? 200 : response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

