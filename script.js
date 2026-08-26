// ===== إعدادات Gemini (المفتاح الصحيح AIza) =====
const GEMINI_API_KEY = "AIzaSyATGm_YbVGArLaKXCVP-pIszrM1mHA1k";

function startApp() {
    const username = document.getElementById('studentName').value;
    if (username === "") {
        alert("الرجاء إدخال اسم الطالب");
        return;
    }
    localStorage.setItem('studentName', username);
    document.getElementById('step-login').classList.remove('active');
    document.getElementById('step-subject').classList.add('active');
}

function startLesson() {
    const grade = document.getElementById('grade').value;
    const subject = document.getElementById('subject').value;
    if (grade === "" || subject === "") {
        alert("الرجاء اختيار الصف والمادة");
        return;
    }
    localStorage.setItem('selectedGrade', grade);
    localStorage.setItem('selectedSubject', subject);
    document.getElementById('step-subject').classList.remove('active');
    document.getElementById('step-upload').classList.add('active');
}

let uploadedImages = [];
const maxImages = 5;

document.getElementById('images').addEventListener('change', function(event) {
    const files = event.target.files;
    if (files.length > maxImages) {
        alert(`يمكنك رفع ${maxImages} صور فقط.`);
        return;
    }
    uploadedImages = files;
    const preview = document.getElementById('preview');
    preview.innerHTML = '';
    for (let i = 0; i < files.length; i++) {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(files[i]);
        preview.appendChild(img);
    }
});

async function analyzeLesson() {
    const resultBox = document.getElementById('aiResult');
    resultBox.innerText = "جاري تحليل الدرس بواسطة الذكاء الاصطناعي...";

    if (uploadedImages.length === 0) {
        alert("الرجاء رفع صورة واحدة على الأقل");
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const imageParts = [];
        for (let i = 0; i < uploadedImages.length; i++) {
            const dataUrl = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.readAsDataURL(uploadedImages[i]);
            });
            const base64Data = dataUrl.split(',')[1];
            imageParts.push({
                inlineData: {
                    data: base64Data,
                    mimeType: uploadedImages[i].type
                }
            });
        }

        const prompt = `أنت معلم خبير. اقرأ الصور التالية لدرس في مادة ${localStorage.getItem('selectedSubject')} للصف ${localStorage.getItem('selectedGrade')}. اشرح الدرس بشكل مبسط ومنظم، ثم قم بتوليد 5 أسئلة اختيار من متعدد لاختبار فهم الطالب. أعد النتيجة بصيغة نصية واضحة.`;
        
        const result = await model.generateContent([prompt, ...imageParts]);
        const response = await result.response;
        const text = response.text();
        resultBox.innerText = text;

    } catch (error) {
        console.error(error);
        resultBox.innerText = "حدث خطأ أثناء الاتصال بـ Gemini. تأكد من صحة المفتاح.";
    }
}
