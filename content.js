let currentIcon = null;

function showFloatingIcon(x, y, url) {
    if (!currentIcon) {
        currentIcon = document.createElement('div');
        currentIcon.className = 'deepcheck-icon';
        document.body.appendChild(currentIcon);
    }
    currentIcon.style.left = (x + 15) + 'px';
    currentIcon.style.top = (y + 15) + 'px';
    currentIcon.style.display = 'block';

    currentIcon.onclick = (e) => {
        e.stopPropagation();
        scanImage(url);
    };
}

document.addEventListener('mouseover', (e) => {
    const target = e.target;
    const img = target.closest('img');
    const video = target.closest('ytd-thumbnail, ytd-reel-video-renderer, video');

    let imageUrl = "";
    if (img && img.src && img.src.startsWith('http')) {
        imageUrl = img.src;
    } else if (video) {
        const thumb = video.querySelector('img');
        if (thumb) imageUrl = thumb.src;
    }

    if (imageUrl) {
        showFloatingIcon(e.pageX, e.pageY, imageUrl);
    }
});

document.addEventListener('mousemove', (e) => {
    if (currentIcon && !e.target.closest('img, ytd-thumbnail, video, .deepcheck-icon')) {
        currentIcon.style.display = 'none';
    }
});

async function scanImage(imageUrl) {
    showToast("⏳ جاري تحليل الصورة بالذكاء الاصطناعي...");
    try {
        const response = await fetch('http://localhost:5000/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: imageUrl })
        });
        const data = await response.json();
        alert("📊 تقرير DeepCheck:\n\n" + (data.report || "حدث خطأ في التحليل"));
    } catch (err) {
        alert("⚠️ السيرفر غير متصل! تأكد من تشغيل ملف app.py أولاً.");
    }
}

function showToast(msg) {
    let t = document.getElementById('deepcheck-toast') || document.createElement('div');
    t.id = 'deepcheck-toast';
    t.innerText = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3000);
}