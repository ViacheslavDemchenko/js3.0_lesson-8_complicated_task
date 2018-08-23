'use strict';

window.addEventListener('DOMContentLoaded', function () {

		var tab = document.getElementsByClassName('info-header-tab'),
		    tabContent = document.getElementsByClassName('info-tabcontent'),
		    info = document.getElementsByClassName('info-header')[0];

		function hideTabContent(a) {
				for (i = a; i < tabContent.length; i++) {
						tabContent[i].classList.remove('show');
						tabContent[i].classList.add('hide');
				}
		};

		hideTabContent(1);

		function showTabcontent(b) {
				if (tabContent[b].classList.contains('hide')) {
						hideTabContent(0);
						tabContent[b].classList.remove('hide');
						tabContent[b].classList.add('show');
				}
		};

		info.addEventListener('click', function (e) {
				var target = e.target;
				if (target.className == 'info-header-tab') {
						for (var _i = 0; _i < tab.length; _i++) {
								if (target == tab[_i]) {
										showTabcontent(_i);
										break;
								}
						}
				}
		});

		var deadline = '2018-08-23 23:59:59'; //Задаем конечную дату

		//Функция расчета оставшегося времени
		function getTimeRemaining(endtime) {
				//Установка текущей даты и даты окончания акции	
				var t = Date.parse(endtime) - Date.parse(new Date()),
				    seconds = Math.floor(t / 1000 % 60),
				    minutes = Math.floor(t / 1000 / 60 % 60),
				    hours = Math.floor(t / (1000 * 60 * 60));

				//Возврат объекта данных времени
				return {
						'total': t,
						'hours': hours,
						'minutes': minutes,
						'seconds': seconds
				};
		};

		//Функция запуска таймера 
		function initializeClock(id, endtime) {
				//Задание элементов для вывода данных
				var clock = document.getElementById(id),
				    hours = clock.querySelector('.hours'),
				    minutes = clock.querySelector('.minutes'),
				    seconds = clock.querySelector('.seconds'),

				//Установка интервала работы таймера в 1 секунду
				timeInterval = setInterval(updateClock, 1000);

				//Функция таймера обратного отсчета		
				function updateClock() {
						var t = getTimeRemaining(endtime);

						//Задаем функцию для добавления 0 к числам до 9 (01, 02 и т.д.)
						function addZero(num) {
								if (num <= 9) {
										return '0' + num;
								} else return num;
						};

						//Вывод оставшегося времени 
						hours.innerHTML = addZero(t.hours);
						minutes.innerHTML = addZero(t.minutes);
						seconds.innerHTML = addZero(t.seconds);

						//Действия, выполняющиеся после завершения отсчета таймера
						if (t.total <= 0) {
								clearInterval(timeInterval);
								hours.innerHTML = '00';
								minutes.innerHTML = '00';
								seconds.innerHTML = '00';
						}
				};
				updateClock();
		};
		initializeClock('timer', deadline); //Запуск таймера по id

		//Плавная прокрутка

		//Передача в переменную всех элементов html на странице
		var elements = document.documentElement,
		    body = document.body,
		    //Передаем в переменную body
		links = document.links; //Получаем все якорные ссылки на странице

		//Функция опредления нажатой ссылки и расчета перемещения
		function calcScroll() {

				//Перебор циклом все ссылок и определение той, на которой был сделан клик
				for (var _i2 = 0; _i2 < links.length; _i2++) {
						links[_i2].onclick = function (event) {
								//Определение и округление текущего расстояния от верха документа
								var scrollTop = Math.round(body.scrollTop || elements.scrollTop);
								if (this.hash !== '') {
										//Предотвращение действия браузера по дефолту при отсутвии атрибута hash у элемента
										event.preventDefault();
										//Получение элемента, к которому ведет якорь нажатой ссылки
										var hashElement = document.getElementById(this.hash.substring(1)),

										//Задел в 80px, чтобы при прокрутке меню не закрывало заголовок секции
										hashElementTop = -80;
										//Вычисление через цикл расстояния от верха до элемента, к которому ведет нажатая ссылка
										while (hashElement.offsetParent) {
												hashElementTop += hashElement.offsetTop;
												hashElement = hashElement.offsetParent;
										}
										//Получение округленного значения расположения элемента
										hashElementTop = Math.round(hashElementTop);
										/* Функция запуска плавного перемещения (содержит аргументы: текущее растояние от верха
          документа, расстояние от верха документа к контентному блоку, к которому ведет нажатая 
          ссылка и сам контентный блок) */
										smoothScroll(scrollTop, hashElementTop, this.hash);
								}
						};
				}
		};
		calcScroll();

		var timeInterval = 1,
		    //Задаем временной интервал в 1 миллисекунду
		prevScrollTop = void 0,
		    speed = void 0;

		//Функция плавной прокрутки
		function smoothScroll(from, to, hash) {
				/* Если элемент (конечная точка движения) расположен ниже текущей точки экрана,
    то scroll ведется с верху вниз (положительное значение), если наоборот, то снизу
    вверх (отрицательное значение) */
				if (to > from) {
						speed = 10;
				} else {
						speed = -10;
				}
				//Установка интервала движения
				var move = setInterval(function () {
						//Получение и округение текущей позиции экрана
						scrollTop = Math.round(body.scrollTop || elements.scrollTop);
						//Условия прекращения или продолжения движения
						if (prevScrollTop === scrollTop || to > from && scrollTop >= to || to < from && scrollTop <= to) {
								clearInterval(move);
								//Добавление атрибута hash в url после прокрутки (добавляется к адресной строке в браузере)
								history.replaceState(history.state, document.title, location.href.replace(/#.*$/g, '') + hash);
						} else {
								body.scrollTop += speed;
								elements.scrollTop += speed;
								/* Передача текущей позиции экрана в переменную, которая при последующих перемещениях
        будет играть роль места хранения последней позиции экрана */
								prevScrollTop = scrollTop;
						}
				}, timeInterval); //Передача ранее установленного интервала перемещения
		}
});