# Devfolio

Devfolio is a cinematic portfolio builder for students and independent makers. It is a static GitHub Pages site with:

- Eight visual portfolio themes with different navigation behaviors.
- Scroll, swipe, and chapter-button portfolio presentations.
- YouTube and Vimeo project preview embeds.
- A detailed profile builder with local browser persistence.
- Education fields for school, college, and journey timeline milestones.
- Featured project fields for project name, description, and GitHub URL.
- Recruiter-ready public portfolio links encoded in the URL, available immediately after profile creation and from the portfolio film.
- Sign-in-gated editing and deletion for locally created portfolios; only the account email that created a profile can manage it.
- Copy and delete controls for locally created portfolios; deleting removes the profile from the browser roster and local storage.
- Theme-specific motion, chapter controls, scroll/swipe behavior, button treatments, and video-led presentation styles.
- Local account sign-in for a static deployment without a backend.

## Run locally

Open `index.html` directly, or serve the folder with any static file server:

```powershell
python -m http.server 4173
```

The site does not send account or profile data to a server. Profiles and the local account are stored in the browser's `localStorage`.

Google authentication is not included. Sign-in uses the local email/password account flow and stores the account in this browser.
