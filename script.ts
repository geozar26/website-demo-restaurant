// --- TYPES & INTERFACES ---
// Ορίζουμε τη δομή των δεδομένων μας
interface PizzaItem {
    name: string;
    price: string;
    info: string;
    ingredients: string[];
    img: string;
}

// --- DATABASE ---
const pizzaData: PizzaItem[] = [
    {
        name: "Pizza Special",
        price: "10.50€",
        info: "Η πλούσια επιλογή με ζαμπόν, μπέικον, μανιτάρια και πιπεριές.",
        ingredients: ["ζαμπον", "μπεικον", "μανιταρια", "τυρι", "pepperoni"],
        img: "images/pizza.png" 
    },
    {
        name: "Pizza Margherita",
        price: "8.50€",
        info: "Απλή και κλασική με φρέσκια σάλτσα ντομάτας και μοτσαρέλα.",
        ingredients: ["ντοματα", "μοτσαρελα", "βασιλικος", "τυρι"],
        img: "images/pizza-2.png" 
    },
    {
        name: "Pizza BBQ Chicken",
        price: "11.20€",
        info: "Με καπνιστή σάλτσα BBQ, ψητό κοτόπουλο και κρεμμύδι.",
        ingredients: ["κοτοπουλο", "bbq", "κρεμμυδι", "τυρι"],
        img: "images/pizza-bbq.png" 
    },
    {
        name: "Spaghetti Carbonara",
        price: "9.00€",
        info: "Κλασική ιταλική συνταγή με κρέμα γάλακτος, μπέικον και παρμεζάνα.",
        ingredients: ["μακαρονια", "μπεικον", "κρεμα γαλακτος", "παρμεζανα"],
        img: "images/spaghetti-carbonara.png" 
    },
    {
        name: "Spaghetti Napolitana",
        price: "7.50€",
        info: "Απλή και γευστική με φρέσκια σάλτσα ντομάτας και μυρωδικά.",
        ingredients: ["μακαρονια", "ντοματα", "βασιλικος", "σκορδο"],
        img: "images/spaghetti-napolitana.png" 
    }
];

// --- APP CLASS ---
class RestaurantApp {
    private recipeModal: HTMLElement | null;

    constructor() {
        this.recipeModal = document.getElementById('recipeModal');
        this.init();
    }

