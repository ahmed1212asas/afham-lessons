// api/index.js
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { images, prompt } = req.body;
        if (!images || images.length === 0) {
            return res.status(400).json({ error: 'No images provided' });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const finalPrompt = prompt || "أنت معلم خبير. اقرأ الصور التالية لدرس في مادة " + (req.body.subject || "") + " للصف " + (req.body.grade || "") + ". اشرح الدرس بشكل مبسط ومنظم، ثم قم بتوليد 5 أسئلة اختيار من متعدد لاختبار فهم الطالب. أعد النتيجة بصيغة نصية واضحة.";
        
        const result = await model.generateContent([finalPrompt, ...images]);
        const text = result.response.text();

        res.status(200).json({ result: text });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: error.message });
    }
}
