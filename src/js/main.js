ymaps.ready(init);

let storage = localStorage;
let feedbackArray = [];
let placemarks = new Set();


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
                            '<span class="feedback__name">{{ properties.name|raw }}</span>',
                            '<span class="feedback__location">{{ properties.location|raw }}</span>',
                            '<span class="feedback__date">{{ properties.date|raw }}</span>',
                        '</li>',
                        '<li><div class="feedback__text">{{ properties.feedback|raw }}</div></li>',
                        '{% end for %}',
                    '</ul>',
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
                })
            },

            clear: function () {
                const addButton = document.querySelector('.feedback-form__button');
                const closeButton = document.querySelector('.feedback__close');

                addButton.removeEventListener('click', () => {
                    this.addFeedback();
                });
                closeButton.removeEventListener('click', () => {
                    this.onCloseClick();
                });
                BalloonLayout.superclass.clear.call(this);
            },

            onCloseClick: function () {
                this.events.fire('userclose');
            },

            addFeedback: function(e) {
                const feedbackName = document.querySelector('.feedback-form__name');
                const feedbackLocation = document.querySelector('.feedback-form__location');
                const feedbackText = document.querySelector('.feedback-form__text');
                const name = document.querySelector('.feedback__name');
                const location = document.querySelector('.feedback__location');
                const text = document.querySelector('.feedback__text');
                const time = document.querySelector('.feedback__date');
                const date = new Date();
                const coords = this._data.properties.coords;
                const address = this._data.properties.address;

                // сохраняем введенные данные в LS 
                if (feedbackName.value == '' || feedbackLocation.value == '' || feedbackText.value == '') {
                    console.error('Заполните все поля!');

                    return;
                } else {
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

                name.innerHTML = data.name;
                location.innerHTML = data.location;
                text.innerHTML = data.feedback;
                time.innerHTML = data.date;

                // очищаются поля ввода
                feedbackName.value = '';
                feedbackLocation.value = '';
                feedbackText.value = '';
            }, 

            addPoint: function(e) {
                feedbackArray.forEach(item => {
                    if (item == feedbackArray[feedbackArray.length - 1]) {
                        const placemark = new ymaps.Placemark(item.coords, {
                            coords: item.coords,
                            address: item.address,
                            name: item.name, 
                            location: item.location,
                            feedback: item.feedback,
                            date: item.date
                            
                        }, {
                            preset: 'islands#orangeIcon'
                        });
                    
                        placemarks.add(placemark);
                        map.geoObjects.add(placemark);
                        clusterer.add(placemark);
                    }
                })
            }
        }),

    map = new ymaps.Map("map", {
            center: [59.94, 30.32],
            zoom: 12,
            controls: ['zoomControl'],
            behaviors: ['drag']
    }, { balloonLayout: BalloonLayout});

    const clasterContentLayout = ymaps.templateLayoutFactory.createClass(`
    <div class="cluster">
    <div class="cluster__header">
    <div class="cluster__location">{{ properties.location|raw }}</div>
    <div class="cluster__address"><a class="search_by_address">{{ properties.address|raw }}</a></div>
    </div>
    <div class="cluster__feedback">{{ properties.feedback|raw }}</div>
    <div class="cluster__date">{{ properties.date|raw }}</div>
    </div>
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

    map.events.add('click', function (e) {
        const coords = e.get('coords');
        const geoCoords = ymaps.geocode(coords);

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
                    location: "Отзывов пока нет..."
                }
            });
        });
    });

    document.addEventListener('click', (e) => {
        let el = e.target;

        if (el.className === 'search_by_address') {
            e.preventDefault();

            feedbackArray.forEach(feedback => {
                if (el.text === feedback.address) {
                    // ymaps.geoQuery(placemarks)
                    //     .searchIntersect(map)
                    //     .each(function(pm) {
                    //         console.log(pm);
                    //     })
                    map.ballon.open(feedback.coords, {})
                }
            })
        }

    })
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