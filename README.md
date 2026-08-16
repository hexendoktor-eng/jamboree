# Jamboree

A personal music catalogue for saving listening history and tracking recommendations from friends.

## Run locally

```bash
npm install
npm run dev
```

## Import a public Last.fm profile

Jamboree imports a username’s recent public scrobbles. It does not ask for a Last.fm password or use Last.fm login.

1. Create a free API account at [Last.fm API accounts](https://www.last.fm/api/account/create).
2. Copy `.env.example` to `.env.local`.
3. Replace the placeholder with the API key Last.fm gives you:

   ```text
   VITE_LASTFM_API_KEY=your_api_key_here
   ```

4. Restart `npm run dev`, select **Add Last.fm profile**, and enter a public Last.fm username.

Do not add your Last.fm shared secret to this project. The username importer only makes public, read-only API calls. A server-side integration will be needed later for authenticated actions such as scrobbling or loving tracks.
