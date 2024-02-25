import * as weather_query from './weather_query.js';

const html_main = document.querySelector('html');
const header_section = document.querySelector('.header-section')
const info_section = document.querySelector('.info-section');
const search_section = document.querySelector('.search-section');
const search_box = document.querySelector('.search-box');
const search_input = document.getElementById('search-input');
const search_icon = document.querySelector('.search-icon');
const loader_box = document.querySelector('.loader-box');
const popup_message = document.querySelector('.popup-message');
const theme_switch = document.getElementById('theme-switch');
const weather_icon = document.getElementById('weather-icon');

const label_name = document.getElementById('label-name');
const label_timestamp = document.getElementById('label-timestamp');
const label_description = document.getElementById('label-description');
const label_temp = document.getElementById('label-temp');
const label_feels_like = document.getElementById('label-feels-like');
const label_wind_speed = document.getElementById('label-wind-speed');
const label_humidity = document.getElementById('label-humidity');

let searchBoxOpen = false;


async function searchWeather() {
    hideMessage();
    const input = search_input.value;
    if (input === "") {return;}
    search_input.setAttribute('disabled', '');
    search_icon.style.display = "none";
    loader_box.style.display = "flex";
    
    const data = await weather_query.getWeatherData(input);

    if (data.ok) {
        displayWeather(data.value);
        outsideClickHandle();
    } else {
        displayError(data.value);
    }

    search_input.removeAttribute('disabled');
    search_icon.style.display = "flex";
    loader_box.style.display = "none";
}


function displayWeather(data) {
    label_name.innerHTML = data['city'] + ', ' + data['country'];
    label_timestamp.innerHTML = data['timestamp'];
    label_description.innerHTML = data['description'];
    label_temp.innerHTML = data['temp'];
    label_feels_like.innerHTML = data['feels_like'];
    label_wind_speed.innerHTML = data['wind_speed'] + ' m/s';
    label_humidity.innerHTML = data['humidity'] + '%';

    if (data['icon_id']) {
        weather_icon.setAttribute("src", "images/weather_" + data['icon_id'] + ".svg");
    }
}

function displayError(value) {
    if (value === 404) {
        showMessage('No results found');
    }
    else {
        showMessage('Error');
    } 
}

function showMessage(string) {
    popup_message.innerHTML = string;
    popup_message.classList.add("show");
}

function hideMessage() {
    popup_message.classList.remove("show");
}

// show search box
function infoClickHandle() {
    info_section.style.display = "none";
    search_section.style.display = "block";
    search_input.focus();
    searchBoxOpen = true;
}

// show info
function outsideClickHandle() {
    info_section.style.display = "flex";
    search_section.style.display = "none";
    searchBoxOpen = false;
}

function init() {
    header_section.addEventListener('click', (event) => {
        if (searchBoxOpen) {
            let outsideClick = !search_box.contains(event.target);
            if (outsideClick) {outsideClickHandle();}
        }
        else {
            infoClickHandle();
        }
    });

    document.addEventListener('click', (event) => {
        if (searchBoxOpen) {
            let outsideClick = !header_section.contains(event.target);
            if (outsideClick) {outsideClickHandle();}
        }
    });

    // Listen for keys presses
    search_input.addEventListener('keydown', (event) => {
        switch (event.key) {
            case "Enter":
                searchWeather();
                break;
            case "Escape":
                outsideClickHandle();
                break;
            default:
                return;
        }
        event.preventDefault();
    });

    search_icon.addEventListener('click', () => {
        if (!search_input.disabled) {searchWeather();}
    });

    theme_switch.addEventListener('click', () => {
        if (html_main.getAttribute('dark') === '0') {
            html_main.setAttribute('dark', '1');
        } else {
            html_main.setAttribute('dark', '0');
        }
    });
}

init();
