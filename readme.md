# Showcase portfolio web development 
## Gemaakt door [Krijn Grimme](https://www.linkedin.com/in/krijn-grimme-825621226/)

## Inhoudsopgave
- [Setup](#setup)
- [Troubleshooting](#troubleshooting)

## Setup
1. Clone de repository
2. Run de docker container met `docker-compose up -d`
  > Als je geen docker hebt, installeer het dan [hier](https://docs.docker.com/get-docker/)
  
  >Als je voor het eerst deze repository clone, dan moet je de docker container builden met `docker-compose up -d --build`
3. Run `lerna bootstrap` om de packages te installeren 
4. Run `lerna run start` om de packages te starten
5. Ga naar `localhost:3000` om de website te bekijken
  > Je kan op de website inloggen als docent met de volgende gegevens:
  > - email: `admin`
  > - password: `admin`