document.getElementById('search').addEventListener("keyup", (e) => { if (e.key === "Enter") { sendRequest() }})

const 
    spinner = document.getElementById('spinner'),
    results = document.getElementById('results'),
    video = document.getElementById("video"),
    banners = { 
        rain: "https://player.vimeo.com/external/569219985.sd.mp4?s=76ae62b4fa33a6ffe05d53374bbb2b38b83177ac&profile_id=164&oauth2_token_id=57447761",
        snow: "https://player.vimeo.com/external/505388047.sd.mp4?s=fe60bc33857eacb7728b9e0b90f37e0c87b25df5&profile_id=165&oauth2_token_id=57447761",
        default: "https://player.vimeo.com/external/555561402.sd.mp4?s=3bb73cd5fd95157d5c3e93187f55ae69f78ba6e2&profile_id=165&oauth2_token_id=57447761",
        clouds: "https://player.vimeo.com/external/316506213.sd.mp4?s=5cbb4c572719f6e5720468f2fbe231f729a52efc&profile_id=164&oauth2_token_id=57447761",
        clear: "https://player.vimeo.com/external/345805150.sd.mp4?s=ac036f2cd61e3e65a2d40504beffb9601e204ccf&profile_id=139&oauth2_token_id=57447761"
    }

const source = video.getElementsByTagName('source')

window.addEventListener('load', () => {

    spinner.classList.add('transparent')
    results.classList.add('d-none')

    document.getElementById("year").innerText = new Date().getFullYear()
})

function showToast(message) {
    let snackbar = document.getElementById('snackbar')
    document.getElementById("snack").innerText = message
    
    snackbar.className = "show"
    setTimeout(() => { snackbar.className = snackbar.className.replace("show", "") }, 5800)
}

async function getTimeZone(code) {
    var tz = ct.getCountry(code);

    await fetch(`http://worldtimeapi.org/api/timezone/${tz.timezones[0]}`)
        .then((response) => {
            response.json().then((data) => {
                let time = new Date(data.datetime).toLocaleString('en-US', { timeZone: tz.timezones[0] })
                document.getElementById("time").innerHTML = `${time.toLocaleString('en-us', { weekday: 'long' })}`
            })
        })
        .catch((error) => { console.log(error) })
}

async function loadResponse(location) {
    await fetch(`https://weather.contrateumdev.com.br/api/weather/city/?city=${location}`)
        .then((response) => {

            response.json().then((data) => {
                if(data.cod == 200)
                {
                    document.getElementById("location").innerHTML = `${data.sys.country}, ${location}`
                    document.getElementById("pressure").innerHTML = `<span data-feather="minimize-2"></span> &nbsp;&nbsp; Pressure: ${data.main.pressure} mb`
                    document.getElementById("humidity").innerHTML = `<span data-feather="droplet"></span> &nbsp;&nbsp; Humidity: ${data.main.humidity}%`
                    document.getElementById("wind").innerHTML = `<span data-feather="wind"></span> &nbsp;&nbsp; Wind: ${data.wind.speed} km/h`
                    document.getElementById("degree").innerHTML = Math.trunc(data.main.temp) + "°"
                    document.getElementById("visibility").innerHTML = `<span data-feather="eye"></span> &nbsp;&nbsp; Visibility: ${data.visibility * 0.001} km`
                    document.getElementById("degree-feels-like").innerHTML = Math.trunc(data.main.feels_like) + "°"
                    document.getElementById("description").innerHTML = `${data.weather[0].main} | ${data.weather[0].description}`
                    
                    switch(data.weather[0].main.toLowerCase()) {
                        case 'drizzle':
                        case 'rain': source[0].src = banners.rain
                            break
                        case 'clouds': source[0].src = banners.clouds
                            break
                        case 'clear': source[0].src = banners.clear
                            break
                        case 'snow': source[0].src = banners.snow
                            break
                        default: source[0].src = banners.default
                            break
                    }

                    video.load();
                    getTimeZone(data.sys.country)
                    results.classList.remove('d-none')
                }
                else {
                    let message = data.message
                    showToast(message.charAt(0).toUpperCase() + message.slice(1))
                }
            })
        
            spinner.classList.add('transparent')
            setTimeout(() => { feather.replace() }, 100)
        })
        .catch((error) => { 
            console.log(error)
            
            spinner.classList.add('transparent')
            showToast(error.message)
        })
}

async function sendRequest() {
    let location = document.getElementById("search").value

    if(location.length > 0)
    {
        spinner.classList.remove('transparent')
        results.classList.add('d-none')
        
        document.title = `Weather in ${location}`
        await loadResponse(location)
        return;
    } 

    showToast("Insert a location.")

    results.classList.add('d-none')
    return;
}