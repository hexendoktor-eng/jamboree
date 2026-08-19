# Jamboree

A personal music catalogue for saving listening history and tracking recommendations from friends.

## Run locally

```bash
npm install
npm run dev
```

The frontend runs at `http://localhost:5173`. The catalogue interface and SoundCloud test can run without private credentials.

## Last.fm integration

Jamboree imports a username's recent public scrobbles through a separate C# backend. The Last.fm API key is stored in .NET User Secrets and is never bundled into the browser application.

If you have the companion `jamboree-backend` repository beside this repository, configure and start it with:

```bash
cd ../jamboree-backend
dotnet user-secrets set "LastFm:ApiKey" "your_api_key_here" --project jamboree-backend/jamboree-backend.csproj
dotnet run --project jamboree-backend/jamboree-backend.csproj
```

The backend listens at `http://localhost:5041`. You can override that address in an ignored frontend `.env.local` file:

```text
VITE_API_BASE_URL=http://localhost:5041
```

Never place the Last.fm API key or shared secret in a `VITE_` environment variable. Vite variables are delivered to the browser and must be treated as public.

## SoundCloud test

The SoundCloud Test page plays public tracks using SoundCloud's official embedded Widget API. It does not require a SoundCloud client ID, client secret, or password.

Private tracks and tracks that disable external embedding will not play.
