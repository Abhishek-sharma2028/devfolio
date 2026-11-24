# Welcome to your Lovable project

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Open your project in the [Lovable editor](https://lovable.dev) and keep building.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
```

Copy `.env.example` to `.env.local` before starting the app. `.env.local` is
ignored by Git and must remain local:

```sh
cp .env.example .env.local
npm run dev
```

Open [http://127.0.0.1:8080](http://127.0.0.1:8080). For Google and Lovable
sign-in to return to the local app, add this URL in **Lovable Cloud →
Authentication → Advanced → Redirect URLs**:

```text
http://127.0.0.1:8080/**
```

The Vite development server forwards the local `~oauth/initiate` route to
Lovable's managed OAuth broker. Google credentials and `LOVABLE_API_KEY` stay
in Lovable Cloud and must not be added to `.env.local` or committed.

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS
