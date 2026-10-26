# SkillSwap – Skill Exchange Platform

SkillSwap is a peer-to-peer learning platform where people teach skills they already know and learn skills from others in return. Instead of paying for every course, users can find compatible learning partners, send skill-swap requests, chat, schedule sessions, track progress, and build trust through reviews and completion certificates.

## Contents

- [Project Overview](#project-overview)
- [Main Features](#main-features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [How the Application Works](#how-the-application-works)
- [Requirements](#requirements)
- [Run Locally](#run-locally)
- [Environment Configuration](#environment-configuration)
- [Firebase Setup](#firebase-setup)
- [Build and Run for Production](#build-and-run-for-production)
- [Deployment Notes](#deployment-notes)
- [Security Notes](#security-notes)
- [Troubleshooting](#troubleshooting)

## Project Overview

SkillSwap matches people based on the skills they can teach and the skills they want to learn. For example, one member may teach Python and want to learn guitar, while another teaches guitar and wants to learn Python. The platform helps them discover each other and coordinate an exchange.

The application includes a React-based user interface, an Express server, Firebase Authentication and Cloud Firestore integration, and an optional Google Gemini-powered skill advisor.

## Main Features

- **User accounts and profiles:** register or log in and maintain a skill profile.
- **Teach and learn lists:** record skills you can teach and skills you want to learn.
- **Skill discovery and matching:** browse people and find complementary skill-exchange partners.
- **Swap requests:** propose an exchange with another member.
- **Messaging:** discuss the exchange with a potential partner.
- **Session scheduling:** coordinate learning sessions and access session-related tools.
- **Attendance and completion flow:** QR attendance tools and mutual completion verification.
- **Ratings and certificates:** review completed exchanges and access certificate features.
- **Progress dashboard and leaderboard:** review progress and community activity.
- **AI Skill Advisor:** request skill recommendations and collaborative project ideas using Gemini when an API key is configured.
- **Admin area:** access the application's administrative interface.

> Feature availability can depend on Firebase configuration, server environment variables, and the current implementation. Configure and test these integrations before using the application with real users.

## Technology Stack

| Area | Technology |
|---|---|
| Frontend | React, TypeScript, Vite |
| Styling | Tailwind CSS |
| Icons and animation | Lucide React, Motion |
| Backend | Node.js, Express |
| Authentication and database | Firebase Authentication, Cloud Firestore |
| Generative AI | Google Gemini through the `@google/genai` SDK |
| Build tools | TypeScript, esbuild |

The Gemini model identifier is configured in `server.ts`. Check that file and the currently available models in your Google AI account if you need to change the model.

## Project Structure

```text
skillswap/
├── public/
│   └── SkillSwap_Project_Report_55_Pages.docx
├── scripts/
│   └── generate_report.ts
├── src/
│   ├── assets/
│   │   └── images/              # Images imported by the UI; keep these files
│   ├── backend/
│   │   ├── firebase.ts          # Firebase initialization
│   │   └── firestoreService.ts  # Firestore data operations
│   ├── components/              # Pages, modals, and UI components
│   ├── context/
│   │   └── SkillSwapContext.tsx # Shared application state
│   ├── data/
│   │   └── mockData.ts          # Sample/demo data
│   ├── styles/
│   ├── types/
│   ├── App.tsx
│   └── main.tsx
├── .env.example
├── firebase-applet-config.json
├── firestore.rules
├── package.json
├── server.ts
├── tsconfig.json
├── vite.config.ts
└── README.md
```

The top-level `assets/.aistudio/` folder is not referenced by the application code and is not needed to run the project. The `src/assets/images/` folder **is required** because UI components import images from it.

## How the Application Works

1. A user registers or logs in.
2. The user creates a profile and adds teachable and wanted skills.
3. The application displays potential skill-exchange partners.
4. The user can send a swap request and discuss details through the messaging interface.
5. Both members coordinate and schedule a learning session.
6. The application provides attendance, completion, rating, and certificate-related flows.
7. The AI Skill Advisor can recommend complementary skills and collaborative project ideas when Gemini is configured.

### High-level architecture

```text
Browser (React + TypeScript + Tailwind)
                 |
                 v
       SkillSwap UI and Context
          |              |
          v              v
 Firebase Auth /     Express API
 Cloud Firestore     (server.ts)
                         |
                         v
                 Google Gemini API
                 (AI recommendations)
```

## Requirements

Install the following before running the project:

- **Node.js:** use a current supported LTS version.
- **npm:** included with Node.js.
- **Firebase project:** needed for Firebase-backed authentication and database features.
- **Google Gemini API key:** optional; required for live Gemini AI recommendations.

## Run Locally

1. Extract the project ZIP and open a terminal in the project root (the directory containing `package.json`).
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a local environment file named `.env` in the project root. You can copy `.env.example` and replace its example values. Do not commit `.env` to source control.
4. Configure Firebase as described in [Firebase Setup](#firebase-setup).
5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000).

The `dev` script runs `server.ts`, which starts the Express server and integrates Vite for local development. Keep the terminal open while using the local site. Stopping the process stops the local server.

## Environment Configuration

The project uses these environment variables:

| Variable | Purpose |
|---|---|
| `GEMINI_API_KEY` | Optional server-side key used for Gemini requests. If absent, the AI advisor route returns fallback recommendations. |
| `APP_URL` | Optional URL for the deployed application; used where application URL configuration is needed. |
| `PORT` | Optional server port. The default is `3000`. |

Example `.env` file:

```env
GEMINI_API_KEY=your_gemini_api_key
APP_URL=http://localhost:3000
PORT=3000
```

Use your actual values. Do not put private API keys in frontend source code, screenshots, public repositories, or the README. Keep the key server-side.

## Firebase Setup

1. Create or open a project in the [Firebase Console](https://console.firebase.google.com/).
2. Enable **Authentication** and configure the sign-in methods required by the application.
3. Create a **Cloud Firestore** database.
4. Configure the Firebase application settings used by `firebase-applet-config.json`.
5. Review and deploy appropriate Firestore security rules before using real accounts or personal data.

The application initializes Firebase from `firebase-applet-config.json` in `src/backend/firebase.ts`. Use the configuration format expected by that file. Firebase web configuration values are not a substitute for database security rules; access must be controlled by Authentication and Firestore rules.

## Build and Run for Production

Check TypeScript and build the frontend and server bundle:

```bash
npm run lint
npm run build
```

Start the built server:

```bash
npm start
```

The build script generates the frontend production build and bundles the Express server to `dist/server.cjs`. The server uses `PORT` when provided by the hosting environment, otherwise it defaults to port `3000`.

## Deployment Notes

To make the application accessible from other devices and the internet, deploy it to a Node.js-compatible hosting service rather than relying on `localhost`.

1. Push the project to a private or public Git repository, ensuring secrets and `.env` are excluded.
2. Configure the hosting service to install dependencies, build with `npm run build`, and start with `npm start`.
3. Set `GEMINI_API_KEY`, `APP_URL`, and any other required environment variables in the host's environment-variable or secrets settings.
4. Configure Firebase Authentication's authorized domains for the deployed domain.
5. Verify the app's authentication, Firestore access, AI advisor, and report-download endpoint after deployment.

The application contains a health endpoint at `/api/health`. It can be used to check whether the server is responding. Hosting providers differ, so follow the selected provider's Node.js deployment instructions.

## Security Notes

**Review these items before a public deployment:**

- The checked-in `firestore.rules` file currently allows unrestricted reads and writes. This is not safe for production. Replace it with rules that require authentication and validate which users can read or change each document before deploying.
- Never expose `GEMINI_API_KEY` in client-side code or commit real secrets.
- Apply authorization checks to admin-only operations and server endpoints.
- Validate request data on the server and add suitable rate limits for public API routes.
- Avoid storing sensitive personal information unless necessary and protect any stored data.
- Test authentication, database permissions, session flows, and downloads using accounts with different roles.

## Troubleshooting

### `npm` is not recognized
Install Node.js and reopen the terminal so that Node.js and npm are on your PATH.

### Port 3000 is already in use
Set a different port in `.env`, for example `PORT=3001`, then restart the server.

### The website stops working after closing the terminal
The development server runs only while its process is running. Start it again with `npm run dev`. For continuous public access, deploy the app to a hosting service.

### Firebase authentication or data operations fail
Check the Firebase configuration, enabled sign-in providers, Firestore database, authorized domains, and security rules.

### AI recommendations use fallback data or fail
Confirm that `GEMINI_API_KEY` is set in the server environment and that the key is valid and permitted to use the model configured in `server.ts`. Restart the server after changing environment variables.

### Images are missing
Keep the imported image files in `src/assets/images/`. These are used by the frontend and should not be removed unless their imports are also changed.

---

## Project Status

This README documents the project structure and scripts in the supplied source ZIP. Verify integrations and security settings in your own Firebase and hosting environments before presenting the deployed application as production-ready.
