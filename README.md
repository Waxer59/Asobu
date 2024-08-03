# Asobu - Hackathon Project for Midudev 2024

![Asobu](/public/asobu-og.png)

## Introduction

Asobu, derived from the Japanese word for "play," is a project that explores the possibilities of AI by integrating various interactive and assistive features. Developed for the Midudev 2024 hackathon, Asobu showcases the versatility of AI by combining music, navigation, translation, education, note-taking, chat, image recognition, and voice commands into a single platform.

## Team Members

This project was developed by the following team members:

- [@dreyfus92](www.github.com/dreyfus92)
- [@Waxer59](www.github.com/Waxer59)

## Features

- **Music:** Enjoy seamless music playback through Spotify integration. Please note, this feature requires Spotify authentication and a premium account.
- **Navigation:** Ask for directions and navigate from point A to point B with ease.
- **Translation:** Instantly translate text between multiple languages.
- **TeachMode:** Get detailed explanations and solutions for academic problems.
- **Note Taking:** Jot down and organize your thoughts with an intuitive note-taking tool.
- **Chat:** Engage in dynamic conversations with an AI-powered chatbot.
- **Image Recognition:** Analyze images and receive insights based on visual content.
- **Voice Commands:** Control Asobu hands-free using voice commands.

## How to Use

Access Asobu's web interface through your browser to explore its diverse features, including music playback, navigation, translation, and more. The intuitive design allows you to seamlessly interact with the app, while voice commands enable hands-free operation for a more convenient experience. Simply speak your commands, and Asobu will respond, making it easy to discover how AI can enhance your daily activities.

## Running the project on your local environment

### Environment Variables

Add a `.env` file in the root of the project with the following variables:

```sh
OPENAI_API_KEY=""
SPOTIFY_CLIENT_ID=""
SPOTIFY_CLIENT_SECRET=""
NEXTAUTH_URL="url_of_your_app"
NEXTAUTH_SECRET="hash_key"
```

To get the `NEXTAUTH_SECRET` you can run the following command:

```sh
openssl rand -base64 32
```

### Installation

Clone the project from the repository:

```sh
git clone git@github.com:Waxer59/Asobu.git
```

Install the dependencies:

```sh
pnpm install
```

### Running the project

Run the development server:

```sh
pnpm dev
```

## Tech Stack

- **Vercel AI SDK**: Core AI functionalities.
- **React / Next.js**: Frontend framework for a dynamic user interface.
- **Node.js**: Backend for server-side logic.
- **Spotify API**: Music playback integration.
- **Mapbox API**: Navigation and mapping services.
- **OpenAI API**: Model used for all AI-powered features.
- **Vercel**: Deployment platform for hosting the application.
- **pnpm**: Package manager for managing dependencies.

## Participation in Midudev Hackathon 2024

This project was created for the Midudev Hackathon 2024, which challenges developers to build innovative applications using the Vercel AI SDK. For more information on the hackathon, please visit the [official page](https://github.com/midudev/hackaton-vercel-2024).
