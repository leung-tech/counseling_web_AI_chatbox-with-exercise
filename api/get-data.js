export default async function handler(req, res) {
  // 🔒 已經直接嵌入你的專屬 API Key，鎖在後端伺服器中
  const apiKey = "AQ.Ab8RN6LkigftuX2I89apftuPurWfAh_P0AU8UItbSsusMx90JQ"; 
  
  // 接收前端網頁傳來的對話紀錄
  const { contents } = req.body || { contents: [] };

  // Google Gemini 官方的 API 傳輸網址
  const apiUrl = `https://googleapis.com{apiKey}`; 

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ contents: contents })
    });
    
    const data = await response.json();
    
    // 將 AI 的回答安全地傳回給你的 HTML 網頁
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: '無法連接到 Gemini AI' });
  }
}
