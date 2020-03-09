ymaps.ready(init);

let storage = localStorage;
let feedbackArray = [];


function init(){

    // создаем макет балуна
    const BalloonLayout = ymaps.templateLayoutFactory.createClass([
        '<div class="feedback">',
            '<header class="feedback__header">',
                '<div class="feedback__geo"><img src="img/location.png" alt="location"></div>',
                '<div class="feedback__address">$[properties.address]</div>',
                '<button class="feedback__close"><img src="img/close.png" alt="close"></img></button>',
            '</header>',
            '<div class="feedback-content">',
                '<div class="feedback-list">',
                '{% if (properties.feedback.length == 0) %}',
                    '<div class="feedback__text">Отзывов пока нет...</div>',
                '{% else %}',
                    '<ul>',
                    '{% for item in properties.feedbackArray %}',
                        '<li>',
                            '<span class="feedback__name">{{ item.name|raw }}</span>',
                            '<span class="feedback__location">{{ item.location|raw }}</span>',
                            '<span class="feedback__date">{{ item.date|raw }}</span>',
                        '</li>',
                        '<li><div class="feedback__text">{{ item.feedback|raw }}</div></li>',
                    '{% end for %}',
                    '</ul>',
                '{% endif %}',
                '</div>',
                '<form class="feedback-form" action="#">',
                    '<h1 class="feedback-form__title">ВАШ ОТЗЫВ</h1>',
                    '<input type="text" class="feedback-form__input feedback-form__name" placeholder="Ваше имя">',
                    '<input type="text" class="feedback-form__input feedback-form__location" placeholder="Укажите место">',
                    '<textarea class="feedback-form__input feedback-form__text" rows="6" placeholder="Поделитесь впечатлениями"></textarea>',
                    '<button class="feedback-form__button" id="add">Добавить</button>',
                '</form>',
            '</div>',
        '</div>'].join(''), {

            build: function () {
                BalloonLayout.superclass.build.call(this);
                const addButton = document.querySelector('.feedback-form__button');
                const closeButton = document.querySelector('.feedback__close');

                addButton.addEventListener('click', () => { 
                    this.addFeedback();
                    this.addPoint();
                });
                closeButton.addEventListener('click', () => { 
                    this.onCloseClick();
                });

                let reviews = [];
                const coords = this._data.properties.coords;
                const address = this._data.properties.address;
                feedbackArray.forEach(item => {
                    if (address == item.address) {
                        reviews.push(item)
                    }
                });
                console.log(address);
                console.log(feedbackArray);
                console.log(reviews);
                reviews = [
                    {name: 111, location: 111, feedback: 111},
                    {name: 222, location: 111, feedback: 111},
                    {name: 333, location: 111, feedback: 111}
                ]
                this._data.properties.feedbackArray = reviews;
            },

            clear: function () {
                const addButton = document.querySelector('.feedback-form__button');
                const closeButton = document.querySelector('.feedback__close');

                addButton.removeEventListener('click', () => {
                    this.addFeedback();
                    this.addPoint();
                });
                closeButton.removeEventListener('click', () => {
                    this.onCloseClick();
                });
                BalloonLayout.superclass.clear.call(this);
            },

            onCloseClick: function () {
                this.events.fire('userclose');
            },

            // метод добавления отзыва
            addFeedback: function(e) {
                const feedbackName = document.querySelector('.feedback-form__name');
                const feedbackLocation = document.querySelector('.feedback-form__location');
                const feedbackText = document.querySelector('.feedback-form__text');
                const date = new Date();
                const coords = this._data.properties.coords;
                const address = this._data.properties.address;

                // валидация формы
                if (feedbackName.value == '' || feedbackLocation.value == '' || feedbackText.value == '') {
                    alert('Заполните все поля!');

                    return;
                } else {
                    // сохраняем введенные данные в LS 
                    try {
                        storage.data = JSON.stringify({
                            coords: coords,
                            address: address,
                            name: feedbackName.value,
                            location: feedbackLocation.value,
                            feedback: feedbackText.value,
                            date: date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
                        });
                    } catch (e) {
                        console.error('Не удалось сохранить данные');
                    }
                }

                // сохраняем данные с LS в переменную в json формате
                let data = JSON.parse(storage.data || '{}');

                // добавляем созданный комментарий (объект с данными о коммментарии) в массив с комментариями
                feedbackArray.push(data);

                // fggtylchild каждого отзыва

                // очищаются поля ввода
                feedbackName.value = '';
                feedbackLocation.value = '';
                feedbackText.value = '';
            }, 

            // метод добавления точки на карту
            addPoint: function(e) {
                const coords = this._data.properties.coords;
                const address = this._data.properties.address;

                feedbackArray.forEach(item => {
                    if (item == feedbackArray[feedbackArray.length - 1]) {
                        const placemark = new ymaps.Placemark(coords, {
                            coords: coords,
                            address: address,
                            feedbackArray: [
                                {
                                    name: item.name, 
                                    location: item.location,
                                    feedback: item.feedback,
                                    date: item.date
                                }],
                            preset: 'islands#orangeIcon'
                        });
                    
                        map.geoObjects.add(placemark);
                        clusterer.add(placemark);
                    }
                })
            }
        //     addPoint: function(e) {
        //         let reviews = [];
        //         const coords = this._data.properties.coords;
        //         const address = this._data.properties.address;
        //         feedbackArray.forEach(item => {
        //             if (address == item.address) {
        //                 reviews.push(item)
        //             }
        //         })
        //         console.log(reviews);

        //             const placemark = new ymaps.Placemark(coords, {
        //                 address: address,
        //                 feedbackArray: reviews
        //             }, {
        //                 preset: 'islands#orangeIcon'
        //             });
                
        //             map.geoObjects.add(placemark);
        //             clusterer.add(placemark);
        //     }
        }),

    // создание карты 
    map = new ymaps.Map("map", {
            center: [59.94, 30.32],
            zoom: 12,
            controls: ['zoomControl'],
            behaviors: ['drag']
    }, { balloonLayout: BalloonLayout});

    const clasterContentLayout = ymaps.templateLayoutFactory.createClass(`
    {% for item in properties.feedbackArray %}
    <div class="cluster">
        <div class="cluster__header">
            <div class="cluster__location">{{ item.location|raw }}</div>
            <div class="cluster__address"><a class="search_by_address">{{ item.address|raw }}</a></div>
        </div>
        <div class="cluster__feedback">{{ item.feedback|raw }}</div>
        <div class="cluster__date">{{ item.date|raw }}</div>
    </div> 
    {% end for %}
    `);

    const clusterer = new ymaps.Clusterer({
        preset: 'islands#invertedOrangeClusterIcons', // стили кластера
        clusterBalloonContentLayout: 'cluster#balloonCarousel',
        balloonLayout: 'islands#balloon', // переопределяем кастомный popup на стандартный
        clusterBalloonItemContentLayout: clasterContentLayout,
        clusterBalloonPanelMaxMapArea: 0, // не будет открываться в режиме панели
        clusterBalloonPagerSize: 5, // кол-во страниц
        groupByCoordinates: false, // если true то группирует только с одинаковыми координатами
        clusterDisableClickZoom: true, // отключаем зумирование при клике на кластер
        clusterHideIconOnBalloonOpen: false,
    });

    map.geoObjects.add(clusterer);

    // открытие балуна при нажатии на любое место карты
    map.events.add('click', function (e) {
        const coords = e.get('coords');
        const geoCoords = ymaps.geocode(coords);
        console.log('map', coords)

        geoCoords.then(function (res) {
            const firstGeoObject = res.geoObjects.get(0);
            let obj = {}

            obj.coords = coords;
            obj.address = firstGeoObject.properties.get('text');
            obj.feedback = [];
        
            map.balloon.open(coords, {
                properties: {
                    coords: obj.coords,
                    address: obj.address,
                    feedback: obj.feedback
                }
            });
        });
    });

    map.geoObjects.events.add('click', function(e) {
        const coords = e.get('coords');
        const geoCoords = ymaps.geocode(coords);
        console.log('geo', coords)

        geoCoords.then(function (res) {
            const firstGeoObject = res.geoObjects.get(0);
            let obj = {}

            obj.coords = coords;
            obj.address = firstGeoObject.properties.get('text');
            obj.feedback = [];
        
            map.balloon.open(coords, {
                properties: {
                    coords: obj.coords,
                    address: obj.address,
                    feedback: obj.feedback
                }
            });
        });
    })

    // открытие баллуна при нажатии на адрес в карусели clasterer
    // document.addEventListener('click', (e) => {
    //     let el = e.target;

    //     if (el.className === 'search_by_address') {
    //         e.preventDefault();

    //         feedbackArray.forEach(feedback => {
    //             if (el.text === feedback.address) {
    //                 map.balloon.open(feedback.coords, {
    //                     properties: {
    //                         address: feedback.address,
    //                         name: feedback.name, 
    //                         location: feedback.location,
    //                         feedback: feedback.feedback,
    //                         date: feedback.date
    //                     }
    //                 })
    //             }
    //         })
    //     }
    // })
}
