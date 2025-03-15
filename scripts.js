const apiKey = '318864f35d806ffe4217170a51e8eb85'; // Votre clé API OpenWeatherMap

function showMessage(text) {
    const messageBox = document.getElementById('message-box');
    messageBox.textContent = text;
    messageBox.classList.add('show');
    setTimeout(() => messageBox.classList.remove('show'), 3000); // Disparaît après 3s
}

function getWeather() {
    const city = document.getElementById('city').value.trim();
    const weatherDiv = document.getElementById('weather-info');
    weatherDiv.innerHTML = '';

    if (!city) {
        showMessage('Veuillez entrer une ville.');
        return;
    }

    weatherDiv.innerHTML = '<p>Chargement...</p>';
    
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=fr`)
        .then(response => {
            if (!response.ok) {
                if (response.status === 401) throw new Error('Clé API invalide.');
                if (response.status === 404) throw new Error('Ville non trouvée.');
                throw new Error(`Erreur API : ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Données récupérées:', data);
            let current_utc_time = Math.floor(Date.now() / 1000);
            let timezone_offset = data.timezone;
            let current_local_time = current_utc_time + timezone_offset;
            let local_sunrise_time = data.sys.sunrise + timezone_offset;
            let local_sunset_time = data.sys.sunset + timezone_offset;
            let is_day = current_local_time >= local_sunrise_time && current_local_time < local_sunset_time;

            displayWeather(data, current_local_time);
            animateWeather(data.weather[0].main, data.main.temp, is_day);
        })
        .catch(error => {
            console.error('Erreur:', error.message);
            showMessage(`Erreur : ${error.message}`);
        });
}

function displayWeather(data, current_local_time) {
    const weatherDiv = document.getElementById('weather-info');
    const temp = data.main.temp;
    const description = data.weather[0].description;
    const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

    let local_date = new Date(current_local_time * 1000);
    let hours = local_date.getUTCHours();
    let minutes = local_date.getUTCMinutes();
    let time_str = hours.toString().padStart(2, '0') + ":" + minutes.toString().padStart(2, '0');

    weatherDiv.innerHTML = `
        <h3>${data.name}, ${data.sys.country}</h3>
        <img src="${icon}" alt="Météo">
        <p>${temp}°C - ${description}</p>
        <p>Heure actuelle: ${time_str}</p>
    `;
    generateSuggestions(description, temp);
}

function animateWeather(condition, temp, is_day) {
    const particlesDiv = document.getElementById('weather-particles');
    const canvas = document.querySelector('.weather-canvas');
    particlesDiv.innerHTML = '';

    let background;
    if (condition.toLowerCase().includes('rain')) {
        if (is_day) {
            background = 'linear-gradient(145deg, #cccccc, #888888)'; // Light gray to gray
        } else {
            background = 'linear-gradient(145deg, #333333, #000000)'; // Dark gray to black
        }
        for (let i = 0; i < 80; i++) {
            const drop = document.createElement('div');
            drop.className = 'rain-drop';
            drop.style.left = `${Math.random() * 100}vw`;
            drop.style.animationDelay = `${Math.random() * 1}s`;
            drop.style.animationDuration = `${0.5 + Math.random() * 0.5}s`;
            particlesDiv.appendChild(drop);
        }
    } else if (temp > 25) {
        background = 'linear-gradient(145deg, #0a0e17, #f97316)'; // Same as before
        const core = document.createElement('div');
        core.className = 'sun-core';
        particlesDiv.appendChild(core);
        for (let i = 0; i < 12; i++) {
            const ray = document.createElement('div');
            ray.className = 'sun-ray';
            ray.style.left = '10%';
            ray.style.top = '50%';
            ray.style.transform = `translate(-50%, -50%) rotate(${i * 30}deg)`;
            ray.style.animationDelay = `${i * 0.2}s`;
            particlesDiv.appendChild(ray);
        }
    } else if (temp < 5 || condition.toLowerCase().includes('snow')) {
        if (is_day) {
            background = 'linear-gradient(145deg, #ffffff, #b2d8d8)'; // Light blue to white
        } else {
            background = 'linear-gradient(145deg, #000000, #002233)'; // Dark blue to black
        }
        for (let i = 0; i < 50; i++) {
            const flake = document.createElement('div');
            flake.className = 'snowflake';
            flake.style.left = `${Math.random() * 100}vw`;
            flake.style.animationDelay = `${Math.random() * 4}s`;
            flake.style.animationDuration = `${3 + Math.random() * 2}s`;
            particlesDiv.appendChild(flake);
        }
    } else {
        if (is_day) {
            background = 'linear-gradient(145deg, #cccccc, #888888)'; // Light gray to gray
        } else {
            background = 'linear-gradient(145deg, #333333, #000000)'; // Dark gray to black
        }
    }

    canvas.style.background = background;
}

