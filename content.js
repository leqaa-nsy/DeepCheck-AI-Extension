// متغير لتخزين الأيقونة ومنع تكرارها
let currentIcon = null;

// 1. مراقبة حركة الماوس في الصفحة
document.addEventListener('mouseover', (e) => {
    const target = e.target;
    
    // البحث عن صورة أو حاوية فيديو (خصوصاً في يوتيوب)
    const img = target.closest('img');
    const videoContainer = target.closest('ytd-thumbnail, ytd-reel-video-renderer, .html5-main-video');

    let imageUrl = "";

    if (img && img.src && img.src.startsWith('http')) {
        imageUrl = img.src;
    } else if (videoContainer) {
        const thumbnail = videoContainer.querySelector('img');
        if (thumbnail) imageUrl = thumbnail.src;
    }

    // إذا وجدنا رابط صورة، نظهر الأيقونة
    if (imageUrl) {
        showIcon(e.pageX, e.pageY, imageUrl);
    }
});

// 2. دالة إظهار الأيقونة العائمة
function showIcon(x, y, url) {
    if (!currentIcon) {
        currentIcon = document.createElement('div');
        currentIcon.className = 'deepcheck-icon';
        document.body.appendChild(currentIcon);
    }

    // وضع الأيقونة بجانب الماوس
    currentIcon.style.left = (x + 15) + 'px';
    currentIcon.style.top = (y + 15) + 'px';
    currentIcon.style.display = 'block';

    // عند الضغط على الأيقونة يبدأ الفحص
    currentIcon.onclick = (event) => {
        event.stopPropagation();
        scanImage(url);
    };
}

// 3. إخفاء الأيقونة عند الخروج من العنصر
document.addEventListener('mousemove', (e) => {
    if (currentIcon && !e.target.closest('img, ytd-thumbnail, .deepcheck-icon')) {
        currentIcon.style.display = 'none';
    }
});

// 4. الدالة الرئيسية للفحص (تكلم سيرفر Python)
async function scanImage(imageUrl) {
    console.log("جاري فحص الرابط:", imageUrl);
    
    // إظهار تنبيه بسيط للمستخدم
    showToast("⏳ جاري الفحص والتحليل... انتظر قليلاً");

    try {
        const response = await fetch('http://localhost:5000/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: imageUrl })
        });

        const data = await response.json();

        if (data.report) {
            // عرض التقرير النهائي من Gemini
            alert("✅ نتيجة الفحص:\n\n" + data.report);
        } else if (data.error) {
            alert("❌ خطأ: " + data.error);
        }

    } catch (err) {
        console.error("خطأ في الاتصال بالسيرفر:", err);
        alert("⚠️ فشل الاتصال بالسيرفر! تأكد من تشغيل ملف Python (app.py) أولاً.");
    }
}

// دالة مساعدة لإظهار رسائل Loading
function showToast(message) {
    let toast = document.getElementById('deepcheck-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'deepcheck-toast';
        toast.style.cssText = `
            position: fixed; bottom: 20px; right: 20px;
            background: #333; color: #fff; padding: 15px;
            border-radius: 8px; z-index: 999999; direction: rtl;
        `;
        document.body.appendChild(toast);
    }
    toast.innerText = message;
    setTimeout(() => { toast.remove(); }, 4000);
}
