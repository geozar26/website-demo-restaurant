import Carousel from '../components/Carousel.js';

// --- APP CLASS ---
export default class RestaurantApp {

    constructor() {
        this.recipeModal = document.getElementById('recipeModal');
        this.init();
    }

    static setCookie(name, value, days) {
        const date = new Date();

        date.setTime(
            date.getTime() + days * 24 * 60 * 60 * 1000
        );

        document.cookie =
            `${name}=${value};expires=${date.toUTCString()};path=/;SameSite=Lax`;
    }

    static getCookie(name) {
        const nameEQ = `${name}=`;
        const ca = document.cookie.split(';');

        for (const c of ca) {
            const entry = c.trim();

            if (entry.startsWith(nameEQ)) {
                return entry.substring(nameEQ.length);
            }
        }

        return null;
    }

    init() {
        this.initCarousels();
        this.initLoginLogic();
        this.initGlobalEvents();
        this.initModalsAndOrder();
        this.initSearch();
        this.initLightbox();
        this.initScrollAnimations();

        console.log(
            " RestaurantApp: Fully Restored with TypeScript Types"
        );
    }

    initScrollAnimations() {
        const handleScroll = () => {
            const box =
                document.getElementById('eventBox');

            const section =
                document.getElementById('events-trigger');

            const screenHeight =
                window.innerHeight / 1.3;

            if (box && section) {
                const position =
                    section.getBoundingClientRect().top;

                if (position < screenHeight) {
                    box.classList.add('active');
                }
            }

            const spaceItems =
                document.querySelectorAll('.space-item');

            spaceItems.forEach((item) => {
                const position =
                    item.getBoundingClientRect().top;

                if (position < screenHeight) {
                    item.classList.add('active');
                }
            });
        };

        window.addEventListener(
            'scroll',
            handleScroll
        );

        handleScroll();
    }

    initCarousels() {
        const carouselSpecs = [
            '.todays-specials',
            '.gallery-section'
        ];

        carouselSpecs.forEach((selector) => {
            const el =
                document.querySelector(selector);

            if (el) {
                new Carousel(selector);
            }
        });
    }

    initGlobalEvents() {
        window.addEventListener('click', (e) => {
            const target = e.target;

            const icon = target.closest(
                'i, svg, .info-icon, .tooltip-btn, [class*="icon"], [class*="fa-"], [class*="bi-"], .info'
            );

            if (icon) {
                const card = icon.closest(
                    '.carousel-card, [data-dish]'
                );

                if (card) {
                    this.handleTooltip(card, e);
                    return;
                }
            }

            if (!target.closest('[id^="modal-"]')) {
                this.closeAllTooltips();
            }

            if (
                target === this.recipeModal ||
                target.classList.contains('modal')
            ) {
                this.closeRecipeModal();
            }
        });
    }

    handleTooltip(card, e) {
        e.stopPropagation();

        const dishId =
            card.getAttribute('data-dish');

        if (!dishId) {
            return;
        }

        const tooltip =
            document.getElementById(
                'tooltip-' + dishId
            );

        if (tooltip) {
            const isOpen =
                tooltip.classList.contains('active');

            this.closeAllTooltips();

            if (!isOpen) {
                tooltip.classList.add('active');

                tooltip.setAttribute(
                    'data-open',
                    'true'
                );
            }
        }
    }

    closeAllTooltips() {
        const tooltips =
            document.querySelectorAll(
                '.carousel-tooltip'
            );

        tooltips.forEach((t) => {
            t.classList.remove('active');

            t.setAttribute(
                'data-open',
                'false'
            );
        });
    }

    closeAllModals() {
        document
            .querySelectorAll('[id^="modal-"]')
            .forEach((t) => {
                const el = t;

                el.style.display = 'none';

                el.setAttribute(
                    'data-open',
                    'false'
                );
            });
    }

    initLoginLogic() {
        const overlay =
            document.getElementById('loginOverlay');

        const popup =
            document.getElementById('loginPopup');

        const form =
            document.getElementById('loginForm');

        const hasToken =
            localStorage.getItem('userToken') ||
            RestaurantApp.getCookie('userToken');

        const hideLogin =
            RestaurantApp.getCookie('hideLogin');

        const savedUser =
            localStorage.getItem('savedUser') ||
            RestaurantApp.getCookie('savedUser');

        if (form && savedUser) {
            const input =
                form.querySelector('input');

            if (input) {
                input.value = savedUser;
            }
        }

        if (!hideLogin && !hasToken) {
            setTimeout(() => {
                if (overlay && popup) {
                    overlay.style.display = 'block';
                    popup.style.display = 'block';

                    popup.setAttribute(
                        'aria-hidden',
                        'false'
                    );

                    popup
                        .querySelector('input')
                        ?.focus();
                }
            }, 4000);
        }

        overlay?.addEventListener(
            'click',
            (e) => {
                if (e.target === overlay && popup) {
                    overlay.style.display = 'none';
                    popup.style.display = 'none';
                }
            }
        );

        document
            .getElementById('loginClose')
            ?.addEventListener(
                'click',
                () => {
                    if (overlay && popup) {
                        overlay.style.display = 'none';
                        popup.style.display = 'none';
                    }
                }
            );

        form?.addEventListener(
            'submit',
            (e) => {
                e.preventDefault();

                const input =
                    form.querySelector('input');

                const val = input.value;

                const token =
                    `auth_${Math.random().toString(36).substr(2)}`;

                localStorage.setItem(
                    'userToken',
                    token
                );

                localStorage.setItem(
                    'savedUser',
                    val
                );

                RestaurantApp.setCookie(
                    'userToken',
                    token,
                    30
                );

                RestaurantApp.setCookie(
                    'savedUser',
                    val,
                    30
                );

                RestaurantApp.setCookie(
                    'hideLogin',
                    'true',
                    30
                );

                if (overlay && popup) {
                    overlay.style.display = 'none';
                    popup.style.display = 'none';
                }
            }
        );
    }

