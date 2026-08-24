// ================= تسجيل الدخول =================
function login() {
    const username = document.getElementById('username').value;
    if (username === "") {
        alert("الرجاء إدخال اسم الطالب");
        return;
    }
    document.getElementById('login-screen').classList.remove('active');
    document.getElementById('class-screen').classList.add('active');
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
    document.getElementById('class-screen').classList.remove('active');
    document.getElementById('camera-screen').classList.add('active');
}

// ================= شاشة التصوير =================
let uploadedImages = [];
const maxImages = 5;

document.getElementById('imageInput').addEventListener('change', function(event) {
    const files = event.target.files;
    if (uploadedImages.length + files.length > maxImages) {
        alert(`يمكنك رفع 5 صور فقط. تم رفع ${uploadedImages.length} صور بالفعل.`);
        return;
    }
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
    document.getElementById('counter').innerText = `${uploadedImages.length} / ${maxImages} صور`;
});

// ================= إرسال الصور للتحليل (عبر Fetch API) =================
async function submitImages() {
    if (uploadedImages.length === 0) {
        alert("الرجاء التقاط أو رفع صورة واحدة على الأقل");
        return;
    }

    const submitBtn = document.querySelector('button[onclick="submitImages()"]');
    submitBtn.innerText = "جاري تحليل الدرس...";
    submitBtn.disabled = true;

    try {
        // تحويل الصور إلى Base64 لإرسالها
        const imagesData = [];
        for (let i = 0; i < uploadedImages.length; i++) {
            const reader = new FileReader();
            const dataUrl = await new Promise((resolve) => {
                reader.onload = (e) => resolve(e.target.result);
                reader.readAsDataURL(uploadedImages[i]);
            });
            imagesData.push(dataUrl);
        }

        // إرسال الطلب إلى خادم جمال تك (هنا نضع الرابط الأساسي الخاص بالمنصة)
        // ملاحظة: هذه خطوة تجريبية أولية، سنحتاج لتحديد رابط الـ API الدقيق من لوحة تحكم جمال تك لاحقاً
        const response = await fetch('https://api.gammal.tech/v1/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // ضع هنا المفتاح الخاص بك إذا كان متوفراً، أو سنستخدم الـ SDK الذي تم وضعه في الأعلى
            },
            body: JSON.stringify({
                images: imagesData,
                grade: localStorage.getItem('selectedGrade'),
                subject: localStorage.getItem('selectedSubject')
            })
        });

        const data = await response.json();
        
        // عرض النتيجة (سنتحدث لاحقاً عن طريقة عرض الشرح والأسئلة)
        alert("تم التحليل بنجاح! (سيتم عرض النتائج هنا لاحقاً)");
        console.log("نتيجة التحليل:", data);

        // إعادة تعيين الأزرار
        submitBtn.innerText = "التالي: تحليل الدرس";
        submitBtn.disabled = false;

    } catch (error) {
        console.error(error);
        alert("حدث خطأ أثناء الاتصال بالخادم. تأكد من نشر الموقع على الإنترنت أولاً.");
        submitBtn.innerText = "التالي: تحليل الدرس";
        submitBtn.disabled = false;
    }
}
