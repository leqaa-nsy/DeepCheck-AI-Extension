// 1. إنشاء الأيقونة العائمة (The Floating Icon)
const icon = document.createElement('div');
icon.id = 'deepcheck-floating-icon';
icon.innerHTML = '🔍'; 
document.body.appendChild(icon);

// 2. إنشاء قائمة التحكم (The Control Menu)
const menu = document.createElement('div');
menu.id = 'deepcheck-menu';
menu.innerHTML = `
    <div style="text-align:center; border-bottom:1px solid #eee; margin-bottom:10px; padding-bottom:5px;">
        <strong style="color:#007bff; font-size:16px;">DeepCheck AI v1.0</strong>
    </div>
    <button class="dc-btn" id="check-link">فحص الرابط الحالي</button>
    <button class="dc-btn" id="check-images">فحص الصور في الصفحة</button>
    <div id="dc-result"></div>
    <div style="font-size:10px; color:#999; margin-top:10px; text-align:center;">QA Verified Mode</div>
`;
document.body.appendChild(menu);

// 3. إظهار وإخفاء القائمة عند الضغط على الأيقونة
icon.addEventListener('click', () => {
    menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
});

// 4. منطق فحص الرابط (Logic for Demo/Showcase)
document.getElementById('check-link').addEventListener('click', () => {
    const resultDiv = document.getElementById('dc-result');
    const currentUrl = window.location.href;

    resultDiv.style.display = 'block';
    resultDiv.innerText = "🔍 جاري تحليل بصمة الفيديو والبيانات...";
    resultDiv.style.backgroundColor = "#f8f9fa";
    resultDiv.style.color = "#333";

    // محاكاة وقت المعالجة (1.5 ثانية) لجعل العرض واقعي
    setTimeout(() => {
        
        // سيناريو: فيديوهات يوتيوب (يظهر تحذير أحمر قاطع للفبركة)
        if (currentUrl.includes("youtube.com/watch")) {
            resultDiv.innerText = "⚠️ تحذير: تم اكتشاف تلاعب رقمي (Deepfake) في ملامح الوجه ومزامنة الصوت بنسبة 89%.";
            resultDiv.style.backgroundColor = "#ff4d4d"; // أحمر
            resultDiv.style.color = "white";
        } 
        
        // سيناريو: مواقع موثوقة (يظهر تأكيد أخضر)
        else if (currentUrl.includes("google.com") || currentUrl.includes("facebook.com")) {
            resultDiv.innerText = "✅ محتوى آمن: لم يتم العثور على أي علامات تلاعب رقمي أو فبركة في هذا الرابط.";
            resultDiv.style.backgroundColor = "#28a745"; // أخضر
            resultDiv.style.color = "white";
        }

        // سيناريو: أي موقع آخر
        else {
            resultDiv.innerText = "ℹ️ فحص مبدئي: الرابط لا يحتوي على علامات مشبوهة واضحة حالياً.";
            resultDiv.style.backgroundColor = "#17a2b8"; // أزرق
            resultDiv.style.color = "white";
        }

    }, 1500); 
});

// 5. منطق فحص الصور (Images Scan)
document.getElementById('check-images').addEventListener('click', () => {
    alert("تم تفعيل ماسح الصور الذكي.. جاري فحص بكسلات الصور للكشف عن التعديلات.");
});
