const BOT_TOKEN = '8555214864:AAFDB4B7O1gPe2S0bzM3AxoawifmSkctb2Y';
const CHAT_ID = '1944734410';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const caption = formData.get('caption') || 'File uploaded';
    
    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }
    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const telegramForm = new FormData();
    telegramForm.append('chat_id', CHAT_ID);
    telegramForm.append('caption', caption);
    telegramForm.append('document', new Blob([buffer]), file.name);
    
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`, {
      method: 'POST',
      body: telegramForm
    });
    
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}