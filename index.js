// Import des dépendances nécessaires
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const cors = require('cors');
const express = require('express');

// Récupération des clés API depuis les variables d'environnement
const token = process.env.TELEGRAM_BOT_TOKEN;
const weatherApiKey = process.env.OPENWEATHERMAP_API_KEY;

const isProduction = process.env.NODE_ENV === 'production';

let bot;

if (isProduction) {
    // --- MODE PRODUCTION (sur Render) ---
    console.log('🤖 Démarrage en mode Production (Webhook)...');
    
    const port = process.env.PORT || 3000;
    const url = process.env.RENDER_URL;
    
    // On crée le bot sans option particulière
    bot = new TelegramBot(token);
    
    // On configure le webhook
    bot.setWebHook(`${url}/bot${token}`);

    const app = express();
    app.use(express.json());

    app.post(`/bot${token}`, (req, res) => {
        bot.processUpdate(req.body);
        res.sendStatus(200);
    });

    app.listen(port, () => {
        console.log(`🚀 Serveur démarré sur le port ${port}`);
    });

} else {
    // --- MODE DÉVELOPPEMENT (sur notre PC) ---
    console.log('🤖 Démarrage en mode Développement (Polling)...');
    
    // On crée le bot avec l'option "polling: true"
    bot = new TelegramBot(token, { polling: true });
}

// Dictionnaire pour mapper les conditions météo à des emojis
const weatherEmojis = {
    'Clear': '☀️',
    'Clouds': '☁️',
    'Rain': '🌧️',
    'Drizzle': '🌦️',
    'Thunderstorm': '⛈️',
    'Snow': '❄️',
    'Mist': '🌫️'
};

// Le bot écoute tous les messages entrants
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const userInput = msg.text;

    console.log(`Message reçu de ${msg.from.first_name}: "${userInput}"`);
    
    // Liste de patterns pour extraire la ville
    const patterns = [
        /m[ée]t[ée]o\s*(?:à|de)?\s*([a-zA-ZÀ-ÿ\s\-']+)/i,
        /quelle est la m[ée]t[ée]o\s*(?:à|de)?\s*([a-zA-ZÀ-ÿ\s\-']+)/i
    ];

    let city = null;
    for (const pattern of patterns) {
        const match = userInput.match(pattern);
        if (match && match[1]) {
            city = match[1].trim();
            break;
        }
    }
    // Si aucun pattern ne correspond, tenter de prendre le message comme nom de ville
    if (!city && /^[a-zA-ZÀ-ÿ\s\-']{2,}$/.test(userInput)) {
        city = userInput;
    }

    if (!city) {
        bot.sendMessage(chatId, "Désolé, je ne comprends pas votre demande. Essayez par exemple : 'météo Paris', 'météo à Lyon' ou simplement le nom de la ville.");
        return;
    }

    // Construction de l'URL pour l'API OpenWeatherMap
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${weatherApiKey}&units=metric&lang=fr`;

    try {
        // Appel à l'API météo
        const response = await axios.get(apiUrl);
        const data = response.data;

        // Extraction des informations utiles
        const cityName = data.name;
        const temperature = data.main.temp;
        const weatherDescription = data.weather[0].description;
        const weatherMain = data.weather[0].main;

        // Choix de l'émoji en fonction de la météo
        const emoji = weatherEmojis[weatherMain] || '🌍'; // Emoji par défaut si la condition n'est pas trouvée

        // Formatage de la réponse finale
        const reply = `${emoji} Il fait actuellement ${Math.round(temperature)} °C à ${cityName} avec un ciel ${weatherDescription}.`;

        // Envoi de la réponse à l'utilisateur
        bot.sendMessage(chatId, reply);
        console.log(`Réponse envoyée pour ${cityName}.`);
        console.log(weatherMain, temperature, weatherDescription);

    } catch (error) {
        console.error("Erreur lors de l'appel à l'API météo:", error.response?.data?.message || error.message);
        bot.sendMessage(chatId, `Désolé, je n'ai pas pu récupérer la météo pour "${city}". Vérifiez que le nom de la ville est correct.`);
    }
});