// Import des dépendances nécessaires
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const cors = require('cors');
const express = require('express');

// Récupération des clés API depuis les variables d'environnement
const token = process.env.TELEGRAM_BOT_TOKEN;
const weatherApiKey = process.env.OPENWEATHERMAP_API_KEY;
const port = process.env.PORT || 3000;
const url = process.env.RENDER_URL;

// Création de l'instance du bot
const bot = new TelegramBot(token);

console.log('🤖 Bot météo démarré...');

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

// Création du serveur Express
const app = express();
app.use(express.json()); // Pour que notre serveur comprenne le JSON envoyé par Telegram
app.use(cors())

// C'est ici que Telegram enverra les messages (requêtes POST)
app.post(`/bot${token}`, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200); // On répond "OK" à Telegram pour dire qu'on a bien reçu
});

// Le serveur se met en écoute sur le port
app.listen(port, () => {
  console.log(`🚀 Notre app écoute sur le port ${port}`);
});

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