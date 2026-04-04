// البحث عن الزرار ومنطق الفحص (تعديل العرض التجريبي Demo)
document.getElementById('check-link').addEventListener('click', () => {
    const resultDiv = document.getElementById('dc-result');
    const currentUrl = window.location.href;

    resultDiv.style.display = 'block';
    resultDiv.innerText = "🔍 جاري تحليل البيانات وبصمة الفيديو...";
    resultDiv.style.backgroundColor = "#f0f0f0";
    resultDiv.style.color = "#333";

    // محاكاة وقت الفحص (ثانية ونص) عشان يبان حقيقي
    setTimeout(() => {
        
        // 1. حالة الفيديوهات المتفبركة (أي لينك يوتيوب)
        if (currentUrl.includes("youtube.com/watch")) {
            resultDiv.innerText = "⚠️ تحذير (Deepfake): تم اكتشاف تلاعب في ملامح الوجه ومزامنة الشفاه بنسبة 87%.";
            resultDiv.style.backgroundColor = "#ff4d4d"; // أحمر خطر
            resultDiv.style.color = "white";
        } 
        
        // 2. حالة الروابط السليمة (مثلاً جوجل أو فيسبوك)
        else if (currentUrl.includes("google.com") || currentUrl.includes("facebook.com")) {
            resultDiv.innerText = "✅ محتوى موثوق: لم يتم العثور على أي تلاعب رقمي في هذا الرابط.";
            resultDiv.style.backgroundColor = "#28a745"; // أخضر آمن
            resultDiv.style.color = "white";
        }

        // 3. حالة عامة لأي موقع تاني
        else {
            resultDiv.innerText = "ℹ️ الرابط قيد المراجعة.. لا توجد علامات فبركة واضحة حالياً.";
            resultDiv.style.backgroundColor = "#17a2b8"; // أزرق معلومة
            resultDiv.style.color = "white";
        }

    }, 1500); 
});
