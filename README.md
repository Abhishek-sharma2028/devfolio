# Devfolio

Devfolio is a cinematic portfolio builder for students and independent makers. It is a static GitHub Pages site with:

- Eight visual portfolio themes with different navigation behaviors.
- Scroll, swipe, and chapter-button portfolio presentations.
- YouTube and Vimeo project preview embeds.
- A detailed profile builder with local browser persistence.
- Recruiter-ready public portfolio links encoded in the URL, available immediately after profile creation and from the portfolio film.
- Copy and delete controls for locally created portfolios; deleting removes the profile from the browser roster and local storage.
- Theme-specific motion, chapter controls, scroll/swipe behavior, button treatments, and video-led presentation styles.
- Local account sign-in for a static deployment without a backend.
- Google Identity Services sign-in when a Google OAuth Web client ID is configured.

## Run locally

Open `index.html` directly, or serve the folder with any static file server:

```powershell
python -m http.server 4173
```

The site does not send account or profile data to a server. Profiles and the local account are stored in the browser's `localStorage`.

## Enable Google sign-in

1. In Google Cloud Console, create an OAuth 2.0 **Web application** client.
2. Add the deployed origin, such as `https://abhishek-sharma2028.github.io`, to **Authorized JavaScript origins**.
3. Set the client ID in the page before publishing:

```html
<body data-google-client-id="YOUR_WEB_CLIENT_ID.apps.googleusercontent.com">
```

The client ID is public configuration; never put a client secret in this repository. Without a configured client ID, the button explains the missing setup instead of pretending that Google authentication succeeded.
