ymaps.ready(init);

let placemarks = [
    {
        "coords": [55.758354480999806, 37.606096878051744],
        "address": "Some address 1",
        "feedback": "Text review 1"
    },
    {
        "coords": [55.76212939165674, 37.60558189392088],
        "address": "Some address 2",
        "feedback": "Text review 2"
    },
    {
        "coords": [55.7606775463713, 37.599573745727525],
        "address": "Some address 3",
        "feedback": "Text review 3"
    },
    {
        "coords": [55.762613328021914, 37.59974540710447],
        "address": "Some address 4",
        "feedback": "Text review 4"
    },
    {
        "coords": [55.77509680112331, 37.641115798950175],
        "address": "Some address 5",
        "feedback": "Text review 5"
    },
    {
        "coords": [55.7889303785291, 37.60506690979002],
        "address": "Some address 6",
        "feedback": "Text review 6"
    },
    {
        "coords": [55.7739357171593, 37.69021095275878],
        "address": "Some address 7",
        "feedback": "Text review 7"
    }
];


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
                    '<ul>{% fir item in properties.feedback %}',
                        '<li>',
                            '<div class="feedback__name">$[item.name]</div>',
                            '<div class="feedback__location">$[item.address]</div>',
                        '</li>',
                        '<li><div class="feedback__text">$[item.text]</div></li>',
                        '{% end for %}',
                    '</ul>',
                '</div>',
                '<form class="feedback-form" action="#">',
                    '<h1 class="feedback-form__title">ВАШ ОТЗЫВ</h1>',
                    '<input type="text" class="feedback-form__input" placeholder="Ваше имя">',
                    '<input type="text" class="feedback-form__input" placeholder="Укажите место">',
                    '<textarea class="feedback-form__input" rows="6" placeholder="Поделитесь впечатлениями"></textarea>',
                    '<button class="feedback-form__button" id="add">Добавить</button>',
                '</form>',
            '</div>',
        '</div>'].join(''), {

            build: function () {
                BalloonLayout.superclass.build.call(this);
                // const addButton = document.querySelector('.feedback-form__button');
                const closeButton = document.querySelector('.feedback__close');

                // addButton.addEventListener('click', () => { 
                //     this.addFeedback();
                // });
                closeButton.addEventListener('click', () => { 
                    this.onCloseClick();
                })
            },

            clear: function () {
                // const addButton = document.querySelector('.feedback-form__button');
                const closeButton = document.querySelector('.feedback__close');

                // addButton.removeEventListener('click', () => {
                //     this.addFeedback()
                // });
                closeButton.removeEventListener('click', () => {
                    this.onCloseClick();
                });
                BalloonLayout.superclass.clear.call(this);
            },

            onCloseClick: function () {
                this.events.fire('userclose');
            },

            // addFeedback: function (e) {
            //     const coords = e.get('coords');
            //     const placemark = new ymaps.Placemark([59.94, 30.32], {
            //         address: 'Some address point',
            //         feedbacks: [
            //             { name: 'Name 1', text: 'Text 1' },
            //             { name: 'Name 2', text: 'Text 2' },
            //             { name: 'Name 3', text: 'Text 3' }
            //         ]
            //     });
            
            //     map.geoObjects.add(placemark);
            // }
        }),

    map = new ymaps.Map("map", {
            center: [59.94, 30.32],
            zoom: 12,
            controls: ['zoomControl'],
            behaviors: ['drag']
    }, { balloonLayout: BalloonLayout});

    const clasterContentLayout = ymaps.templateLayoutFactory.createClass(`
    <div class="cluster__header">Заголовок</div>
    <div class="cluster__link"><a class="search_by_address">{{ properties.address|raw }}</a></div>
    <div class=cluster__review>{{ properties.review|raw }}</div>`);

    const clusterer = new ymaps.Clusterer({
        preset: 'islands#invertedVioletClusterIcons', // стили кластера
        clusterBalloonContentLayout: 'cluster#balloonCarousel',
        balloonLayout: 'islands#balloon', // переопределяем кастомный popup на стандартный
        clusterBalloonItemContentLayout: clasterContentLayout,
        clusterBalloonPanelMaxMapArea: 0, // не будет открываться в режиме панели
        clusterBalloonPagerSize: 5, // кол-во страниц
        groupByCoordinates: false, // если true то группирует только с одинаковыми координатами
        clusterDisableClickZoom: true, // отключаем зумирование при клике на кластер
        clusterHideIconOnBalloonOpen: false,
    });

    placemarks.forEach(item => {
        const point = new ymaps.Placemark(item.coords, {
            address: item.address,
            review: item.feedback,
        }, {
            preset: 'islands#violetIcon'
        });

        clusterer.add(point);
    });

    map.geoObjects.add(clusterer);

    map.events.add('click', function (e) {
        const coords = e.get('coords');
        const geoCoords = ymaps.geocode(coords);
        const position = e.get('position');

        geoCoords.then(function (res) {
            const firstGeoObject = res.geoObjects.get(0);
            let obj = {}

            obj.coords = coords;
            obj.address = firstGeoObject.properties.get('text');
            obj.feedback = [];
        
            map.balloon.open(coords, {
                properties: {
                    address: obj.address
                }
            });
        });
    });
}

























