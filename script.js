// ===== إعدادات Gemini (مفتاح AQ الجديد) =====
const GEMINI_API_KEY = "AQ.Ab8RN6KYg8z5NgNSmIede4HiuRIkDafr9CJuFie5TRFEnkfcA";

// ================= تسجيل الدخول =================
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

// ================= اختيار الصف والمادة =================
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

// ================= شاشة رفع الصور =================
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

// ================= تحليل الدرس باستخدام Gemini API (معدل لمفاتيح AQ) =================
async function analyzeLesson() {
    const resultBox = document.getElementById('aiResult');
    resultBox.innerText = "جاري تحليل الدرس بواسطة الذكاء الاصطناعي...";

    if (uploadedImages.length === 0) {
        alert("الرجاء رفع صورة واحدة على الأقل");
        return;
    }

    try {
        // تجهيز الصور
        const imageParts = [];
        for (let i = 0; i < uploadedImages.length; i++) {
            const dataUrl = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.readAsDataURL(uploadedImages[i]);
            });
            const base64Data = dataUrl.split(',')[1];
            imageParts.push({
                inline_data: {
                    data: base64Data,
                    mime_type: uploadedImages[i].type
                }
            });
        }

        // إرسال الطلب مع استخدام Authorization: Bearer (مهم جداً لمفاتيح AQ)
        const prompt = `أنت معلم خبير. اقرأ الصور التالية لدرس في مادة ${localStorage.getItem('selectedSubject')} للصف ${localStorage.getItem('selectedGrade')}. اشرح الدرس بشكل مبسط ومنظم، ثم قم بتوليد 5 أسئلة اختيار من متعدد لاختبار فهم الطالب. أعد النتيجة بصيغة نصية واضحة.`;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${GEMINI_API_KEY}` // التعديل الحاسم هنا
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }, ...imageParts]
                    }]
                })
            }
        );

        const data = await response.json();
        let aiText = "حدث خطأ في الاتصال، حاول مرة أخرى.";
        if (data.candidates && data.candidates[0].content) {
            aiText = data.candidates[0].content.parts[0].text;
        }

        resultBox.innerText = aiText;

    } catch (error) {
        console.error(error);
        resultBox.innerText = "حدث خطأ أثناء الاتصال بـ Gemini. تأكد من صحة المفتاح.";
    }
}