function generateSuggestions(description, temp) {
    const suggestions = document.getElementById('suggestions');
    suggestions.innerHTML = '';
    let ideas = [];

    if (description.toLowerCase().includes('pluie')) {
        ideas = [
            'Soirée VR immersive 🎮',
            'Cocktail dans un bar caché 🍸',
            'Atelier poterie relaxant 🏺',
            'Session jazz en sous-sol 🎷',
            'Nuit de lecture au calme 📖',
            'Cours de mixologie 🍹',
            'Expérience escape AR 🔍'
        ];
    } else if (temp > 25) {
        ideas = [
            'Piscine rooftop avec vue 🏊',
            'Concert électro en plein air 🎶',
            'Balade en kayak au coucher 🌅',
            'Dîner en terrasse étoilée 🍴',
            'Séance photo au golden hour 📸',
            'Yoga sunrise sur la plage 🧘',
            'Glaces artisanales en ville 🍦'
        ];
    } else if (temp < 5 || description.toLowerCase().includes('snow')) {
        ideas = [
            'Soirée fondue en chalet ⭐',
            'Rando raquettes sous la neige ❄️',
            'Cinéma d’hiver cosy 🎥',
            'Atelier chocolat chaud 🍫',
            'Nuit polaire en igloo 🌌',
            'Ski nocturne éclairé 🎿',
            'Méditation au froid 🌀'
        ];
    } else {
        ideas = [
            'Exploration street art 🌆',
            'Café artisanal en rooftop ☕',
            'Marché nocturne bio 🥕',
            'Session DJ minimaliste 🎧',
            'Balade vélo électrique 🚴',
            'Atelier calligraphie moderne ✍️',
            'Dégustation de craft beer 🍺'
        ];
    }
    
    ideas.forEach(idea => {
        const li = document.createElement('li');
        li.textContent = idea;
        suggestions.appendChild(li);
    });
}

function randomIdea() {
    const list = document.querySelectorAll('#suggestions li');
    if (list.length > 0) {
        const randomIndex = Math.floor(Math.random() * list.length);
        showMessage(`Idée aléatoire : ${list[randomIndex].textContent}`);
    } else {
        showMessage('Aucune suggestion disponible.');
    }
}

function filterByBudget() {
    const budget = document.getElementById('budget').value;
    const suggestions = document.querySelectorAll('#suggestions li');
    
    suggestions.forEach(li => {
        const text = li.textContent.toLowerCase();
        if (budget === 'all' || 
            (budget === 'free' && (text.includes('balade') || text.includes('yoga'))) || 
            (budget === 'low' && (text.includes('café') || text.includes('cinéma'))) || 
            (budget === 'high' && (text.includes('dîner') || text.includes('cocktail')))) {
            li.style.display = 'block';
        } else {
            li.style.display = 'none';
        }
    });
}

function shareIdea() {
    const firstIdea = document.querySelector('#suggestions li');
    if (firstIdea) {
        const text = `Météo du jour inspire : ${firstIdea.textContent} ! 🌙 #MeteoDate`;
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    } else {
        showMessage('Aucune idée à partager.');
    }
}