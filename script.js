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

// ================= قراءة النصوص من الصور (Tesseract.js) =================
async function analyzeLesson() {
    const resultBox = document.getElementById('aiResult');
    resultBox.innerText = "جاري قراءة النصوص من الصور...";

    if (uploadedImages.length === 0) {
        alert("الرجاء رفع صورة واحدة على الأقل");
        return;
    }

    try {
        // تهيئة المكتبة لقراءة اللغة العربية
        const worker = await Tesseract.createWorker('ara');
        
        let fullText = "";
        for (let i = 0; i < uploadedImages.length; i++) {
            const { data: { text } } = await worker.recognize(uploadedImages[i]);
            fullText += `\n--- صفحة ${i + 1} ---\n${text}`;
        }
        
        await worker.terminate();
        
        // عرض النص المستخرج
        resultBox.innerText = `تم قراءة الدرس بنجاح!\n\nالنص المستخرج:\n${fullText}`;

    } catch (error) {
        console.error(error);
        resultBox.innerText = "حدث خطأ أثناء قراءة النص. حاول مرة أخرى.";
    }
}
