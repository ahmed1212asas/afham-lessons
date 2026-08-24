let studentData = {};

function startApp() {
    let name = document.getElementById('studentName').value;
    if (!name) return alert("اكتب اسمك");
    studentData.name = name;
    goTo('step-subject');
}

function startLesson() {
    let grade = document.getElementById('grade').value;
    let subject = document.getElementById('subject').value;
    if (!grade || !subject) return alert("اختر الصف والمادة");
    studentData.grade = grade;
    studentData.subject = subject;
    goTo('step-upload');
}

function showPreview() {
    const files = document.getElementById('images').files;
    let preview = document.getElementById('preview');
    preview.innerHTML = '';
    if (files.length > 5) return alert("الحد الأقصى 5 صور");
    for (let i = 0; i < files.length; i++) {
        let img = document.createElement('img');
        img.src = URL.createObjectURL(files[i]);
        preview.appendChild(img);
    }
}

async function analyzeLesson() {
    const resultBox = document.getElementById('aiResult');
    resultBox.innerText = "جاري التحليل...";

    // ***** ملاحظة: هذه محاكاة للتحليل ويجب ربطها بخدمة حقيقية لاحقاً *****
    // بما أن مشروعك يعاني من تعقيد جمال تك، سنجعل التحليل يعمل محلياً باستخدام مكتبات مجانية للعرض فقط
    
    setTimeout(() => {
        resultBox.innerText = `مرحباً ${studentData.name}!\n\nتم تحليل الصور بنجاح.\nالصف: ${studentData.grade}\nالمادة: ${studentData.subject}\n\n(هذه نتيجة تجريبية، سنقوم بربط الخدمة الحقيقية لاحقاً)`;
    }, 1500);
}

function goTo(stepId) {
    document.querySelectorAll('.step').forEach(el => el.classList.remove('active'));
    document.getElementById(stepId).classList.add('active');
}