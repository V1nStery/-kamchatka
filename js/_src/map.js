class LazyYandexMap {
    constructor() {
        // Обновленные координаты для Владимира
        this.locationData = {
            coords: [56.133462, 40.418223], // Координаты Владимира [широта, долгота]
            name: "Стоматологическая клиника 'Наследие'",
            rating: "5,0",
            workingHours: "Ежедневно с 09:00 до 20:00",
            address: "г. Владимир, ул. Б.Московская дом 71"
        };
        
        this.mapContainer = document.getElementById('yandex-map');
        this.mapSection = document.getElementById('map-section');
        this.map = null;
        this.isLoaded = false;
        this.isReady = false;
        this.observer = null;
        
        this.init();
    }

    init() {
        this.disableMapScroll();
        this.setupIntersectionObserver();
    }

    disableMapScroll() {
        if (this.mapContainer) {
            this.mapContainer.addEventListener('wheel', (e) => {
                e.preventDefault();
            }, { passive: false });

            this.mapContainer.addEventListener('touchmove', (e) => {
                if (e.target === this.mapContainer) {
                    e.preventDefault();
                }
            }, { passive: false });
        }
    }

    setupIntersectionObserver() {
        if (!this.mapSection) return;

        const options = {
            root: null,
            rootMargin: '100px',
            threshold: 0.1
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.isLoaded) {
                    this.loadMap();
                    this.observer.unobserve(this.mapSection);
                }
            });
        }, options);

        this.observer.observe(this.mapSection);
    }

    loadMap() {
        if (this.isLoaded) return;

        const placeholder = this.mapContainer.querySelector('.map-placeholder');
        if (placeholder) {
            placeholder.style.display = 'none';
        }

        if (!window.ymaps) {
            const script = document.createElement('script');
            script.src = 'https://api-maps.yandex.ru/2.1/?apikey=default-sg-enplmreflrc8s0sj9lc1&lang=ru_RU';
            script.onload = () => {
                ymaps.ready(() => this.initMap());
            };
            document.head.appendChild(script);
        } else {
            ymaps.ready(() => this.initMap());
        }

        this.isLoaded = true;
    }

    initMap() {
        try {
            const officeCoords = this.locationData.coords;
            const isSmallScreen = window.innerWidth < 768;
            const mapCenterCoords = isSmallScreen 
                ? [officeCoords[0], officeCoords[1] + 0.000]
                : [officeCoords[0], officeCoords[1] - 0.000];

            this.map = new ymaps.Map(this.mapContainer, {
                center: mapCenterCoords,
                zoom: 16,
                controls: ['zoomControl'],
                behaviors: ['disable("scrollZoom")']
            });

            const markerLayout = this.createMarkerLayout();
            
            this.placemark = new ymaps.Placemark(officeCoords, {
                balloonContent: this.locationData.address
            }, {
                iconLayout: markerLayout,
                iconOffset: [-15, -40], // Смещение для маркера в виде запятой
                iconShape: {
                    type: 'Circle',
                    coordinates: [0, 0],
                    radius: 20
                }
            });

            this.map.geoObjects.add(this.placemark);
            this.map.controls.add('trafficControl');

            this.isReady = true;
            console.log('Яндекс.Карта успешно загружена с адресом:', this.locationData.name);

        } catch (error) {
            console.error('Ошибка при инициализации карты:', error);
        }
    }

    createMarkerLayout() {
        // Простой маркер в виде запятой без текста
        return ymaps.templateLayoutFactory.createClass(
        '<div class="custom-marker">' +
            '<div class="marker-pin"></div>' +
            '<div class="marker-tail"></div>' +
        '</div>'
    );
    }

    updateLocation(newData) {
        if (!this.isReady) {
            console.warn('Карта еще не загружена. Данные будут применены после загрузки.');
            Object.assign(this.locationData, newData);
            return;
        }

        try {
            Object.assign(this.locationData, newData);
            
            if (newData.coords) {
                this.map.setCenter(newData.coords);
                this.placemark.geometry.setCoordinates(newData.coords);
            }
            
            if (newData.name || newData.workingHours) {
                this.map.geoObjects.remove(this.placemark);
                
                const newMarkerLayout = this.createMarkerLayout();
                this.placemark = new ymaps.Placemark(
                    this.locationData.coords, 
                    {
                        balloonContent: this.locationData.address
                    }, 
                    {
                        iconLayout: newMarkerLayout,
                        iconOffset: [-12, -12],
                        iconShape: {
                            type: 'Circle',
                            coordinates: [0, 0],
                            radius: 16
                        }
                    }
                );
                
                this.map.geoObjects.add(this.placemark);
            }
            
            console.log('Данные карты обновлены:', this.locationData);
            
        } catch (error) {
            console.error('Ошибка при обновлении данных карты:', error);
        }
    }

    updateCoords(newCoords) {
        this.updateLocation({ coords: newCoords });
    }
    
    updateName(newName) {
        this.updateLocation({ name: newName });
    }
    
    updateWorkingHours(newHours) {
        this.updateLocation({ workingHours: newHours });
    }

    destroy() {
        if (this.map) {
            this.map.destroy();
            this.map = null;
        }
        if (this.observer) {
            this.observer.disconnect();
        }
        this.isLoaded = false;
        this.isReady = false;
    }
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    window.lazyMap = new LazyYandexMap();
});