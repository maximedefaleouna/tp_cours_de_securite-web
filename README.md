# Université de Kara - Système de Gestion des Notes

Projet de Sécurité Web - Groupe 2

##  Table des Matières

- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Lancement du Projet](#lancement-du-projet)
- [Fonctionnalités](#fonctionnalités)
- [Structure du Projet](#structure-du-projet)
- [Sécurité](#sécurité)

---

##  Prérequis

Assurez-vous d'avoir installé les logiciels suivants :

- **Node.js** (version 18 ou supérieure)
- **npm** ou **bun** (gestionnaire de paquets)
- **PostgreSQL** (base de données)
- **Redis** (cache et stockage temporaire)

### Installation des prérequis

```bash
# Vérifier les versions
node --version
npm --version

# Installer PostgreSQL (Windows)
# Télécharger depuis : https://www.postgresql.org/download/windows/

# Installer Redis (Windows)
# Utiliser WSL ou télécharger depuis : https://github.com/microsoftarchive/redis/releases
```

---

## Installation

### 1. Cloner le projet

```bash
cd securite-web
```

### 2. Installation des dépendances

#### Backend

```bash
cd server
npm install
```

#### Frontend

```bash
cd ../client
npm install
```

---

##  Configuration

### Variables d'Environnement

#### Backend (`server/.env`)

Copiez le fichier `.env.example` (si disponible) ou créez un fichier `.env` dans le dossier `server` :

```env
# Base de données
DATABASE_URL="postgresql://postgres:VOTRE_MDP@localhost:5432/securite-web?schema=public"

# JWT Secrets
JWT_SECRET=votre_jwt_secret_tres_long_et_secu
REFRESH_TOKEN_SECRET=votre_refresh_token_secret
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_EXPIRES_IN=7d

# Port du serveur
PORT=3000

# URLs de l'application
BACKEND_URL=http://localhost:3000
FRONTEND_URL=http://localhost:8080

# Configuration Email (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=votre.email@gmail.com
EMAIL_HOST_PASSWORD=votre_mot_de_passe_application

# Redis

REDIS_HOST=redis-17780.c100.us-east-1-4.ec2.cloud.redislabs.com
REDIS_PORT=17780
REDIS_PASSWORD=Si203QpDTHGDLb458TPtNQF58C2ZSn81
```

** Important pour Gmail :**
- Utilisez un "mot de passe d'application" généré par Gmail
- Activez l'authentification à deux facteurs
- Ne committez jamais ces informations dans Git

#### Frontend (`client/.env`)

Créez un fichier `.env` dans le dossier `client` :

```env
VITE_API_URL=http://localhost:3000
VITE_FRONTEND_URL=http://localhost:8080
VITE_BACKEND_URL=http://localhost:3000
```

### 3. Configuration de la Base de Données

```bash
# Se placer dans le dossier server
cd server

# Initialiser Prisma
npx prisma init

# Générer les migrations
npx prisma migrate dev

# Générer le client Prisma
npx prisma generate

# (Optionnel) Créer le premier administrateur
node prisma/firstAdmin.js
```

---

##  Lancement du Projet

### Option 1 : Lancement séparé (Recommandé pour le développement)

#### Terminal 1 - Backend

```bash
cd server
npm run dev
```

Le serveur devrait démarrer sur : **http://localhost:3000**

#### Terminal 2 - Frontend

```bash
cd client
npm run dev
```

L'application frontend devrait démarrer sur : **http://localhost:8080**

### Option 2 : Lancement en production

#### Backend

```bash
cd server
npm start
```

#### Frontend

```bash
cd client
npm run build
npm run preview
```

---

## ✨ Fonctionnalités

### Authentification & Sécurité

- ✅ Connexion multi-rôles (Admin, Professeur, Étudiant, Responsable Formation)
- ✅ Authentification à deux facteurs (2FA)
- ✅ Protection CSRF (Cross-Site Request Forgery)
- ✅ Récupération de mot de passe par email
- ✅ Tokens JWT avec expiration
- ✅ Rate limiting (limitation de débit)
- ✅ Hachage des mots de passe avec bcrypt

### Gestion des Utilisateurs

- **Administrateurs** : Accès complet à toutes les fonctionnalités
- **Professeurs** : Gestion des cours et notes
- **Étudiants** : Consultation des notes et relevés
- **Responsables Formation** : Gestion des formations et personnels

### Emails Automatisés

- 📧 Envoi des identifiants de connexion
- 📧 Réinitialisation de mot de passe
- 📧 Codes OTP pour vérification
- 📧 Notifications diverses

---

##  Structure du Projet

```
securite-web/
├── server/                 # Backend (Node.js + Express + Prisma)
│   ├── src/
│   │   ├── config/        # Configurations (Prisma, Redis, Swagger)
│   │   ├── middlewares/   # Middlewares (validation, erreurs)
│   │   ├── modules/       # Modules métier (auth, users, notes, etc.)
│   │   ├── security/      # Sécurité (2FA, CSRF, JWT, password)
│   │   ├── utils/         # Utilitaires (email service)
│   │   └── app.js         # Application Express
│   ├── prisma/            # Schéma et migrations Prisma
│   ├── uploads/           # Fichiers uploadés
│   └── .env               # Variables d'environnement
│
├── client/                # Frontend (React + Vite + TypeScript)
│   ├── src/
│   │   ├── components/    # Composants React
│   │   ├── contexts/      # Contextes React
│   │   ├── hooks/         # Hooks personnalisés
│   │   ├── lib/           # Bibliothèques (API client)
│   │   ├── pages/         # Pages de l'application
│   │   ├── services/      # Services API
│   │   ├── stores/        # Stores Zustand
│   │   └── types/         # Types TypeScript
│   └── .env               # Variables d'environnement
│
└── README.md              # Ce fichier
```

---

##  Sécurité

Ce projet inclut plusieurs couches de sécurité :

### 1. Protection CSRF
- Tokens CSRF générés cryptographiquement
- Validation sur les requêtes sensibles (POST, PUT, DELETE)
- Expiration automatique après 1 heure

### 2. Authentification 2FA
- Support TOTP (Google Authenticator, Authy)
- Codes de récupération
- OTP temporaires par email

### 3. JWT & Sessions
- Tokens d'accès et de rafraîchissement
- Expiration configurable
- Stockage sécurisé

### 4. Rate Limiting
- Limitation des requêtes par IP
- Protection contre le brute-force
- Configuration adaptable

### 5. Hachage des Mots de Passe
- Algorithme bcryptjs
- Salt rounds configurables
- Protection contre les attaques par rainbow table

---

##  Comptes de Test

### Administrateur
```
Email: admin@gmail.com
Mot de passe: 123456
```


##  Dépannage

### Problèmes courants

#### Erreur de connexion à PostgreSQL
```bash
# Vérifier que PostgreSQL est en cours d'exécution
# Windows : Services -> PostgreSQL

# Vérifier les identifiants dans .env
DATABASE_URL="postgresql://postgres:MDP@localhost:5432/securite-web"
```

#### Erreur Redis
```bash
# Vérifier que Redis est en cours d'exécution
redis-cli ping
# Doit retourner : PONG

# Redémarrer Redis si nécessaire
```

#### Problème d'envoi d'email
```bash
# Vérifier les credentials Gmail dans .env
# Utiliser un mot de passe d'application, pas le mot de passe normal
# Activer l'authentification à 2 facteurs sur le compte Gmail
```

#### Migration Prisma échouée
```bash
cd server
npx prisma migrate reset
npx prisma migrate dev
```

---

##  Technologies Utilisées

### Backend
- **Node.js** + **Express** : Serveur web
- **Prisma** : ORM pour base de données
- **PostgreSQL** : Base de données
- **Redis** : Cache et stockage temporaire
- **bcryptjs** : Hachage des mots de passe
- **jsonwebtoken** : Tokens JWT
- **nodemailer** : Envoi d'emails
- **speakeasy** : Authentification 2FA
- **zod** : Validation des données

### Frontend
- **React 18** : Bibliothèque UI
- **TypeScript** : Typage statique
- **Vite** : Build tool
- **Zustand** : State management
- **Tailwind CSS** : Framework CSS
- **shadcn/ui** : Composants UI
- **React Router** : Routing

---

##  Équipe

**Groupe 2 - Sécurité Web**
DEFALEOUNA Tchassama Dessoklema Maxime
PANIZIM Pélagie 
AKOTO Emefa Justine
FOLLY Koffi Serge

---

##  License

Projet académique - Université de Kara

