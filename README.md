# Devfolio

Devfolio is a cinematic portfolio builder for students and independent makers. It is a static GitHub Pages site with:

- Eight visual portfolio themes with different navigation behaviors.
- Scroll, swipe, and chapter-button portfolio presentations.
- YouTube and Vimeo project preview embeds.
- A detailed profile builder with local browser persistence.
- Shareable public portfolio links encoded in the URL.
- Local account sign-in for a static deployment without a backend.

## Run locally

Open `index.html` directly, or serve the folder with any static file server:

```powershell
python -m http.server 4173
```

The site does not send account or profile data to a server. Profiles and the local account are stored in the browser's `localStorage`.
