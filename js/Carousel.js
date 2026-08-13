export default class Carousel {

    constructor(selector) {
        this.track = null;
        this.container = null;
        this.dotsContainer = null;
        this.cards = [];
        this.currentSlide = 0;
        this.cardWidth = 300;
        this.gap = 30;
        this.slideDistance = 330;

        this.section =
            document.querySelector(selector);

        if (!this.section) {
            return;
        }

        this.track =
            this.section.querySelector('.carousel-track');

        this.container =
            this.section.querySelector('.carousel-container');

        this.dotsContainer =
            this.section.querySelector('.carousel-dots');

        if (this.track) {
            this.cards =
                Array.from(this.track.children);
        }

        this.init();
    }

    init() {
        if (!this.track) {
            return;
        }

        this.track.style.display = 'flex';
        this.track.style.flexWrap = 'nowrap';
        this.track.style.visibility = 'hidden';
        this.track.style.opacity = '0';

        this.checkImagesLoaded();
        this.bindEvents();
    }

    checkImagesLoaded() {
        if (!this.track) {
            return;
        }

        const images =
            this.track.querySelectorAll('img');

        let loaded = 0;

        const reveal = () => {
            this.updateDimensions();
            this.createDots();
            this.moveToSlide(0);

            requestAnimationFrame(() => {
                if (this.track) {
                    this.track.style.visibility =
                        'visible';

                    this.track.style.opacity =
                        '1';

                    this.track.style.transition =
                        'opacity 0.4s ease';
                }
            });
        };

        if (images.length === 0) {
            reveal();
        } else {
            images.forEach((img) => {

                if (img.complete) {
                    if (++loaded === images.length) {
                        reveal();
                    }
                } else {
                    img.addEventListener(
                        'load',
                        () => {
                            if (++loaded === images.length) {
                                reveal();
                            }
                        }
                    );
                }
            });
        }
    }

    updateDimensions() {
        if (!this.container || !this.track) {
            return;
        }

        const w =
            this.container.offsetWidth;

        if (w < 360) {
            this.cardWidth = w - 20;
            this.gap = 20;
        } else {
            this.cardWidth = 300;
            this.gap = 30;
        }

        this.slideDistance =
            this.cardWidth + this.gap;

        this.track.style.gap =
            `${this.gap}px`;

        this.cards.forEach((card) => {
            card.style.flex =
                `0 0 ${this.cardWidth}px`;

            card.style.width =
                `${this.cardWidth}px`;

            const img =
                card.querySelector('img');

            if (img) {
                img.style.width = '100%';
                img.style.height = '160px';
                img.style.objectFit = 'cover';
            }
        });
    }

    moveToSlide(index) {
        if (!this.track || !this.container) {
            return;
        }

        const maxTranslate =
            Math.max(
                0,
                this.track.scrollWidth -
                this.container.offsetWidth
            );

        const maxSteps =
            maxTranslate <= 0
                ? 0
                : Math.ceil(
                    maxTranslate /
                    this.slideDistance
                );

        this.currentSlide =
            Math.max(
                0,
                Math.min(index, maxSteps)
            );

        const translate =
            Math.min(
                this.currentSlide *
                this.slideDistance,
                maxTranslate
            );

        this.track.style.transition =
            'transform 0.5s ease-out';

        this.track.style.transform =
            `translateX(-${translate}px)`;

        this.updateDots();
    }

    createDots() {
        if (
            !this.dotsContainer ||
            !this.track ||
            !this.container
        ) {
            return;
        }

        this.dotsContainer.innerHTML = '';

        const maxTranslate =
            Math.max(
                0,
                this.track.scrollWidth -
                this.container.offsetWidth
            );

        const steps =
            maxTranslate <= 0
                ? 0
                : Math.ceil(
                    maxTranslate /
                    this.slideDistance
                );

        for (let i = 0; i <= steps; i++) {

            const dot =
                document.createElement('span');

            dot.className =
                `dot ${
                    i === this.currentSlide
                        ? 'active'
                        : ''
                }`;

            dot.addEventListener(
                'click',
                (e) => {
                    e.stopPropagation();
                    this.moveToSlide(i);
                }
            );

            this.dotsContainer.appendChild(dot);
        }
    }

    updateDots() {
        this.dotsContainer
            ?.querySelectorAll('.dot')
            .forEach((d, i) => {
                d.classList.toggle(
                    'active',
                    i === this.currentSlide
                );
            });
    }

    bindEvents() {
        if (!this.container) {
            return;
        }

        let startX = 0;

        this.container.addEventListener(
            'touchstart',
            (e) => {
                startX =
                    e.touches[0].clientX;
            },
            {
                passive: true
            }
        );

        this.container.addEventListener(
            'touchend',
            (e) => {
                const dx =
                    startX -
                    e.changedTouches[0].clientX;

                if (Math.abs(dx) > 50) {
                    dx > 0
                        ? this.moveToSlide(
                            this.currentSlide + 1
                        )
                        : this.moveToSlide(
                            this.currentSlide - 1
                        );
                }
            },
            {
                passive: true
            }
        );

        window.addEventListener(
            'resize',
            () => {
                this.updateDimensions();
                this.createDots();
                this.moveToSlide(
                    this.currentSlide
                );
            }
        );
    }
}