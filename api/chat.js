// Vercel 雲端無伺服器函數 (Serverless Function)
// 這段程式碼在 Vercel 雲端伺服器運行，瀏覽器完全無法讀取其內容，能 100% 保護您的 API 金鑰。

export default async function handler(req, res) {
    // 僅允許 POST 請求
    if (req.method !== 'POST') {
        return res.status(405).json({ error: '只允許 POST 安全請求' });
    }

    // 從 Vercel 後端環境變數讀取您的金鑰
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
        return res.status(500).json({ 
            error: '系統未設定 GEMINI_API_KEY。請至 Vercel 控制台設定環境變數。' 
        });
    }

    try {
        // 在伺服器端呼叫 Google Gemini API，完全不暴露金鑰給前端
        const targetUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        
        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();
        
        // 將 Google 返回的數據原封不動傳回前端
        return res.status(response.status).json(data);

    } catch (error) {
        console.error("後端代理出錯:", error);
        return res.status(500).json({ 
            error: '安全通道連線失敗：' + error.message 
        });
    }
}
