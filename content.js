document.addEventListener('mouseover', (e) => {
    // 1. تحديد العناصر اللي ممكن تكون فيديو أو صورة في يوتيوب
    const target = e.target;
    
    // البحث عن أقرب حاوية فيديو لو الماوس مش فوق الصورة مباشرة
    const videoContainer = target.closest('ytd-thumbnail, ytd-reel-video-renderer, .html5-main-video');
    
    let imageUrl = "";

    if (target.tagName === 'IMG') {
        imageUrl = target.src;
    } else if (videoContainer) {
        // لو الماوس فوق حاوية فيديو، بنحاول نجيب البوستر أو الثمنيل
        const img = videoContainer.querySelector('img');
        if (img) imageUrl = img.src;
    }

    // لو لقينا لينك، نظهر الأيقونة
    if (imageUrl && imageUrl.startsWith('http')) {
        showFloatingIcon(e.pageX, e.pageY, imageUrl);
    }
});