    // Static μέθοδοι με ορισμένους τύπους παραμέτρων
    static setCookie(name: string, value: string, days: number): void {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/;SameSite=Lax`;
    }

    static getCookie(name: string): string | null {
        const nameEQ = `${name}=`;
        const ca = document.cookie.split(';');
        for (let c of ca) {
            let entry = c.trim();
            if (entry.startsWith(nameEQ)) return entry.substring(nameEQ.length);
        }
        return null;
    }

    init(): void {
        this.initCarousels();
        this.initLoginLogic();
        this.initGlobalEvents(); 
        this.initModalsAndOrder();
        this.initGSAP();
        this.initSearch(); 
        this.initLightbox();
        this.initScrollAnimations();
        console.log("💎 RestaurantApp: Fully Restored with TypeScript Types");
    }

    initScrollAnimations(): void {
        const handleScroll = (): void => {
            const box = document.getElementById('eventBox');
            const section = document.getElementById('events-trigger');
            const screenHeight = window.innerHeight / 1.3;

            if (box && section) {
                const position = section.getBoundingClientRect().top;
                if (position < screenHeight) {
                    box.classList.add('active');
                }
            }

            const spaceItems = document.querySelectorAll('.space-item');
            spaceItems.forEach(item => {
                const position = item.getBoundingClientRect().top;
                if (position < screenHeight) {
                    item.classList.add('active');
                }
            });
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll();
    }

    initCarousels(): void {
        const carouselSpecs = ['.todays-specials', '.gallery-section'];
        carouselSpecs.forEach(selector => {
            const el = document.querySelector(selector);
            // @ts-ignore (Υποθέτουμε ότι η κλάση Carousel ορίζεται παρακάτω)
            if (el) new Carousel(selector);
        });
    }

    initGlobalEvents(): void {
        window.addEventListener('click', (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const card = target.closest('.carousel-card, [data-dish]') as HTMLElement | null;
            
            if (card) {
                this.handleTooltip(card, e);
            } else if (!target.closest('[id^="modal-"]')) {
                this.closeAllTooltips();
            }

            if (target === this.recipeModal || target.classList.contains('modal')) {
                this.closeRecipeModal();
            }
        });
    }

    handleTooltip(card: HTMLElement, e: MouseEvent): void {
        e.stopPropagation();
        const dishId = card.getAttribute('data-dish');
        if (!dishId) return;
        
        const tooltip = document.getElementById(`modal-${dishId}`);
        if (!tooltip) return;

        const isOpen = tooltip.getAttribute('data-open') === 'true';
        this.closeAllTooltips();

        if (!isOpen) {
            tooltip.style.display = 'block';
            tooltip.setAttribute('data-open', 'true');
        }
    }

    closeAllTooltips(): void {
        document.querySelectorAll('[id^="modal-"]').forEach(t => {
            const el = t as HTMLElement;
            el.style.display = 'none';
            el.setAttribute('data-open', 'false');
        });
    }

    initLoginLogic(): void {
        const overlay = document.getElementById('loginOverlay');
        const popup = document.getElementById('loginPopup');
        const form = document.getElementById('loginForm') as HTMLFormElement | null;
        
        const hasToken = localStorage.getItem('userToken') || RestaurantApp.getCookie('userToken');
        const hideLogin = RestaurantApp.getCookie('hideLogin');
        const savedUser = localStorage.getItem('savedUser') || RestaurantApp.getCookie('savedUser');

        if (form && savedUser) {
            const input = form.querySelector('input');
            if (input) input.value = savedUser;
        }

        if (!hideLogin && !hasToken) {
            setTimeout(() => {
                if (overlay && popup) {
                    overlay.style.display = 'block';
                    popup.style.display = 'block';
                    popup.setAttribute('aria-hidden', 'false');
                    (popup.querySelector('input') as HTMLInputElement | null)?.focus();
                }
            }, 4000);
        }

        overlay?.addEventListener('click', (e: MouseEvent) => {
            if (e.target === overlay && popup) { 
                overlay.style.display = 'none';
                popup.style.display = 'none';
            }
        });

        document.getElementById('loginClose')?.addEventListener('click', () => {
            if (overlay && popup) {
                overlay.style.display = 'none';
                popup.style.display = 'none';
            }
        });

        form?.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            const input = form.querySelector('input') as HTMLInputElement;
            const val = input.value;
            const token = `auth_${Math.random().toString(36).substr(2)}`;

            localStorage.setItem('userToken', token);
            localStorage.setItem('savedUser', val);
            RestaurantApp.setCookie('userToken', token, 30);
            RestaurantApp.setCookie('savedUser', val, 30);
            RestaurantApp.setCookie('hideLogin', 'true', 30);

            if (overlay && popup) {
                overlay.style.display = 'none';
                popup.style.display = 'none';
            }
        });
    }

    initModalsAndOrder(): void {
        let currentQty: number = 1;
        const qtyValue = document.getElementById('qtyValue');
        const orderPanel = document.getElementById('orderPanel');

        document.addEventListener('click', (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const btn = target.closest('.info-btn');
            if (btn) {
                const img = btn.closest('.item')?.querySelector('.recipe-img') as HTMLImageElement | null;
                if (img) {
                    const titleEl = document.getElementById('modalTitle');
                    const imgEl = document.getElementById('modalImage') as HTMLImageElement;
                    const descEl = document.getElementById('modalDescription');

                    if (titleEl) titleEl.innerText = img.dataset.title || '';
                    if (imgEl) imgEl.src = img.src;
                    if (descEl) descEl.innerText = img.dataset.description || '';
                    
                    if (this.recipeModal) {
                        this.recipeModal.style.display = 'flex';
                        setTimeout(() => this.recipeModal?.classList.add('active'), 10);
                    }
                    
                    currentQty = 1;
                    if (qtyValue) qtyValue.innerText = currentQty.toString();
                    orderPanel?.classList.remove('active');
                }
            }
        });

        document.getElementById('recipeClose')?.addEventListener('click', () => this.closeRecipeModal());
        document.getElementById('toggleOrderBtn')?.addEventListener('click', () => orderPanel?.classList.toggle('active'));
        
        document.getElementById('qtyPlus')?.addEventListener('click', () => { 
            currentQty++; 
            if (qtyValue) qtyValue.innerText = currentQty.toString(); 
        });
        document.getElementById('qtyMinus')?.addEventListener('click', () => { 
            if (currentQty > 1) { 
                currentQty--; 
                if (qtyValue) qtyValue.innerText = currentQty.toString(); 
            } 
        });
    }

    closeRecipeModal(): void {
        this.recipeModal?.classList.remove('active');
        setTimeout(() => { if(this.recipeModal) this.recipeModal.style.display = 'none'; }, 300);
    }

    initSearch(): void {
        const searchIcon = document.getElementById('openSearch') || document.querySelector('.nav-search');
        const searchOverlay = document.getElementById('searchOverlay');
        const searchClose = document.getElementById('closeSearch') || document.getElementById('searchClose');
        const searchInput = document.getElementById('searchInput') as HTMLInputElement | null;
        const mainWrapper = document.getElementById('page-wrapper');
        const resultsPage = document.getElementById('searchResultsPage');

        if (!searchIcon || !searchOverlay) return;

        searchIcon.addEventListener('click', (e: Event) => {
            e.preventDefault();
            searchOverlay.style.display = 'flex';
            setTimeout(() => {
                searchOverlay.classList.add('active');
                searchInput?.focus();
            }, 10);
            document.body.style.overflow = 'hidden';
        });

        const closeSearch = (): void => {
            searchOverlay.classList.remove('active');
            setTimeout(() => { 
                searchOverlay.style.display = 'none'; 
                document.body.style.overflow = 'auto';
            }, 300);
        };

        searchClose?.addEventListener('click', closeSearch);
        
        searchOverlay.addEventListener('click', (e: MouseEvent) => {
            if (e.target === searchOverlay) closeSearch();
        });

        document.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.key === "Escape" && searchOverlay.classList.contains('active')) closeSearch();
        });
        
        searchInput?.addEventListener('keypress', (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const query = searchInput.value.toLowerCase().trim();
                if (!query) return;

                const results = pizzaData.filter(pizza => 
                    pizza.name.toLowerCase().includes(query) || 
                    pizza.ingredients.some(ing => ing.includes(query))
                );

                closeSearch();

                if (mainWrapper && resultsPage) {
                    mainWrapper.style.display = 'none'; 
                    resultsPage.classList.add('active');
                    resultsPage.style.display = 'flex';
                    resultsPage.style.flexDirection = 'column'; 

                    const grid = document.getElementById('pizzasGrid');
                    const title = document.getElementById('searchTitle');
                    if(grid) grid.innerHTML = ''; 

                    if (results.length > 0) {
                        if(title) title.innerHTML = `<h1 class="search-results-title" style="text-align:center; padding: 40px 0;">Αποτελέσματα για "${query}"</h1>`;
                        
                        results.forEach(item => {
                            if(grid) grid.innerHTML += `
                                <div class="search-card">
                                    <img src="${item.img}" alt="${item.name}">
                                    <div class="card-body" style="padding:15px;">
                                        <div style="display:flex; align-items:baseline; gap:5px; margin-bottom:10px;">
                                            <h2 style="margin:0; font-size:1.4rem;">${item.name}</h2>
                                            <span style="font-weight:bold; color:#e67e22; font-size:1.1rem; white-space:nowrap;">${item.price}</span>
                                        </div>
                                        <p style="font-size:0.9rem; color:#555; margin-bottom:20px;">${item.info}</p>
                                        <button class="order-btn" style="width:100%; display:flex; align-items:center; justify-content:center; gap:8px;">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                                            ΠΑΡΑΓΓΕΛΙΑ
                                        </button>
                                    </div>
                                </div>`;
                        });

                        grid?.insertAdjacentHTML('afterend', `
                            <div class="back-btn-container" style="text-align:center; margin: 80px 0 100px 0; width:100%;">
                                <button onclick="location.reload()" class="order-btn" style="background:#888; padding: 12px 50px; border-radius: 30px; border:none; color:white; cursor:pointer;">
                                    ΕΠΙΣΤΡΟΦΗ ΣΤΗΝ ΑΡΧΙΚΗ
                                </button>
                            </div>
                        `);

                    } else {
                        if(title) title.innerHTML = `<h1 class="search-results-title" style="text-align:center; padding: 40px 0;">Δεν βρέθηκε κάτι για "${query}"...</h1>`;
                        if(grid) grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; margin-top:50px;">
                            <button onclick="location.reload()" class="order-btn" style="background:#888;">Πίσω στην αρχική</button>
                        </div>`;
                    }
                    window.scrollTo(0, 0);
                }
            }
        });
    }

    initGSAP(): void {
        // @ts-ignore (Η βιβλιοθήκη gsap φορτώνεται εξωτερικά)
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
        // @ts-ignore
        gsap.registerPlugin(ScrollTrigger);
        // @ts-ignore
        gsap.from('.items .item', { scrollTrigger: { trigger: '.items', start: 'top 90%' }, opacity: 0, y: 15, duration: 0.4, stagger: 0.1, ease: 'power2.out' });
        // @ts-ignore
        gsap.from('.testimonial-card', { scrollTrigger: { trigger: '.testimonials-section', start: 'top 90%' }, opacity: 0, y: 15, duration: 0.3, stagger: 0.1, ease: 'power1.out' });
        // @ts-ignore
        gsap.from('.gallery-container .box', { scrollTrigger: { trigger: '.gallery', start: 'top 90%' }, opacity: 0, y: 15, duration: 0.4, stagger: 0.08, ease: 'power2.out' });
    }

    initLightbox(): void {
        // @ts-ignore (Η βιβλιοθήκη GLightbox φορτώνεται εξωτερικά)
        if (typeof GLightbox !== 'undefined') {
            // @ts-ignore
            GLightbox({ selector: '.glightbox', touchNavigation: true, loop: true, autoplayVideos: true });
        }
    }
}

