document.addEventListener('DOMContentLoaded', () => {
    // ------------------------------------------------------------------
    // 1. NAVIGATION TOGGLE (MOBILE MENU)
    // ------------------------------------------------------------------
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const menuBars = menuToggle.querySelector('.fa-bars');
    const menuTimes = menuToggle.querySelector('.fa-times');

    menuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('open');
        menuBars.style.display = mainNav.classList.contains('open') ? 'none' : 'inline-block';
        menuTimes.style.display = mainNav.classList.contains('open') ? 'inline-block' : 'none';
        // Sprečava skrolovanje pozadine kada je meni otvoren
        document.body.style.overflow = mainNav.classList.contains('open') ? 'hidden' : 'auto';
    });

    // ------------------------------------------------------------------
    // 2. SCROLL REVEAL ANIMATION
    // ------------------------------------------------------------------
    function reveal() {
        const reveals = document.querySelectorAll('.reveal');

        for (let i = 0; i < reveals.length; i++) {
            const windowHeight = window.innerHeight;
            const elementTop = reveals[i].getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < windowHeight - elementVisible) {
                reveals[i].classList.add('active');
            }
        }
    }

    window.addEventListener('scroll', reveal);
    // Pokreni na startu da prikaže elemente na vrhu
    reveal();


    // ------------------------------------------------------------------
    // 3. LIGHTBOX FUNCTIONALITY (Galerija)
    // ------------------------------------------------------------------
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    let currentGroup = [];
    let currentIndex = 0;

    // Funkcija za otvaranje lightboxa
    function openLightbox(group, index) {
        currentGroup = group;
        currentIndex = index;
        updateLightboxContent();
        lightbox.style.display = 'block';
    }

    // Funkcija za ažuriranje sadržaja lightboxa
    function updateLightboxContent() {
        const item = currentGroup[currentIndex];
        lightboxImg.src = item.dataset.src;
        lightboxCaption.innerHTML = item.dataset.caption;
    }

    // Funkcija za zatvaranje
    lightboxClose.onclick = function() {
        lightbox.style.display = 'none';
    };

    // Zatvori klikom izvan slike
    lightbox.onclick = function(e) {
        if (e.target === lightbox) {
            lightbox.style.display = 'none';
        }
    };

    // Navigacija (Prev/Next)
    lightboxPrev.onclick = function(e) {
        e.stopPropagation(); // Sprečava zatvaranje lightboxa
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : currentGroup.length - 1;
        updateLightboxContent();
    };

    lightboxNext.onclick = function(e) {
        e.stopPropagation(); // Sprečava zatvaranje lightboxa
        currentIndex = (currentIndex < currentGroup.length - 1) ? currentIndex + 1 : 0;
        updateLightboxContent();
    };

    // Dodavanje event listenera za sve galerijske linkove
    document.querySelectorAll('.gallery-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const item = e.currentTarget.closest('.gallery-item-container');
            const groupContainer = e.currentTarget.closest('.horizontal-slider');
            const groupItems = Array.from(groupContainer.querySelectorAll('.gallery-item-container'));
            const index = groupItems.indexOf(item);
            openLightbox(groupItems, index);
        });
    });

    // ------------------------------------------------------------------
    // 4. HORIZONTAL SLIDER NAVIGATION (Novi Slider dugmići)
    // ------------------------------------------------------------------
    window.scrollSlider = function(button, direction) {
        // Pronađi roditeljski slider
        const slider = button.closest('.horizontal-slider');
        // Pronađi track koji se skroluje unutar tog slidera
        const sliderTrack = slider.querySelector('.slider-track');
        
        // Definiši korak skrolovanja (širina jedne kartice + gap)
        // Ako je na mobilnom, korak treba biti širina celog track-a
        let scrollStep = 320; // Default za desktop: ~300px slika + 20px gap

        // Proveri da li smo na mobilnom (manje od 768px, gde je širina 100%)
        if (window.innerWidth <= 768) {
             // Na mobilnom, skrolujemo za celu širinu tracka (width 100% u CSS-u)
             scrollStep = sliderTrack.offsetWidth;
        }

        if (direction === 'next') {
            sliderTrack.scrollLeft += scrollStep;
        } else if (direction === 'prev') {
            sliderTrack.scrollLeft -= scrollStep;
        }
    };
    // ------------------------------------------------------------------

});