// МАТЕРИАЛ ПО ВЕБИНАРУ 
// ymaps.ready(init);

// var placemarks = [
//     {
//         latitude: 59.97,
//         longitude: 30.31,
//         hintContent: '<div class="map__hint">улица Литераторов, дом 19</div>',
//         balloonContent: [
//             '<div class="map__balloon">',
//             '<img class="map__burger-img" src="img/burger.png" alt="Бургер" style="width: 100px; height: 100px"/>',
//             'Самые вкусные бургеры у нас!',
//             '</div>'
//         ]
//     },
//     {
//         latitude: 59.94,
//         longitude: 30.25,
//         hintContent: '<div class="map__hint">Малый проспект В О, дом 64</div>',
//         balloonContent: [
//             '<div class="map__balloon">',
//             '<img class="map__burger-img" src="img/burger.png" alt="Бургер" style="width: 100px; height: 100px"/>',
//             'Самые вкусные бкргеры!',
//             '</div>'
//         ]
//     },
//     {
//         latitude: 59.93,
//         longitude: 30.34,
//         hintContent: '<div class="map__hint">набережная реки Фонтанки, дом 56</div>',
//         balloonContent: [
//             '<div class="map__balloon">',
//             '<img class="map__burger-img" src="img/burger.png" alt="Бургер" style="width: 100px; height: 100px"/>',
//             'Самые вкусные бкргеры!',
//             '</div>'
//         ]
//     }

// ]

// geoObjects = [];

// function init(){
//     var map = new ymaps.Map("map", {
//         center: [59.94, 30.32],
//         zoom: 12,
//         controls: ['zoomControl'],
//         behaviors: ['drag']
//     });

//     for (var i = 0; i < placemarks.length; i++) {
//         // создаем метку с коорднатами
//         geoObjects[i] = new ymaps.Placemark([placemarks[i].latitude, placemarks[i].longitude], 
//             {
//                 hintContent: placemarks[i].hintContent,
//                 balloonContent: placemarks[i].balloonContent.join('')
//             },
//             {
//                 iconLayout: 'default#image',
//                 iconImageHref: 'img/sprite.png',
//                 iconImageSize: [46,57],
//                 iconImageOffset: [-23, -57],
//                 iconImageClipRect: [[415,0],[461,57]]
//             });
//     };

//     var clusterer = new ymaps.Clusterer({
//         clusterIcons: [
//             {
//                 href: 'img/burger.png',
//                 size: [70, 70],
//                 offset: [-35, -35]
//             }
//         ],
//         clusterIconContentLayout: null
//     });

//     map.geoObjects.add(clusterer);
//     clusterer.add(geoObjects)
// }