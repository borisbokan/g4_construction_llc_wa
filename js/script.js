document.addEventListener('DOMContentLoaded', () => {

    // =======================================================
    // 1. SCROLL REVEAL АНИМАЦИЈА
    // =======================================================
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.15 // Елемент се појављује када је 15% видљив
    });

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));


    // =======================================================
    // 2. HAMBURGER МЕНИ
    // =======================================================
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    // Не треба нам додатна класа, користимо само 'open'
    menuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('open');
        
        // Мењање иконе (нпр. из хамбургера у X)
        const icon = menuToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    // =======================================================
    // 3. GALLERY LIGHTBOX & CAROUSEL
    // =======================================================
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    
    let currentIndex = 0;
    let images = []; 

    // Прикупи све слике у низ
    galleryItems.forEach((item, index) => {
        images.push({
            src: item.getAttribute('data-src'),
            caption: item.getAttribute('data-caption'),
            index: index
        });
    });

    // Функција за отварање LightBox-а
    function openLightbox(index) {
        currentIndex = index;
        lightbox.style.display = 'block';
        updateLightboxContent();
    }

    // Функција за ажурирање садржаја LightBox-а
    function updateLightboxContent() {
        const currentImage = images[currentIndex];
        lightboxImg.src = currentImage.src;
        lightboxCaption.textContent = currentImage.caption;
    }

    // Затварање LightBox-а
    closeBtn.onclick = function() {
        lightbox.style.display = 'none';
    };

    // Кликови на слике у мрежи
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function(e) {
            e.preventDefault(); 
            openLightbox(index);
        });
    });

    // Carousel функционалност (Претходна/Следећа)
    prevBtn.onclick = function() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateLightboxContent();
    };

    nextBtn.onclick = function() {
        currentIndex = (currentIndex + 1) % images.length;
        updateLightboxContent();
    };

    // Затварање кликом ван слике
    lightbox.onclick = function(e) {
        if (e.target === lightbox) {
            lightbox.style.display = 'none';
        }
    };
});