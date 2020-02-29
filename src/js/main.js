ymaps.ready(init);

function init(){
    var map = new ymaps.Map("map", {
            center: [59.94, 30.32],
            zoom: 12,
            controls: ['zoomControl'],
            behaviors: ['drag']
    });

        // создаем макет балуна
        // BalloonLayout = ymaps.templateLayoutFactory.createClass(
        //         [
        //         '<div class="feedback">',
        //             '<header class="feedback__header">',
        //                 '<img src="img/location.png" alt="location">',
        //                 '<div class="feedback__address">',
        //                 '$[data.contentHeader]',
        //                 '</div>',
        //                 '<img class="close" src="img/close.png" alt="close"></img>',
        //             '</header>',
        //         '<div class="feedback-content">',
        //         '$[[options.contentLayout observeSize minWidth=379 maxWidth=379 minHeight=350]]',
        //         '</div>',
        // '</div>'].join(''), {

        //         build: function () {
        //             this.constructor.superclass.build.call(this);

        //             this._$element = $('.feedback', this.getParentElement());

        //             this.applyElementOffset();

        //             this._$element.find('.close')
        //                 .on('click', $.proxy(this.onCloseClick, this));
        //         },

        //         clear: function () {
        //             this._$element.find('.close')
        //                 .off('click');

        //             this.constructor.superclass.clear.call(this);
        //         },

        //         onCloseClick: function (e) {
        //             e.preventDefault();

        //             this.events.fire('userclose');
        //         }
        //     }),

               // создаем макет содежимого балуна
        //     BalloonContentLayout = ymaps.templateLayoutFactory.createClass( [
        //                 '<div class="feedback-list">',
        //                 '$[data.contentBody]',
        //                 '</div>',
        //                 '<form class="feedback-form" action="">',
        //                     '<h1 class="feedback-form__title">ВАШ ОТЗЫВ</h1>',
        //                     '<input type="text" class="feedback-form__input" placeholder="Ваше имя">',
        //                     '<input type="text" class="feedback-form__input" placeholder="Укажите место">',
        //                     '<textarea class="feedback-form__input" rows="6" placeholder="Поделитесь впечатлениями"></textarea>',
        //                     '<button class="feedback-form__button" id="add">Добавить</button>',
        //                 '</form>'].join('')
        //     );

    // Создание макета содержимого балуна
    BalloonContentLayout = ymaps.templateLayoutFactory.createClass( [
        '<div class="feedback">',
            '<header class="feedback__header">',
                '<img src="img/location.png" alt="">',
                '<div class="feedback__address"></div>',
                '<img src="img/close.png" alt=""></img>',
            '</header>',
            '<div class="feedback-content">',
                '<div class="feedback-list"></div>',
                '<form class="feedback-form" action="">',
                    '<h1 class="feedback-form__title">ВАШ ОТЗЫВ</h1>',
                    '<input type="text" class="feedback-form__input" placeholder="Ваше имя">',
                    '<input type="text" class="feedback-form__input" placeholder="Укажите место">',
                    '<textarea class="feedback-form__input" rows="6" placeholder="Поделитесь впечатлениями"></textarea>',
                    '<button class="feedback-form__button" id="add">Добавить</button>',
                '</form>',
            '</div>',
        '</div>'].join('')
        , {
            //Переопределяем функцию build, чтобы при создании макета начинать
            //слушать событие click на кнопке
            build: function () {
                // Сначала вызываем метод build родительского класса.
                this.constructor.superclass.build.call(this);
                // А затем выполняем дополнительные действия.
                // var button = querySelector('.feedback-form__button');
                // button.addEventListener('click', this.addFeedback)
            },

            //Аналогично переопределяем функцию clear, чтобы снять
            //прослушивание клика при удалении макета с карты.
            clear: function () {
                // Выполняем действия в обратном порядке - сначала снимаем слушателя,
                // а потом вызываем метод clear родительского класса.
                // button.removeEventListener('click', this.addFeedback);
                BalloonContentLayout.superclass.clear.call(this);
            },

            addFeedback: function () {
                console.log('add')
            }
        }
    );

    map.events.add('click', function (e) {
        var coords = e.get('coords');

        map.balloon.open(coords, {
            // contentHeader: 'Петербург', 
            // contentBody: 'Отзывы должны подгружаться сюда'
        }, 
        {
            // layout: BalloonLayout,
            contentLayout: BalloonContentLayout,
            minWidth: 379,
            minHeight: 527
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