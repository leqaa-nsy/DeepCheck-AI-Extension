// دي الـ Function اللي بتنفذ المهمة دلوقتى
async function scanImage(imageUrl) {
    // 1. نظهر للمستخدم رسالة إنه جاري الفحص (Loading)
    const resultDiv = document.getElementById('result-display'); 
    if(resultDiv) resultDiv.innerText = "جاري الفحص والتحليل... انتظر قليلاً ⏳";

    try {
        // 2. نكلم السيرفر بتاعنا (Python) اللي شغال على بورت 5000
        const response = await fetch('http://localhost:5000/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: imageUrl })
        });

        const data = await response.json();

        // 3. نعرض النتيجة اللي رجعت (التقرير)
        if (data.report) {
            // لو عندك Popup شيك اعرض فيه، أو اكتفي بـ alert مؤقتاً
            alert("نتائج الفحص:\n\n" + data.report); 
        } else if (data.error) {
            alert("عذراً، حدث خطأ: " + data.error);
        }

    } catch (err) {
        console.error("خطأ في الاتصال بالسيرفر:", err);
        alert("تأكد من تشغيل ملف Python (app.py) أولاً!");
    }
}
