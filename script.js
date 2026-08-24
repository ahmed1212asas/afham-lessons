// ================= تسجيل الدخول =================
function login() {
    const username = document.getElementById('username').value;
    
    if (username === "") {
        alert("الرجاء إدخال اسم الطالب");
        return;
    }

    // الانتقال لشاشة اختيار الصف والمادة
    document.getElementById('login-screen').classList.remove('active');
    document.getElementById('class-screen').classList.add('active');
    
    // تخزين اسم الطالب (سنستخدمه لاحقاً في قاعدة البيانات)
    localStorage.setItem('studentName', username);
}

// ================= اختيار الصف والمادة =================
function startLesson() {
    const grade = document.getElementById('grade-select').value;
    const subject = document.getElementById('subject-select').value;

    if (grade === "" || subject === "") {
        alert("الرجاء اختيار الصف والمادة");
        return;
    }

    localStorage.setItem('selectedGrade', grade);
    localStorage.setItem('selectedSubject', subject);

    // الانتقال لشاشة التصوير
    document.getElementById('class-screen').classList.remove('active');
    document.getElementById('camera-screen').classList.add('active');
}

// ================= شاشة التصوير =================
let uploadedImages = []; // مصفوفة لحفظ الصور
const maxImages = 5;

// عند اختيار أو التقاط الصور
document.getElementById('imageInput').addEventListener('change', function(event) {
    const files = event.target.files;

    // إذا تجاوز العدد 5، نوقف الإضافة
    if (uploadedImages.length + files.length > maxImages) {
        alert(`يمكنك رفع 5 صور فقط. تم رفع ${uploadedImages.length} صور بالفعل.`);
        return;
    }

    // إضافة الصور للمصفوفة والمعاينة
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        uploadedImages.push(file);

        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.width = '100px';
            img.style.height = '100px';
            img.style.objectFit = 'cover';
            img.style.borderRadius = '8px';
            img.style.border = '2px solid #ddd';
            document.getElementById('preview-container').appendChild(img);
        };
        reader.readAsDataURL(file);
    }

    // تحديث العداد
    document.getElementById('counter').innerText = `${uploadedImages.length} / ${maxImages} صور`;
});

// دالة إرسال الصور (ستُستخدم لاحقاً مع OCR والذكاء الاصطناعي)
function submitImages() {
    if (uploadedImages.length === 0) {
        alert("الرجاء التقاط أو رفع صورة واحدة على الأقل");
        return;
    }

    // حفظ عدد الصور في الذاكرة المحلية
    localStorage.setItem('uploadedImagesCount', uploadedImages.length);

    // هنا سننتقل لاحقاً لشاشة تحليل الدرس
    alert(`تم رفع ${uploadedImages.length} صور بنجاح!\nسيتم تحليل الدرس الآن...`);
}