    initModalsAndOrder() {
        let currentQty = 1;

        const qtyValue =
            document.getElementById('qtyValue');

        const orderPanel =
            document.getElementById('orderPanel');

        document.addEventListener(
            'click',
            (e) => {
                const target = e.target;

                const btn =
                    target.closest('.info-btn');

                if (btn) {
                    const img =
                        btn
                            .closest('.item')
                            ?.querySelector('.recipe-img');

                    if (img) {
                        const titleEl =
                            document.getElementById(
                                'modalTitle'
                            );

                        const imgEl =
                            document.getElementById(
                                'modalImage'
                            );

                        const descEl =
                            document.getElementById(
                                'modalDescription'
                            );

                        if (titleEl) {
                            titleEl.innerText =
                                img.dataset.title || '';
                        }

                        if (imgEl) {
                            imgEl.src = img.src;
                        }

                        if (descEl) {
                            descEl.innerText =
                                img.dataset.description || '';
                        }

                        if (this.recipeModal) {
                            this.recipeModal.style.display =
                                'flex';

                            setTimeout(() => {
                                this.recipeModal
                                    ?.classList
                                    .add('active');
                            }, 10);
                        }

                        currentQty = 1;

                        if (qtyValue) {
                            qtyValue.innerText =
                                currentQty.toString();
                        }

                        orderPanel
                            ?.classList
                            .remove('active');
                    }
                }
            }
        );

        document
            .getElementById('recipeClose')
            ?.addEventListener(
                'click',
                () => this.closeRecipeModal()
            );

        document
            .getElementById('toggleOrderBtn')
            ?.addEventListener(
                'click',
                () =>
                    orderPanel?.classList.toggle('active')
            );

        document
            .getElementById('qtyPlus')
            ?.addEventListener(
                'click',
                () => {
                    currentQty++;

                    if (qtyValue) {
                        qtyValue.innerText =
                            currentQty.toString();
                    }
                }
            );

        document
            .getElementById('qtyMinus')
            ?.addEventListener(
                'click',
                () => {
                    if (currentQty > 1) {
                        currentQty--;

                        if (qtyValue) {
                            qtyValue.innerText =
                                currentQty.toString();
                        }
                    }
                }
            );
    }

    closeRecipeModal() {
        this.recipeModal
            ?.classList
            .remove('active');

        setTimeout(() => {
            if (this.recipeModal) {
                this.recipeModal.style.display =
                    'none';
            }
        }, 300);
    }

    initSearch() {
        const searchIcon =
            document.getElementById('openSearch') ||
            document.querySelector('.nav-search');

        const searchOverlay =
            document.getElementById('searchOverlay');

        const searchClose =
            document.getElementById('closeSearch') ||
            document.getElementById('searchClose');

        const searchInput =
            document.getElementById('searchInput');

        if (!searchIcon || !searchOverlay) {
            return;
        }

        searchIcon.addEventListener(
            'click',
            (e) => {
                e.preventDefault();

                searchOverlay.style.display = 'flex';

                setTimeout(() => {
                    searchOverlay.classList.add('active');

                    searchInput?.focus();
                }, 10);

                document.body.style.overflow =
                    'hidden';
            }
        );

        const closeSearch = () => {
            searchOverlay.classList.remove('active');

            setTimeout(() => {
                searchOverlay.style.display = 'none';

                document.body.style.overflow =
                    'auto';
            }, 300);
        };

        searchClose?.addEventListener(
            'click',
            closeSearch
        );

        searchOverlay.addEventListener(
            'click',
            (e) => {
                if (e.target === searchOverlay) {
                    closeSearch();
                }
            }
        );

        document.addEventListener(
            'keydown',
            (e) => {
                if (
                    e.key === "Escape" &&
                    searchOverlay.classList.contains('active')
                ) {
                    closeSearch();
                }
            }
        );

        searchInput?.addEventListener(
            'keypress',
            (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();

                    searchInput.value = '';

                    closeSearch();
                }
            }
        );
    }

    initLightbox() {
        if (typeof GLightbox !== 'undefined') {
            GLightbox({
                selector: '.glightbox',
                touchNavigation: true,
                loop: true,
                autoplayVideos: true
            });
        }
    }
}