ymaps.ready(init);

function init(){
    var map = new ymaps.Map("map", {
        center: [59.94, 30.32],
        zoom: 12,
        controls: ['zoomControl'],
        behaviors: ['drag']
    });

    geoObjects = [];
    placemarks = {};

    map.events.add('click', function (e) {
        var coords = e.get('coords');

        map.balloon.open(coords, {
            contentHeader: [
                '<div class="feedback">',
                    '<header class="feedback__header"></header>',
            ].join(''),
            contentBody: [
                    '<div class="feedback-content">',
                        '<div class="feedback-list"></div>',
                        '<form class="feedback-form" action="">',
                            '<h1 class="feedback-form__title">ВАШ ОТЗЫВ</h1>',
                            '<input type="text" class="feedback-form__input" placeholder="Ваше имя">',
                            '<input type="text" class="feedback-form__input" placeholder="Укажите место">',
                            '<textarea name="" class="feedback-form__input" id="" cols="30" rows="10" placeholder="Поделитесь впечатлениями"></textarea>',
                            '<button class="feedback-form__button" id="add">Добавить</button>',
                        '</form>',
                    '</div>',
                '</div>',
            ].join('')
        });
    });

    var addButton = document.querySelector('#add');

    addButton.events.add('click', (e) => {
        var coords = e.get('coords');

        var placemark = new ymaps.Placemark([coords[0].toPrecision(6), coords[1].toPrecision(6)], 
            {
                balloonContent: [
                                '<div class="map__balloon">',
                                '<img class="map__burger-img" src="img/burger.png" alt="Бургер" style="width: 100px; height: 100px"/>',
                                'Самые вкусные бургеры у нас!',
                                '</div>'
                            ].join('')
            });

            map.geoObjects.add(placemark);

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