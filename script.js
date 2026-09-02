// ================= إعدادات الاتصال بالخادم =================

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

// ================= تحليل الدرس (الاتصال بالخادم) =================
async function analyzeLesson() {
    const resultBox = document.getElementById('aiResult');
    resultBox.innerText = "جاري تحليل الدرس بواسطة الذكاء الاصطناعي...";

    if (uploadedImages.length === 0) {
        alert("الرجاء رفع صورة واحدة على الأقل");
        return;
    }

    try {
        const imageParts = [];
        for (let i = 0; i < uploadedImages.length; i++) {
            const dataUrl = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.readAsDataURL(uploadedImages[i]);
            });
            imageParts.push({
                inlineData: {
                    data: dataUrl.split(',')[1],
                    mimeType: uploadedImages[i].type
                }
            });
        }

        // إرسال الصور إلى الخادم الوسيط (api/analyze)
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                images: imageParts,
                subject: localStorage.getItem('selectedSubject'),
                grade: localStorage.getItem('selectedGrade')
            })
        });

        const data = await response.json();

        if (data.result) {
            resultBox.innerText = data.result;
        } else {
            resultBox.innerText = "حدث خطأ: " + (data.error || "غير معروف");
        }

    } catch (error) {
        console.error(error);
        resultBox.innerText = "حدث خطأ في الاتصال بالخادم. حاول مرة أخرى.";
    }
}
