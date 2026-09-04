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

    // Obter data/hora SP fallback se não vier do front
    const fallbackTimestamp = new Date().toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).replace(',', '');

    const payload = {
      ...data, // Espalha todos os campos, incluindo os novos (utm_term, campaign_id, created_at_br, etc)
      secret: process.env.SHEETS_INGEST_SECRET,
      timestamp: data.created_at_br || data.timestamp || fallbackTimestamp,
      DataHora: data.created_at_br || data.timestamp || fallbackTimestamp // Extra field para garantir
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

    // Ler a resposta do Apps Script estritamente
    try {
      const responseData = await response.json();
      
      // Se o Apps Script retornou ok explicitamente (seja duplicate ou não)
      if (responseData.ok === true) {
        return NextResponse.json({ ok: true, duplicate: responseData.duplicate || false, lead_id });
      }
      
      // Se retornou ok: false explícito
      if (responseData.ok === false) {
        console.error("Sheets API returned ok: false", responseData);
        return NextResponse.json({ ok: false, error: responseData.error || "Sheets rejected the lead" }, { status: 400 });
      }

      // Se não tem formato conhecido mas foi HTTP 200, assume ok mas avisa
      return NextResponse.json({ ok: true, lead_id });
      
    } catch (err) {
      // Falha ao fazer parse do JSON do Apps Script
      console.error("Failed to parse Sheets API response", err);
      // Não consideramos ok se não conseguimos confirmar a resposta estruturada.
      return NextResponse.json({ ok: false, error: "Invalid response from Sheets API" }, { status: 502 });
    }
  } catch (error) {
    console.error("Error in /api/leads:", error);
    return NextResponse.json({ ok: false, error: "Internal Server Error" }, { status: 500 });
  }
}