// --- CAROUSEL CLASS (TS VERSION) ---
class Carousel {
    private section: HTMLElement | null;
    private track: HTMLElement | null = null;
    private container: HTMLElement | null = null;
    private dotsContainer: HTMLElement | null = null;
    private cards: HTMLElement[] = [];
    private currentSlide: number = 0;
    private cardWidth: number = 300;
    private gap: number = 30;
    private slideDistance: number = 330;

    constructor(selector: string) {
        this.section = document.querySelector(selector);
        if (!this.section) return;

        this.track = this.section.querySelector('.carousel-track');
        this.container = this.section.querySelector('.carousel-container');
        this.dotsContainer = this.section.querySelector('.carousel-dots');
        
        if (this.track) {
            this.cards = Array.from(this.track.children) as HTMLElement[];
        }
        
        this.init();
    }

    init(): void {
        if (!this.track) return;
        this.track.style.display = 'flex';
        this.track.style.flexWrap = 'nowrap';
        this.track.style.visibility = 'hidden';
        this.track.style.opacity = '0';

        this.checkImagesLoaded();
        this.bindEvents();
    }

    checkImagesLoaded(): void {
        if (!this.track) return;
        const images = this.track.querySelectorAll('img');
        let loaded = 0;
        
        const reveal = (): void => {
            this.updateDimensions();
            this.createDots();
            this.moveToSlide(0);
            requestAnimationFrame(() => {
                if (this.track) {
                    this.track.style.visibility = 'visible';
                    this.track.style.opacity = '1';
                    this.track.style.transition = 'opacity 0.4s ease';
                }
            });
        };

        if (images.length === 0) reveal();
        else {
            images.forEach(img => {
                if (img.complete) { if (++loaded === images.length) reveal(); }
                else { img.addEventListener('load', () => { if (++loaded === images.length) reveal(); }); }
            });
        }
    }

