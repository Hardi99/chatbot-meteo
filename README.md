# 🤖 Chatbot Météo pour Telegram

Voici mon retour au test technique. Il s'agit d'un chatbot simple pour Telegram capable de donner la météo actuelle pour une ville demandée par l'utilisateur.

## 🔗 Accès au Chatbot

Vous pouvez interagir directement avec le bot sur Telegram via le lien suivant :
➡️ **[t.me/Harutenki_bot](https://t.me/Harutenki_bot)**

## ✨ Fonctionnalités

*   **Extraction de la ville :** Le bot comprend les demandes formulées comme `"météo à [Ville]"`, `"[Ville]"`, `"quelle est la météo de [Ville]"`.
*   **Météo en temps réel :** Il interroge l'API OpenWeatherMap pour obtenir les données les plus fraîches.
*   **Réponse claire et illustrée :** Le bot répond avec une phrase simple, la température, la description du temps et un emoji pertinent.
*   **Gestion des erreurs :** Il informe l'utilisateur si la ville n'est pas trouvée ou si la commande n'est pas comprise.

## 🚀 Installation et Lancement en local

Pour faire tourner ce projet sur votre machine, voici les étapes à suivre.

### Prérequis

*   [Node.js](https://nodejs.org/) (version 16 ou supérieure)
*   Un compte Telegram pour créer un bot
*   Une clé API gratuite de [OpenWeatherMap](https://openweathermap.org/api)

### Étapes d'installation

1.  **Clonez ce dépôt :**
    ```bash
    git clone https://github.com/votre-pseudo/chatbot-meteo.git
    cd chatbot-meteo
    ```

2.  **Installez les dépendances :**
    ```bash
    npm install
    ```

3.  **Configurez les variables d'environnement :**
    Créez un fichier `.env` à la racine du projet. Vous pouvez copier `env.example` (si fourni) ou utiliser la structure suivante :

    ```ini
    # Jeton d'accès de votre bot, fourni par @BotFather sur Telegram
    TELEGRAM_BOT_TOKEN=VOTRE_TOKEN_TELEGRAM_ICI

    # Votre clé API obtenue depuis le site OpenWeatherMap
    OPENWEATHERMAP_API_KEY=VOTRE_CLE_API_OPENWEATHERMAP_ICI
    ```
    > ⚠️ **Important :** Le fichier `.env` contient des informations sensibles et ne doit **jamais** être partagé ou versionné sur Git. Il est déjà inclus dans le fichier `.gitignore` pour cette raison.

4.  **Lancez le bot :**
    ```bash
    node index.js
    ```
    Votre terminal devrait afficher `🤖 Bot météo démarré...` et le bot sera actif sur Telegram.

## 🤔 Choix Techniques

J'ai fait des choix technologiques simples et efficaces pour répondre rapidement au besoin :

*   **Langage : Node.js**
    C'est un environnement que je maîtrise bien. Son modèle non-bloquant et asynchrone est parfait pour une application comme un chatbot, qui passe son temps à attendre des messages ou des réponses d'API.

*   **Plateforme de Chat : Telegram**
    Son API est extrêmement bien documentée, gratuite, et la librairie `node-telegram-bot-api` simplifie grandement les interactions. C'est un excellent choix pour prototyper rapidement.

*   **API Météo : OpenWeatherMap**
    Une référence dans le domaine que j'ai déjà utilisé, avec une API REST facile à interroger.

*   **Librairies clés :**
    *   `node-telegram-bot-api` : Pour communiquer avec l'API de Telegram.
    *   `axios` : Un client HTTP simple et puissant pour interroger l'API météo.
    *   `dotenv` : Une bonne pratique pour gérer les variables d'environnement et ne pas exposer les clés API dans le code.

## ⏱️ Temps Passé sur l'Exercice

J'estime le temps passé sur la solution Node.js comme suit :
*   **Recherche et configuration des API :** ~30min
*   **Développement et codage :** ~1h
*   **Peaufinage et déploiement :** ~1h
*   **Total :** Environ **2 heures et 30 minutes**.