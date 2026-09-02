import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // AQUI NÓS SALVAMOS O LEAD (MESMO SE ELE CANCELAR O WHATSAPP)
    console.log("🔥 LEAD CAPTURADO SILENCIOSAMENTE 🔥", data);
    
    // TODO: Enviar para Google Sheets, Webhook (Make/Zapier), Discord ou Banco de Dados
    
    return NextResponse.json({ success: true, message: "Lead salvo com sucesso" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Falha ao salvar lead" }, { status: 500 });
  }
}