    updateDimensions(): void {
        if (!this.container || !this.track) return;
        const w = this.container.offsetWidth;
        
        if (w < 360) {
            this.cardWidth = w - 20;
            this.gap = 20;
        } else {
            this.cardWidth = 300;
            this.gap = 30;
        }

        this.slideDistance = this.cardWidth + this.gap;
        this.track.style.gap = `${this.gap}px`;

        this.cards.forEach(card => {
            card.style.flex = `0 0 ${this.cardWidth}px`;
            card.style.width = `${this.cardWidth}px`;
            const img = card.querySelector('img');
            if (img) {
                img.style.width = '100%';
                img.style.height = '160px';
                img.style.objectFit = 'cover';
            }
        });
    }

    moveToSlide(index: number): void {
        if (!this.track || !this.container) return;
        const maxTranslate = Math.max(0, this.track.scrollWidth - this.container.offsetWidth);
        const maxSteps = maxTranslate <= 0 ? 0 : Math.ceil(maxTranslate / this.slideDistance);

        this.currentSlide = Math.max(0, Math.min(index, maxSteps));
        const translate = Math.min(this.currentSlide * this.slideDistance, maxTranslate);

        this.track.style.transition = 'transform 0.5s ease-out';
        this.track.style.transform = `translateX(-${translate}px)`;
        this.updateDots();
    }

    createDots(): void {
        if (!this.dotsContainer || !this.track || !this.container) return;
        this.dotsContainer.innerHTML = '';
        const maxTranslate = Math.max(0, this.track.scrollWidth - this.container.offsetWidth);
        const steps = maxTranslate <= 0 ? 0 : Math.ceil(maxTranslate / this.slideDistance);

        for (let i = 0; i <= steps; i++) {
            const dot = document.createElement('span');
            dot.className = `dot ${i === this.currentSlide ? 'active' : ''}`;
            dot.addEventListener('click', (e: MouseEvent) => { 
                e.stopPropagation(); 
                this.moveToSlide(i); 
            });
            this.dotsContainer.appendChild(dot);
        }
    }

    updateDots(): void {
        this.dotsContainer?.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === this.currentSlide));
    }

    bindEvents(): void {
        if (!this.container) return;
        let startX = 0;
        this.container.addEventListener('touchstart', (e: TouchEvent) => startX = e.touches[0].clientX, { passive: true });
        this.container.addEventListener('touchend', (e: TouchEvent) => {
            const dx = startX - e.changedTouches[0].clientX;
            if (Math.abs(dx) > 50) dx > 0 ? this.moveToSlide(this.currentSlide + 1) : this.moveToSlide(this.currentSlide - 1);
        }, { passive: true });

        window.addEventListener('resize', () => {
            this.updateDimensions();
            this.createDots();
            this.moveToSlide(this.currentSlide);
        });
    }
}

// --- BOOTSTRAP ---
document.addEventListener('DOMContentLoaded', () => {
    new RestaurantApp();
});