// --- APP CLASS ---
var RestaurantApp = /** @class */ (function () {
    function RestaurantApp() {
        this.recipeModal = document.getElementById('recipeModal');
        this.init();
    }
    // Static μέθοδοι με ορισμένους τύπους παραμέτρων
    RestaurantApp.setCookie = function (name, value, days) {
        var date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = "".concat(name, "=").concat(value, ";expires=").concat(date.toUTCString(), ";path=/;SameSite=Lax");
    };
    RestaurantApp.getCookie = function (name) {
        var nameEQ = "".concat(name, "=");
        var ca = document.cookie.split(';');
        for (var _i = 0, ca_1 = ca; _i < ca_1.length; _i++) {
            var c = ca_1[_i];
            var entry = c.trim();
            if (entry.startsWith(nameEQ))
                return entry.substring(nameEQ.length);
        }
        return null;
    };
    RestaurantApp.prototype.init = function () {
        this.initCarousels();
        this.initLoginLogic();
        this.initGlobalEvents();
        this.initModalsAndOrder();
        this.initGSAP();
        this.initSearch();
        this.initLightbox();
        this.initScrollAnimations();
        console.log(" RestaurantApp: Fully Restored with TypeScript Types");
    };
    RestaurantApp.prototype.initScrollAnimations = function () {
        var handleScroll = function () {
            var box = document.getElementById('eventBox');
            var section = document.getElementById('events-trigger');
            var screenHeight = window.innerHeight / 1.3;
            if (box && section) {
                var position = section.getBoundingClientRect().top;
                if (position < screenHeight) {
                    box.classList.add('active');
                }
            }
            var spaceItems = document.querySelectorAll('.space-item');
            spaceItems.forEach(function (item) {
                var position = item.getBoundingClientRect().top;
                if (position < screenHeight) {
                    item.classList.add('active');
                }
            });
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll();
    };
    RestaurantApp.prototype.initCarousels = function () {
        var carouselSpecs = ['.todays-specials', '.gallery-section'];
        carouselSpecs.forEach(function (selector) {
            var el = document.querySelector(selector);
            // @ts-ignore (Υποθέτουμε ότι η κλάση Carousel ορίζεται παρακάτω)
            if (el)
                new Carousel(selector);
        });
    };
    RestaurantApp.prototype.initGlobalEvents = function () {
        var _this = this;
        window.addEventListener('click', function (e) {
            var target = e.target;
            
            // --- ΕΞΥΠΝΟΣ ΕΛΕΓΧΟΣ: Πιάνει i, svg, span και κάθε στοιχείο με κλάση icon, fa-, bi-, info ---
            var icon = target.closest('i, svg, .info-icon, .tooltip-btn, [class*="icon"], [class*="fa-"], [class*="bi-"], .info');
            if (icon) {
                var card = icon.closest('.carousel-card, [data-dish]');
                if (card) {
                    _this.handleTooltip(card, e);
                    return; // Σταματάει εδώ ώστε να μην κλείσει αμέσως το tooltip
                }
            }
            
            // Αν πατηθεί οτιδήποτε άλλο εκτός από το εικονίδιο (π.χ. η εικόνα), κλείνουν όλα τα tooltips
            if (!target.closest('[id^="modal-"]')) {
                _this.closeAllTooltips();
            }
            if (target === _this.recipeModal || target.classList.contains('modal')) {
                _this.closeRecipeModal();
            }
        });
    };
    RestaurantApp.prototype.handleTooltip = function (card, e) {
        e.stopPropagation();
        var dishId = card.getAttribute('data-dish');
        if (!dishId)
            return;
        var tooltip = document.getElementById('tooltip-' + dishId);
        if (tooltip) {
            var isOpen = tooltip.classList.contains('active');
            this.closeAllTooltips();
            if (!isOpen) {
                tooltip.classList.add('active');
                tooltip.setAttribute('data-open', 'true');
            }
        }
    };
    // Αυτή κλείνει τα μικρά συννεφάκια (tooltips)
    RestaurantApp.prototype.closeAllTooltips = function () {
        var tooltips = document.querySelectorAll('.carousel-tooltip');
        tooltips.forEach(function (t) {
            t.classList.remove('active');
            t.setAttribute('data-open', 'false');
        });
    };
    // Αυτή κλείνει τα μεγάλα παράθυρα (modals)
    RestaurantApp.prototype.closeAllModals = function () {
        document.querySelectorAll('[id^="modal-"]').forEach(function (t) {
            var el = t;
            el.style.display = 'none';
            el.setAttribute('data-open', 'false');
        });
    };
    RestaurantApp.prototype.initLoginLogic = function () {
        var _a;
        var overlay = document.getElementById('loginOverlay');
        var popup = document.getElementById('loginPopup');
        var form = document.getElementById('loginForm');
        var hasToken = localStorage.getItem('userToken') || RestaurantApp.getCookie('userToken');
        var hideLogin = RestaurantApp.getCookie('hideLogin');
        var savedUser = localStorage.getItem('savedUser') || RestaurantApp.getCookie('savedUser');
        if (form && savedUser) {
            var input = form.querySelector('input');
            if (input)
                input.value = savedUser;
        }
        if (!hideLogin && !hasToken) {
            setTimeout(function () {
                var _a;
                if (overlay && popup) {
                    overlay.style.display = 'block';
                    popup.style.display = 'block';
                    popup.setAttribute('aria-hidden', 'false');
                    (_a = popup.querySelector('input')) === null || _a === void 0 ? void 0 : _a.focus();
                }
            }, 4000);
        }
        overlay === null || overlay === void 0 ? void 0 : overlay.addEventListener('click', function (e) {
            if (e.target === overlay && popup) {
                overlay.style.display = 'none';
                popup.style.display = 'none';
            }
        });
        (_a = document.getElementById('loginClose')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
            if (overlay && popup) {
                overlay.style.display = 'none';
                popup.style.display = 'none';
            }
        });
        form === null || form === void 0 ? void 0 : form.addEventListener('submit', function (e) {
            e.preventDefault();
            var input = form.querySelector('input');
            var val = input.value;
            var token = "auth_".concat(Math.random().toString(36).substr(2));
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
    };
    RestaurantApp.prototype.initModalsAndOrder = function () {
        var _this = this;
        var _a, _b, _c, _d;
        var currentQty = 1;
        var qtyValue = document.getElementById('qtyValue');
        var orderPanel = document.getElementById('orderPanel');
        document.addEventListener('click', function (e) {
            var _a;
            var target = e.target;
            var btn = target.closest('.info-btn');
            if (btn) {
                var img = (_a = btn.closest('.item')) === null || _a === void 0 ? void 0 : _a.querySelector('.recipe-img');
                if (img) {
                    var titleEl = document.getElementById('modalTitle');
                    var imgEl = document.getElementById('modalImage');
                    var descEl = document.getElementById('modalDescription');
                    if (titleEl)
                        titleEl.innerText = img.dataset.title || '';
                    if (imgEl)
                        imgEl.src = img.src;
                    if (descEl)
                        descEl.innerText = img.dataset.description || '';
                    if (_this.recipeModal) {
                        _this.recipeModal.style.display = 'flex';
                        setTimeout(function () { var _a; return (_a = _this.recipeModal) === null || _a === void 0 ? void 0 : _a.classList.add('active'); }, 10);
                    }
                    currentQty = 1;
                    if (qtyValue)
                        qtyValue.innerText = currentQty.toString();
                    orderPanel === null || orderPanel === void 0 ? void 0 : orderPanel.classList.remove('active');
                }
            }
        });
        (_a = document.getElementById('recipeClose')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () { return _this.closeRecipeModal(); });
        (_b = document.getElementById('toggleOrderBtn')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', function () { return orderPanel === null || orderPanel === void 0 ? void 0 : orderPanel.classList.toggle('active'); });
        (_c = document.getElementById('qtyPlus')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', function () {
            currentQty++;
            if (qtyValue)
                qtyValue.innerText = currentQty.toString();
        });
        (_d = document.getElementById('qtyMinus')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', function () {
            if (currentQty > 1) {
                currentQty--;
                if (qtyValue)
                    qtyValue.innerText = currentQty.toString();
            }
        });
    };
    RestaurantApp.prototype.closeRecipeModal = function () {
        var _this = this;
        var _a;
        (_a = this.recipeModal) === null || _a === void 0 ? void 0 : _a.classList.remove('active');
        setTimeout(function () {
            if (_this.recipeModal)
                _this.recipeModal.style.display = 'none';
        }, 300);
    };
    RestaurantApp.prototype.initSearch = function () {
        var searchIcon = document.getElementById('openSearch') || document.querySelector('.nav-search');
        var searchOverlay = document.getElementById('searchOverlay');
        var searchClose = document.getElementById('closeSearch') || document.getElementById('searchClose');
        var searchInput = document.getElementById('searchInput');
        
        if (!searchIcon || !searchOverlay)
            return;
            
        searchIcon.addEventListener('click', function (e) {
            e.preventDefault();
            searchOverlay.style.display = 'flex';
            setTimeout(function () {
                searchOverlay.classList.add('active');
                searchInput === null || searchInput === void 0 ? void 0 : searchInput.focus();
            }, 10);
            document.body.style.overflow = 'hidden';
        });
        
        var closeSearch = function () {
            searchOverlay.classList.remove('active');
            setTimeout(function () {
                searchOverlay.style.display = 'none';
                document.body.style.overflow = 'auto';
            }, 300);
        };
        
        searchClose === null || searchClose === void 0 ? void 0 : searchClose.addEventListener('click', closeSearch);
        
        searchOverlay.addEventListener('click', function (e) {
            if (e.target === searchOverlay)
                closeSearch();
        });
        
        document.addEventListener('keydown', function (e) {
            if (e.key === "Escape" && searchOverlay.classList.contains('active'))
                closeSearch();
        });
        
        searchInput === null || searchInput === void 0 ? void 0 : searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                searchInput.value = '';
                closeSearch();
            }
        });
    };
    RestaurantApp.prototype.initGSAP = function () {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined')
            return;
        // @ts-ignore
        gsap.registerPlugin(ScrollTrigger);
        // @ts-ignore
        gsap.from('.items .item', { scrollTrigger: { trigger: '.items', start: 'top 90%' }, opacity: 0, y: 15, duration: 0.4, stagger: 0.1, ease: 'power2.out' });
        // @ts-ignore
        gsap.from('.testimonial-card', { scrollTrigger: { trigger: '.testimonials-section', start: 'top 90%' }, opacity: 0, y: 15, duration: 0.3, stagger: 0.1, ease: 'power1.out' });
        // @ts-ignore
        gsap.from('.gallery-container .box', { scrollTrigger: { trigger: '.gallery', start: 'top 90%' }, opacity: 0, y: 15, duration: 0.4, stagger: 0.08, ease: 'power2.out' });
    };
    RestaurantApp.prototype.initLightbox = function () {
        if (typeof GLightbox !== 'undefined') {
            // @ts-ignore
            GLightbox({ selector: '.glightbox', touchNavigation: true, loop: true, autoplayVideos: true });
        }
    };
    return RestaurantApp;
}());
// --- CAROUSEL CLASS (TS VERSION) ---
var Carousel = /** @class */ (function () {
    function Carousel(selector) {
        this.track = null;
        this.container = null;
        this.dotsContainer = null;
        this.cards = [];
        this.currentSlide = 0;
        this.cardWidth = 300;
        this.gap = 30;
        this.slideDistance = 330;
        this.section = document.querySelector(selector);
        if (!this.section)
            return;
        this.track = this.section.querySelector('.carousel-track');
        this.container = this.section.querySelector('.carousel-container');
        this.dotsContainer = this.section.querySelector('.carousel-dots');
        if (this.track) {
            this.cards = Array.from(this.track.children);
        }
        this.init();
    }
    Carousel.prototype.init = function () {
        if (!this.track)
            return;
        this.track.style.display = 'flex';
        this.track.style.flexWrap = 'nowrap';
        this.track.style.visibility = 'hidden';
        this.track.style.opacity = '0';
        this.checkImagesLoaded();
        this.bindEvents();
    };
    Carousel.prototype.checkImagesLoaded = function () {
        var _this = this;
        if (!this.track)
            return;
        var images = this.track.querySelectorAll('img');
        var loaded = 0;
        var reveal = function () {
            _this.updateDimensions();
            _this.createDots();
            _this.moveToSlide(0);
            requestAnimationFrame(function () {
                if (_this.track) {
                    _this.track.style.visibility = 'visible';
                    _this.track.style.opacity = '1';
                    _this.track.style.transition = 'opacity 0.4s ease';
                }
            });
        };
        if (images.length === 0)
            reveal();
        else {
            images.forEach(function (img) {
                if (img.complete) {
                    if (++loaded === images.length)
                        reveal();
                }
                else {
                    img.addEventListener('load', function () {
                        if (++loaded === images.length)
                            reveal();
                    });
                }
            });
        }
    };
    Carousel.prototype.updateDimensions = function () {
        var _this = this;
        if (!this.container || !this.track)
            return;
        var w = this.container.offsetWidth;
        if (w < 360) {
            this.cardWidth = w - 20;
            this.gap = 20;
        }
        else {
            this.cardWidth = 300;
            this.gap = 30;
        }
        this.slideDistance = this.cardWidth + this.gap;
        this.track.style.gap = "".concat(this.gap, "px");
        this.cards.forEach(function (card) {
            card.style.flex = "0 0 ".concat(_this.cardWidth, "px");
            card.style.width = "".concat(_this.cardWidth, "px");
            var img = card.querySelector('img');
            if (img) {
                img.style.width = '100%';
                img.style.height = '160px';
                img.style.objectFit = 'cover';
            }
        });
    };
    Carousel.prototype.moveToSlide = function (index) {
        if (!this.track || !this.container)
            return;
        var maxTranslate = Math.max(0, this.track.scrollWidth - this.container.offsetWidth);
        var maxSteps = maxTranslate <= 0 ? 0 : Math.ceil(maxTranslate / this.slideDistance);
        this.currentSlide = Math.max(0, Math.min(index, maxSteps));
        var translate = Math.min(this.currentSlide * this.slideDistance, maxTranslate);
        this.track.style.transition = 'transform 0.5s ease-out';
        this.track.style.transform = "translateX(-".concat(translate, "px)");
        this.updateDots();
    };
    Carousel.prototype.createDots = function () {
        var _this = this;
        if (!this.dotsContainer || !this.track || !this.container)
            return;
        this.dotsContainer.innerHTML = '';
        var maxTranslate = Math.max(0, this.track.scrollWidth - this.container.offsetWidth);
        var steps = maxTranslate <= 0 ? 0 : Math.ceil(maxTranslate / this.slideDistance);
        var _loop_1 = function (i) {
            var dot = document.createElement('span');
            dot.className = "dot ".concat(i === this_1.currentSlide ? 'active' : '');
            dot.addEventListener('click', function (e) {
                e.stopPropagation();
                _this.moveToSlide(i);
            });
            this_1.dotsContainer.appendChild(dot);
        };
        var this_1 = this;
        for (var i = 0; i <= steps; i++) {
            _loop_1(i);
        }
    };
    Carousel.prototype.updateDots = function () {
        var _this = this;
        var _a;
        (_a = this.dotsContainer) === null || _a === void 0 ? void 0 : _a.querySelectorAll('.dot').forEach(function (d, i) { return d.classList.toggle('active', i === _this.currentSlide); });
    };
    Carousel.prototype.bindEvents = function () {
        var _this = this;
        if (!this.container)
            return;
        var startX = 0;
        this.container.addEventListener('touchstart', function (e) { return startX = e.touches[0].clientX; }, { passive: true });
        this.container.addEventListener('touchend', function (e) {
            var dx = startX - e.changedTouches[0].clientX;
            if (Math.abs(dx) > 50)
                dx > 0 ? _this.moveToSlide(_this.currentSlide + 1) : _this.moveToSlide(_this.currentSlide - 1);
        }, { passive: true });
        window.addEventListener('resize', function () {
            _this.updateDimensions();
            _this.createDots();
            _this.moveToSlide(_this.currentSlide);
        });
    };
    return Carousel;
}());
// --- BOOTSTRAP ---
document.addEventListener('DOMContentLoaded', function () {
    new RestaurantApp();
});
