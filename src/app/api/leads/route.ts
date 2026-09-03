import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validar campos básicos recebidos
    const {
      lead_id,
      name,
      whatsapp,
      business,
      project_type,
      origin,
      campaign,
      adset,
      ad,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      fbclid,
      fbc,
      fbp
    } = data;

    if (!name || !whatsapp || !business || !project_type || !lead_id) {
      return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 });
    }

    const payload = {
      secret: process.env.SHEETS_INGEST_SECRET,
      lead_id,
      name,
      whatsapp,
      business,
      project_type,
      origin,
      campaign,
      adset,
      ad,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      fbclid,
      fbc,
      fbp
    };

    const webhookUrl = process.env.SHEETS_WEBHOOK_URL;
    
    if (!webhookUrl) {
      console.error("SHEETS_WEBHOOK_URL not defined.");
      return NextResponse.json({ ok: false, error: "Configuration error on server" }, { status: 500 });
    }

    // Disparar POST para o Google Sheets / Apps Script
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error("Sheets API returned an error status:", response.status);
      return NextResponse.json({ ok: false, error: "Failed to forward to Sheets" }, { status: 502 });
    }

    // Mesmo que passe do if acima, algumas vezes o Apps Script retorna 200 com JSON { ok: true/false }
    // Mas se for só HTTP 200, consideramos OK.
    try {
      const responseData = await response.json();
      // O App Script retorna um JSON no sucesso (deduplicação ou não)
      // assumimos que se não estourar erro, ok é true.
    } catch (err) {
      // It might return plain text or empty response, which is fine as long as status was ok
    }

    return NextResponse.json({ ok: true, lead_id });
  } catch (error) {
    console.error("Error in /api/leads:", error);
    return NextResponse.json({ ok: false, error: "Internal Server Error" }, { status: 500 });
  }
}
