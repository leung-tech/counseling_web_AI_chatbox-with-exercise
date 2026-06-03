export default async function handler(req, res) {
  // 從 Vercel 安全取得的 OpenAI 金鑰
  const apiKey = process.env.OPENAI_API_KEY; 

  // 如果前端傳來了聊天訊息，我們把它拿出來
  const { messages } = req.body || { messages: [] };

  try {
    // 呼叫 OpenAI 官方的 API 網址
    const response = await fetch('https://openai.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}` // 金鑰藏在這裡，別人看不到
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // 或是你原本設定的模型
        messages: messages
      })
    });

    const data = await response.json();
    res.status(200).json(data); // 把 AI 的回答傳回給你的 HTML
  } catch (error) {
    res.status(500).json({ error: 'AI 暫時無法連線' });
  }
}
