// 1. إنشاء حاوية الإضافة
const container = document.createElement('div');
container.id = 'deepcheck-float-container';

// 2. إنشاء الأيقونة العائمة (الزرار المدور)
const floatButton = document.createElement('button');
floatButton.id = 'deepcheck-float-button';
floatButton.innerHTML = '🔍';
container.appendChild(floatButton);

// 3. إنشاء لوحة الفحص (اللي بتفتح لما نضغط على الأيقونة)
const panel = document.createElement('div');
panel.id = 'deepcheck-float-panel';
panel.innerHTML = `
    <h3>DeepCheck AI</h3>
    <button id="dc-check-video">فحص الفيديو الحالي</button>
    <button id="dc-check-page">فحص الرابط الحالي</button>
    <p id="dc-status" style="font-size:12px; color:#666; text-align:center; margin-top:10px;">جاهز...</p>
`;
container.appendChild(panel);

// 4. حقن الإضافة داخل جسم الصفحة (Body)
document.body.appendChild(container);

// 5. وظيفة إظهار/إخفاء اللوحة بالضغط على الأيقونة
floatButton.addEventListener('click', () => {
    panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
});

// 6. برمجة الأزرار داخل اللوحة (محاكاة الـ QA)
document.getElementById('dc-check-video').addEventListener('click', () => simulate('جاري تحليل الفيديو...'));
document.getElementById('dc-check-page').addEventListener('click', () => simulate('تحليل الرابط...'));

function simulate(msg) {
    const status = document.getElementById('dc-status');
    status.innerText = msg;
    status.style.color = '#ff9800'; // برتقالي أثناء الفحص
    
    setTimeout(() => {
        const score = Math.floor(Math.random() * 30) + 70;
        status.innerText = `اكتمل! المصداقية: ${score}%`;
        status.style.color = '#16a34a'; // أخضر عند الانتهاء
    }, 2000);
}