// Using OpenWeather API service for weather data

// Personal API key
const api_key = '714a0fced093cdf2a073e08b142a059d';
const regionNames = new Intl.DisplayNames(['en'], {type:'region', style:'short'});


// returns object {value, ok}. value - weather data (if no error); ok - true if no error
async function getWeatherData(city) {
    const data = {value: null, ok: false}
    const user_input = city;
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${user_input}&appid=${api_key}`);
            if (!response.ok) {
                data.value = response.status;
                throw new Error(`HTTP error: ${response.status}`);
            }
            const dataRaw = await response.json();
            if (dataRaw['cod'] !== 200) {console.log(dataRaw);}
            data.value = weatherFormat(dataRaw);
            // console.log(dataRaw);
            data.ok = true;
        } catch (error) {
            console.log(error);
        }
    return data;
}


function weatherFormat(data) {
    const weatherList = {city: '[City]', country: '[Country]', timestamp: '[Local Time]', 
    icon_id: null, description: '-', temp: '-', feels_like: '-', humidity: '-',
    wind_speed: '-', precipitation: '-'};
    weatherList['city'] = data['name'] || '[City]';
    weatherList['country'] = regionNames.of(data['sys']['country']) || '[Country]';
    weatherList['timestamp'] = getLocalTime(data['timezone']);
    weatherList['icon_id'] = getWeatherIconID(data['weather'][0]['id']);
    weatherList['description'] = data['weather'][0]['description'] || '-';
    weatherList['temp'] = getTemperatureCelsius(data['main']['temp']);
    weatherList['feels_like'] = getTemperatureCelsius(data['main']['feels_like']);
    weatherList['humidity'] = data['main']['humidity'].toString() || '-';
    weatherList['wind_speed'] = data['wind']['speed'].toString() || '-';
    return weatherList;
}


// return a string representation of local time
function getLocalTime(timezone) {
    if (!timezone && timezone !== 0) {throw new Error('invalid date')}
    const utc = Date.now();
    const local_time = new Date(utc + (timezone*1000));
    const weekday = local_time.toUTCString().slice(0,3);
    const hour = (local_time.getUTCHours() % 12) || 12;
    const minute = local_time.getUTCMinutes().toString().padStart(2, '0');
    const period = (local_time.getUTCHours() < 12) ? 'AM' : 'PM';
    const date = local_time.getUTCDate().toString().padStart(2, '0') 
    + '/' + (local_time.getUTCMonth() + 1).toString().padStart(2, '0')
    + '/' + local_time.getUTCFullYear();
    return `${weekday} ${hour}:${minute} ${period}, ${date}`;
}


// return weather icon id (1 to 8) based on api weather id. Return null if not found.
function getWeatherIconID(id) {
    if (id > 804 || id < 200) {
        console.log("weather id not found, id:", id);
        return null;
    }
    if (id > 800) {                 // Clouds
        if (id < 803) {return 2;}
        else if (id < 805) {return 3;}
    }
    else if (id == 800) {return 1;} // Clear 
    else if (id > 700) {return 8;}  // Atmosphere 
    else if (id >= 600) {return 7;} // Snow 
    else if (id >= 300) {           // Rain / Drizzle
        if ((id > 501 && id < 505) || id > 521) {return 5;} // heavy rain
        else {return 4;}
    }
    else if (id >= 200) {return 6;} // Thunderstorm 
}


// return temperature string in Celsius given Kelvins
function getTemperatureCelsius(kelvins) {
    return parseInt(Math.round(kelvins - 273.15)).toString();
}

export {getWeatherData};
