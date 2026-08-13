document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const navLinksContainer = document.getElementById('navLinks');
    const navLinks = document.querySelectorAll('.nav-links a');
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');
    const sections = document.querySelectorAll('section');
    const cvButton = document.querySelector('.cv-button');

    // prepare sections for fade-in
    sections.forEach(s => {
        s.classList.add('fade-in');
    });

    function hideAllSections() {
        sections.forEach(s => {
            s.classList.add('hidden');
            s.classList.remove('show');
        });
    }

    function showSection(id) {
        const el = document.getElementById(id);
        if (!el) return;
        el.classList.remove('hidden');
        // trigger fade-in
        setTimeout(() => el.classList.add('show'), 20);
        el.scrollIntoView({ behavior: 'smooth' });
    }

    function updateCvVisibility(target) {
        if (!cvButton) return;
        if (!target || target === 'top') {
            cvButton.classList.remove('hidden');
        } else {
            cvButton.classList.add('hidden');
        }
    }

    // Hamburger toggle (mobile)
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Close mobile menu after clicking link and handle SPA behavior
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = href.slice(1);
                if (target === 'top') {
                    hideAllSections();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    hideAllSections();
                    showSection(target);
                }
                navLinksContainer.classList.remove('active');
                if (hamburger) hamburger.classList.remove('active');
                history.replaceState(null, '', href);
                // update active link class
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                updateCvVisibility(target);
            }
        });
    });

    // Header / navbar shadow on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) navbar.classList.add('scrolled'); else navbar.classList.remove('scrolled');
        if (window.scrollY > 300) backToTop.classList.add('show'); else backToTop.classList.remove('show');
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Initial state: hide all sections, show by hash if present
    hideAllSections();
    if (location.hash && location.hash !== '#top') {
        const target = location.hash.slice(1);
        showSection(target);
        // set active link
        navLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector('.nav-links a[href="#' + target + '"]');
        if (active) active.classList.add('active');
        updateCvVisibility(target);
    } else {
        // default to Home active
        navLinks.forEach(l => l.classList.remove('active'));
        const homeLink = document.querySelector('.nav-links a[href="#top"]');
        if (homeLink) homeLink.classList.add('active');
        updateCvVisibility('top');
    }

    // handle back/forward navigation
    window.addEventListener('popstate', () => {
        const hash = location.hash || '#top';
        const target = hash.slice(1);
        hideAllSections();
        if (target !== 'top') showSection(target);
        navLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector('.nav-links a[href="#' + target + '"]');
        if (active) active.classList.add('active');
        updateCvVisibility(target);
    });
});

// Add download animation for CV button
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.cv-button');
    if (!btn) return;
    // add class to trigger CSS animation; don't block default download
    btn.classList.add('downloading');
    // spawn confetti pieces
    const colors = ['#4cc9f0','#0077b6','#90e0ef','#48cae4','#023e8a'];
    const pieces = 10;
    const rect = btn.getBoundingClientRect();
    for (let i=0;i<pieces;i++){
        const piece = document.createElement('div');
        piece.className = 'cv-confetti';
        piece.style.background = colors[Math.floor(Math.random()*colors.length)];
        // position inside the button
        const left = Math.random()* (rect.width - 10) + 5;
        piece.style.left = left + 'px';
        piece.style.right = 'auto';
        btn.appendChild(piece);
        // remove after animation
        setTimeout(() => { if (piece.parentNode) piece.parentNode.removeChild(piece); }, 950);
    }
    // remove downloading class after animation completes
    setTimeout(() => btn.classList.remove('downloading'), 1200);
});