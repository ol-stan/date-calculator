document.addEventListener("DOMContentLoaded", function () {

    //Локалізація flatpickr
    (function (global, factory) {
        typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
            typeof define === 'function' && define.amd ? define(['exports'], factory) :
                (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ua = {}));
    }(this, (function (exports) {
        'use strict';

        var fp = typeof window !== "undefined" && window.flatpickr !== undefined
            ? window.flatpickr
            : {
                l10ns: {},
            };
        var Ukrainian = {
            weekdays: {
                shorthand: ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
                longhand: ["Неділя", "Понеділок", "Вівторок", "Середа", "Четвер", "П'ятниця", "Субота"]
            },
            months: {
                shorthand: ["Січ", "Лют", "Бер", "Кві", "Тра", "Чер", "Лип", "Сер", "Вер", "Жов", "Лис", "Гру"],
                longhand: ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень",
                    "Вересень", "Жовтень", "Листопад", "Грудень"]
            },
            firstDayOfWeek: 1,
            ordinal: function () {
                return "";
            },
            rangeSeparator: " — ",
            weekAbbreviation: "Тиж.",
            scrollTitle: "Прокрутіть для збільшення",
            toggleTitle: "Натисніть щоб переключити",
            amPM: ["AM", "PM"],
            yearAriaLabel: "Рік",
            time_24hr: true,
        };
        fp.l10ns.ua = Ukrainian;
        var ua = fp.l10ns;

        exports.Ukrainian = Ukrainian;
        exports.default = ua;

        Object.defineProperty(exports, '__esModule', { value: true });

    })));

    //flatpickr init
    flatpickr('input[name="date"]', {
        locale: "ua",
        dateFormat: "d.m.Y",
        disableMobile: "true",
        allowInput: "true"
    });

    const customParseFormat = window.dayjs_plugin_customParseFormat;

    dayjs.locale('uk');
    dayjs.extend(customParseFormat);

    const today = dayjs().format('DD.MM.YYYY');

    const todayFull = dayjs().format('D MMMM YYYY, dddd');

    //date calculator (Days)
    const startDayElement = document.getElementById('startDay');
    const addDaysElement = document.getElementById('addDays');
    const addDaysSection = document.getElementById('addDaysSection');

    let startDay = startDayElement.value = today || "01.01.2022";

    function addDays() {
        startDay = dayjs(startDayElement.value, 'DD.MM.YYYY');
        const startDayInElement = document.getElementById('startDayIn');
        const resultBlock = addDaysSection.querySelector('.result-block');
        const resultElement = resultBlock.querySelector('.result');
        const resultButtons = resultBlock.querySelector('.buttons');

        resultButtons.hidden = false;
        let resultDate = startDay;
        let addDays = +addDaysElement.value;

        if (Math.abs(addDays) > 9999999) {
            resultButtons.hidden = true;
            return resultElement.innerHTML = "Занадто велика кількість днів, спробуйте зменшити число";
        }
        if (!(/^-?[0-9]+$/).test(addDays)) {
            resultButtons.hidden = true;
            return resultElement.innerHTML = "Бажано вводити цілу кількість днів";
        }

        addDays += startDayInElement.checked && addDays != 0 ? ((addDays > 0) ? -1 : 1) : 0;
        resultDate = dayjs(startDay).add(addDays, 'day').format('DD.MM.YYYY');
        let resultTitle = dayjs(resultDate, 'DD.MM.YYYY').format('D MMMM YYYY, dddd');

        return (resultElement.innerHTML = resultDate) + (resultElement.title = resultTitle);
    }

    //date calculator (Dates)
    const startDateElement = document.getElementById('startDate');
    const endDateElement = document.getElementById('endDate');
    const diffDatesSection = document.getElementById('diffDatesSection');

    let startDate = startDateElement.value = dayjs().startOf('month').format('DD.MM.YYYY') || "01.01.2022";
    let endDate = endDateElement.value = dayjs().endOf('month').format('DD.MM.YYYY') || "31.01.2022";

    function diffDates() {
        const lastDateInElement = document.getElementById('lastDateIn');
        startDate = dayjs(startDateElement.value, 'DD.MM.YYYY');
        endDate = dayjs(endDateElement.value, 'DD.MM.YYYY');
        let resultDays = startDay;
        const resultElement = diffDatesSection.querySelector('.result');

        resultDays = Math.abs(dayjs(startDate).diff(endDate, 'day')) + (lastDateInElement.checked ? 1 : 0);

        return resultElement.innerHTML = resultDays;
    }

    //date calculator (to Date)
    const toDateSection = document.getElementById('toDateSection');
    const datesListElement = toDateSection.querySelector('.significant-dates');
    const thisYear = dayjs().year();
    const todayYMD = dayjs(today, 'DD.MM.YYYY').format('YYYY-MM-DD');

    function toDate() {
        let datesList = '';

        let significantDate = [
            { name: 'christmass', date: `${thisYear}-12-25`, label: ['Різдво', 'Різдва'] },
            { name: 'ny', date: `${thisYear}-01-01`, label: ['Новий рік', 'Нового року'] },
            { name: 'spring', date: `${thisYear}-03-01`, label: ['Розпочалась весна', 'весни'] },
            { name: 'summer', date: `${thisYear}-06-01`, label: ['Розпочалось літо', 'літа'] },
            { name: 'autumn', date: `${thisYear}-09-01`, label: ['Розпочалась осінь', 'осені'] },
            { name: 'winter', date: `${thisYear}-12-01`, label: ['Розпочалась зима', 'зими'] },
            { name: 'nd', date: `${thisYear}-08-24`, label: ['День Незалежності', 'Дня Незалежності'] },
            { name: 'kd', date: `${thisYear}-06-28`, label: ['День Конституції', 'Дня Конституції'] },
        ];

        significantDate.forEach(function (obj) {
            if (dayjs(obj.date).isSame(todayYMD)) {
                obj.dayLeft = 0
            } else if (dayjs(obj.date).isBefore(todayYMD)) {
                const nextDate = dayjs(obj.date).add(1, 'year').format('YYYY-MM-DD');
                obj.dayLeft = dayjs(nextDate).diff(todayYMD, 'day')
            } else {
                obj.dayLeft = dayjs(obj.date).diff(todayYMD, 'day')
            }
        });

        significantDate.sort(function (a, b) {
            return a.dayLeft - b.dayLeft
        });

        significantDate.forEach(function (item) {
            const imageDay = `<img src="./images/s-days/${item.name}.svg" alt="іконка ${item.label[1]}">`;

            if (item.dayLeft === 0) {
                const thisDate = imageDay + item.label[0];
                datesList += `<li>${thisDate} - сьогодні </li>`;
                todayDate(thisDate);
            } else {
                datesList += `<li>${imageDay} ${item.label[1]} - ${item.dayLeft} </li>`;
            }
        });

        return datesListElement.innerHTML = datesList;
    }

    const todaySection = document.getElementById('todaySection');
    const todayInfoElement = todaySection.querySelector('.date-box');

    function todayDate(thisDate = null) {
        // якщо у toDate() є співпадіння  дня то виводимо його як сьогоднішній важливий день
        if (thisDate) return todayInfoElement.insertAdjacentHTML('afterbegin', `<p class="date-with-image">${thisDate}</p>`);

        // додаємо сьогоднішню дату
        addTodayDate();

        // додаємо який сьогодні день року
        dayOfYear();

        // додаємо дані про війну
        addWarInfo();

    }

    function addTodayDate() {
        const todayTitleElement = todaySection.querySelector('.js-today');

        if (!todayTitleElement) return;

        return todayTitleElement.insertAdjacentHTML('beforeend', ` ${todayFull}`);
    }

    function addWarInfo() {
        const startMassWarDay = '2022-02-24';
        const startWarDay = '2014-02-22';

        const massWarStr = '<p>' + (dayjs(todayYMD).diff(startMassWarDay, 'day') + 1) + '-й день повномаштабної війни російської Федерації проти Українського Народу</p>';
        const warStr = '<p>' + (dayjs(todayYMD).diff(startWarDay, 'day') + 1) + '-й день російсько-Української війни</p>';

        return todayInfoElement.insertAdjacentHTML('beforeend', `${massWarStr} ${warStr}`);
    }

    function dayOfYear() {
        const firstDayOfYear = `${thisYear}-01-01`;
        const dayInYearStr = '<p>' + (dayjs(todayYMD).diff(firstDayOfYear, 'day') + 1) + '-й день року</p>';

        return todayInfoElement.insertAdjacentHTML('beforeend', dayInYearStr);
    }

    //run functions
    addDays();
    diffDates();
    toDate();
    todayDate();

    //rerun functions
    addDaysSection.addEventListener('change', function () {
        addDays();
    });

    addDaysElement.addEventListener('keyup', function () {
        addDays();
    });

    diffDatesSection.addEventListener('change', function () {
        diffDates();
    });

    //other listeners
    //copy to clipboard
    document.querySelector('.js-copy').addEventListener('click', function () {
        if (navigator.clipboard) {
            const resultBlock = addDaysSection.querySelector('.result-block');
            const resultElement = resultBlock.querySelector('.result');
            navigator.clipboard.writeText(resultElement.textContent).then(function () {
                resultBlock.insertAdjacentHTML('beforeend', '<span class="message message--success">Текст скопійовано в буфер обміну</span>');
                window.setTimeout(() => resultBlock.querySelector('.message').remove(), 2000);
            }, function (e) {
                resultBlock.insertAdjacentHTML('beforeend', `<span class="message message--error">Помилка при копіюванні: ${e}</span>`);
                window.setTimeout(() => resultBlock.querySelector('.message').remove(), 2000);
            });
        } else {
            resultBlock.insertAdjacentHTML('beforeend', '<span class="message message--error">Ваш браузер не підтримує Clipboard</span>');
            window.setTimeout(() => resultBlock.querySelector('.message').remove(), 2000);
        }
    });

    //set date
    document.querySelector('.js-set-date').addEventListener('click', function () {
        const nowId = new Date().getTime();
        const dateBox = addDaysSection.querySelector('.date-box');
        const resultElement = dateBox.querySelector('.result-block .result');
        startDayElement.value = resultElement.textContent;
        dateBox.insertAdjacentHTML('beforeend', `<span class="message message-${nowId} message--success">Дату встановлено</span>`);
        window.setTimeout(() => dateBox.querySelector(`.message-${nowId}`).remove(), 2000);
        addDays();
    });

});