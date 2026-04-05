// متغير لتخزين الأيقونة
let currentIcon = null;

// 1. مراقبة حركة الماوس
document.addEventListener('mouseover', (e) => {
    const target = e.target;
    
    // البحث عن صورة أو حاوية فيديو في يوتيوب
    const img = target.closest('img');
    const videoContainer = target.closest('ytd-thumbnail, ytd-reel-video-renderer, .html5-main-video');

    let imageUrl = "";

    if (img && img.src && img.src.startsWith('http')) {
        imageUrl = img.src;
    } else if (videoContainer) {
        const thumbnail = videoContainer.querySelector('img');
        if (thumbnail) imageUrl = thumbnail.src;
    }

    // هنا التصليح: بننادي على showIcon اللي معرفة تحت
    if (imageUrl) {
        showIcon(e.pageX, e.pageY, imageUrl);
    }
});

// 2. دالة إظهار الأيقونة (تأكد أن الاسم مطابق لما فوق)
function showIcon(x, y, url) {
    if (!currentIcon) {
        currentIcon = document.createElement('div');
        currentIcon.className = 'deepcheck-icon';
        document.body.appendChild(currentIcon);
    }

    currentIcon.style.left = (x + 15) + 'px';
    currentIcon.style.top = (y + 15) + 'px';
    currentIcon.style.display = 'block';

    currentIcon.onclick = (event) => {
        event.stopPropagation();
        scanImage(url);
    };
}

// 3. إخفاء الأيقونة عند الابتعاد
document.addEventListener('mousemove', (e) => {
    if (currentIcon && !e.target.closest('img, ytd-thumbnail, .deepcheck-icon')) {
        currentIcon.style.display = 'none';
    }
});

// 4. دالة الفحص (تكلم سيرفر البايثون)
async function scanImage(imageUrl) {
    console.log("جاري فحص:", imageUrl);
    
    try {
        const response = await fetch('http://localhost:5000/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: imageUrl })
        });

        const data = await response.json();

        if (data.report) {
            alert("✅ نتيجة الفحص:\n\n" + data.report);
        } else {
            alert("❌ خطأ: " + (data.error || "فشل التحليل"));
        }

    } catch (err) {
        alert("⚠️ السيرفر مش شغال! افتح الـ Terminal وشغل ملف app.py");
    }
}
