/**
 * 樹洞安全代理後端 (Vercel Serverless Function)
 * * 作用：
 * 1. 隱藏您的 API 金鑰，瀏覽器（前端）完全碰不到
 * 2. 在伺服器端（後端）代為呼叫 Google Gemini API，杜絕 401 與跨網域 (CORS) 阻擋錯誤
 */

export default async function handler(req, res) {
    // 限制只允許 POST 請求
    if (req.method !== 'POST') {
        return res.status(405).json({ error: '只允許 POST 安全請求。' });
    }
    
    // 從 Vercel 系統環境變數中安全地讀取金鑰
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ 
            error: '系統未偵測到環境變數 GEMINI_API_KEY。請至 Vercel 專案 Settings -> Environment Variables 設定金鑰，並重新部署 (Redeploy)。' 
        });
    }

    try {
        const { contents, systemInstruction, generationConfig } = req.body;
        
        // 使用目前對外公開、最快且最穩定的正式生產版模型
        const model = "gemini-2.5-flash"; 
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        // 在伺服器端背後發送請求給 Google
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents, systemInstruction, generationConfig })
        });

        // 如果 Google 回傳錯誤，將錯誤狀態和原因安全地轉發
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("Google API 錯誤詳情:", errorData);
            return res.status(response.status).json({ 
                error: `Google API 連線失敗。狀態碼：${response.status}`,
                details: errorData 
            });
        }

        // 成功取得資料，將 AI 的回覆傳回給前端 index.html
        const data = await response.json();
        return res.status(200).json(data);

    } catch (error) {
        console.error("後端代理伺服器異常:", error);
        return res.status(500).json({ error: `後端連線異常: ${error.message}` });
    }
}
