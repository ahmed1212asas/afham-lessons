import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    const { images } = req.body;
    if (!images || images.length === 0) return res.status(400).json({ error: 'No images' });

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = "أنت معلم خبير. اقرأ الصور التالية لدرس في مادة " + (req.body.subject || "") + " للصف " + (req.body.grade || "") + ". اشرح الدرس بشكل مبسط ومنظم، ثم قم بتوليد 5 أسئلة اختيار من متعدد لاختبار فهم الطالب. أعد النتيجة بصيغة نصية واضحة.";
        
        const result = await model.generateContent([prompt, ...images]);
        
        res.status(200).json({ result: result.response.text() });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}
