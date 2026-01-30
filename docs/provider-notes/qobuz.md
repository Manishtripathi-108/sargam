# Qobuz Provider Implementation Notes

## Source Projects Analysis

### SpotiFLAC-main / spotimeow-main / SpotiFLAC-Mobile-main (Go)

**Files**: `backend/qobuz.go`, `go_backend/qobuz.go`

All three projects implement similar Qobuz functionality:

**API Details:**

- Base URL: `https://www.qobuz.com/api.json/0.2`
- Authentication: `app_id` parameter (commonly used: `798273057`)
- No OAuth required for search/metadata

**Features Implemented:**

- Search tracks by ISRC
- Search by artist/track name
- Artist matching with name normalization
- Title matching with version cleanup
- Download URL retrieval (via external APIs)

## Feature Comparison

| Feature                  | SpotiFLAC/spotimeow | streamrip/Qo-DL | Sargam Implementation           |
| ------------------------ | ------------------- | --------------- | ------------------------------- |
| Track by ID              | ❌                  | ✅              | ✅                              |
| Track by ISRC            | ✅ (via search)     | ✅              | ✅                              |
| Track search             | ✅                  | ✅              | ✅                              |
| Album by ID              | ❌                  | ✅              | ✅                              |
| Album tracks             | ❌                  | ✅              | ✅                              |
| Album search             | ❌                  | ✅              | ✅                              |
| Album by UPC             | ❌                  | ❌              | ✅                              |
| Artist by ID             | ❌                  | ✅              | ✅                              |
| Artist albums            | ❌                  | ✅              | ✅                              |
| Artist top tracks        | ❌                  | ❌              | ✅                              |
| Artist search            | ❌                  | ✅              | ✅                              |
| Playlist by ID           | ❌                  | ✅              | ✅                              |
| Playlist tracks          | ❌                  | ✅              | ✅                              |
| Playlist search          | ❌                  | ✅              | ✅                              |
| Catalog search (all)     | ❌                  | ✅              | ✅                              |
| Stream URLs              | ✅ (external APIs)  | ✅ (native)     | ✅ (native + external fallback) |
| Preview URLs             | ❌                  | ❌              | ✅ (30-second samples)          |
| Quality selection        | ✅                  | ✅              | ✅                              |
| **User Auth**            | ❌                  | ✅              | ✅                              |
| **User Favorites**       | ❌                  | ✅              | ✅                              |
| **User Playlists**       | ❌                  | ✅              | ✅                              |
| **Labels**               | ❌                  | ❌              | ✅                              |
| **Featured Content**     | ❌                  | ❌              | ✅                              |
| **App Credential Spoof** | ❌                  | ✅              | ✅                              |

## Configuration

Environment variables:

```bash
# Basic (no auth required for metadata)
QOBUZ_APP_ID=798273057           # Optional, uses default if not set
QOBUZ_APP_SECRET=<secret>        # Required for full stream URLs

# User Authentication (optional, for favorites/playlists)
QOBUZ_EMAIL=user@example.com     # Login email
QOBUZ_PASSWORD=yourpassword      # Login password

# OR use pre-existing token
QOBUZ_USER_AUTH_TOKEN=<token>    # Alternative to email/password
QOBUZ_USER_ID=<user_id>          # Required with auth token
```

### Getting the App Secret

The app secret is required for full (non-preview) stream URLs. It can be obtained by:

1. Fetching Qobuz's login page: `https://play.qobuz.com/login`
2. Finding the bundle.js URL in the HTML
3. Extracting the secrets from the bundle using regex patterns

**Or use the built-in extractor:**

```typescript
import { QobuzProvider } from './providers/qobuz';

// Extract fresh credentials from Qobuz bundle.js
const credentials = await QobuzProvider.auth.extractAppCredentials();
if (credentials) {
    console.log('App ID:', credentials.appId);
    console.log('App Secret:', credentials.appSecret);
}
```

The signature is generated as:

```
MD5("trackgetFileUrlformat_id{quality}intentstreamtrack_id{track_id}{timestamp}{secret}")
```

**Note**: Without a valid app secret and user authentication, the API returns 30-second previews with restrictions like:

- `UserUncredentialed` - Not logged in
- `FormatRestrictedByFormatAvailability` - Quality not available
- `TrackRestrictedByPurchaseCredentials` - Requires purchase/subscription

## API Endpoints

```
# Track
GET /track/get?track_id={id}&app_id={appId}
GET /track/search?query={q}&limit={n}&offset={o}&app_id={appId}
GET /track/getFileUrl?track_id={id}&format_id={quality}&intent=stream&request_ts={ts}&request_sig={sig}

# Album
GET /album/get?album_id={id}&app_id={appId}
GET /album/search?query={q}&limit={n}&offset={o}&app_id={appId}

# Artist
GET /artist/get?artist_id={id}&app_id={appId}
GET /artist/page?artist_id={id}&app_id={appId}  # Full artist page with top tracks, albums, etc.
GET /artist/search?query={q}&limit={n}&offset={o}&app_id={appId}

# Playlist
GET /playlist/get?playlist_id={id}&app_id={appId}
GET /playlist/search?query={q}&limit={n}&offset={o}&app_id={appId}

# Catalog (combined search)
GET /catalog/search?query={q}&limit={n}&offset={o}&app_id={appId}
```

## URL Patterns

Qobuz has two URL formats:

**Main website (www.qobuz.com):**

- Tracks: `https://www.qobuz.com/us-en/track/{id}`
- Albums: `https://www.qobuz.com/us-en/album/{title}/{album_id}`
- Artists: `https://www.qobuz.com/us-en/interpreter/{name}/{id}`
- Playlists: `https://www.qobuz.com/us-en/playlist/{id}`

**Play website (play.qobuz.com):**

- Tracks: `https://play.qobuz.com/track/{id}`
- Albums: `https://play.qobuz.com/album/{album_id}`
- Artists: `https://play.qobuz.com/artist/{id}`
- Playlists: `https://play.qobuz.com/playlist/{id}`

Note: URLs include locale code (e.g., `us-en`, `fr-fr`, `de-de`)

## Quality Codes

Qobuz uses numeric quality codes:

- `5` = MP3 320kbps
- `6` = FLAC 16-bit/44.1kHz (CD quality)
- `7` = FLAC 24-bit up to 96kHz
- `27` = FLAC 24-bit up to 192kHz (Hi-Res)

These are exposed as constants: `QobuzProvider.QUALITY.FLAC_16`, etc.

## Track Metadata

Key fields in track response:

- `id` - Numeric track ID
- `title` - Track title
- `version` - Version info (remaster, etc.)
- `duration` - Duration in seconds
- `track_number` - Track position in album
- `media_number` - Disc number
- `isrc` - International Standard Recording Code
- `maximum_bit_depth` - Max bit depth available (16 or 24)
- `maximum_sampling_rate` - Max sample rate (44.1, 96, 192 kHz)
- `hires` - Boolean indicating hi-res availability
- `hires_streamable` - Boolean indicating hi-res streaming
- `performer` - Primary artist info
- `album` - Album info with cover images

## Notes

1. **Public API**: Qobuz's metadata API is publicly accessible with just an app_id. No OAuth or user credentials needed for searching/browsing.

2. **Hi-Res Audio**: Qobuz is known for high-resolution audio. The API includes `hires` and `maximum_sampling_rate` fields to identify hi-res content.

3. **Album IDs**: Unlike tracks (numeric), album IDs are alphanumeric strings.

4. **Nested Data**: Artist and album endpoints include nested tracks/albums in the response, reducing the need for separate API calls.

5. **Stream URLs**: Implemented using native Qobuz API with signature generation. Falls back to external APIs if native fails.

6. **Preview URLs**: 30-second previews are available without authentication, useful for sampling tracks.

## User Authentication

```typescript
import { QobuzProvider } from './providers/qobuz';

// Login with email/password
const loginResponse = await QobuzProvider.auth.login({
    email: 'user@example.com',
    password: 'yourpassword',
});

// Check authentication status
if (QobuzProvider.auth.isAuthenticated()) {
    console.log('Logged in as:', loginResponse.user.display_name);
}

// Or initialize from environment variables
await QobuzProvider.auth.initFromEnv(); // Uses QOBUZ_EMAIL/PASSWORD or QOBUZ_USER_AUTH_TOKEN
```

## User Features (Requires Authentication)

### Favorites

```typescript
// Get favorites
const favTracks = await QobuzProvider.user.getFavoriteTracks();
const favAlbums = await QobuzProvider.user.getFavoriteAlbums();
const favArtists = await QobuzProvider.user.getFavoriteArtists();

// Add to favorites
await QobuzProvider.user.addFavoriteTrack('123456');
await QobuzProvider.user.addFavoriteAlbum('abc123');
await QobuzProvider.user.addFavoriteArtist('789');

// Remove from favorites
await QobuzProvider.user.removeFavoriteTrack('123456');
```

### Playlists

```typescript
// Get user's playlists
const playlists = await QobuzProvider.user.getUserPlaylists();

// Create playlist
const newPlaylist = await QobuzProvider.user.createPlaylist('My Playlist', 'Description', true);

// Manage tracks
await QobuzProvider.user.addTracksToPlaylist(playlistId, ['track1', 'track2']);
await QobuzProvider.user.removeTracksFromPlaylist(playlistId, ['playlistTrackId']);

// Subscribe/Unsubscribe
await QobuzProvider.user.subscribeToPlaylist(playlistId);
await QobuzProvider.user.unsubscribeFromPlaylist(playlistId);
```

### Purchases

```typescript
const purchases = await QobuzProvider.user.getPurchases();
```

## Labels

```typescript
// Get label info
const label = await QobuzProvider.labels.getById('12345');

// Get albums by label
const albums = await QobuzProvider.labels.getAlbums('12345', { limit: 50, sort: 'release_date' });

// Get all albums (with pagination)
const allAlbums = await QobuzProvider.labels.getAllAlbums('12345', 500);

// Search labels
const results = await QobuzProvider.labels.search('Warner');
```

## Featured/Editorial Content

```typescript
// New releases
const newReleases = await QobuzProvider.featured.getNewReleases();

// Best sellers
const bestSellers = await QobuzProvider.featured.getBestSellers();

// Editor's picks
const editorPicks = await QobuzProvider.featured.getEditorPicks();

// Most streamed
const mostStreamed = await QobuzProvider.featured.getMostStreamed();

// Qobuz Ideal Discography
const idealDisc = await QobuzProvider.featured.getIdealDiscography();

// Featured playlists
const featuredPlaylists = await QobuzProvider.featured.getFeaturedPlaylists();

// By genre
const jazzReleases = await QobuzProvider.featured.getAlbumsByGenre(10, 'new-releases');

// Genres list
const genres = await QobuzProvider.featured.getGenres();

// Discovery (combined content for homepage)
const discovery = await QobuzProvider.featured.getDiscoveryContent();
```

## Stream URL Functions

### `getStreamUrl(trackId, quality)`

Main function for getting stream URLs. Tries in order:

1. Native Qobuz API (if `QOBUZ_APP_SECRET` is configured)
2. External API: `dab.yeet.su`
3. External API: `dabmusic.xyz`
4. External API: `qobuz.squid.wtf`
5. External API: `qobuzapi.vercel.app`
6. External API: `qobuz.deno.dev`

### `getFileUrl(trackId, quality)`

Direct native Qobuz API call. Requires `QOBUZ_APP_SECRET`. Returns full response including restrictions.

### `getPreviewUrl(trackId, quality)`

Gets 30-second preview URL. Works without authentication. Returns preview metadata including sampling rate and bit depth.

## External Services (Fallback)

The implementation uses external APIs as fallbacks for stream URLs:

- `dab.yeet.su/api/stream` - Primary fallback
- `dabmusic.xyz/api/stream` - Secondary fallback
- `qobuz.squid.wtf/api/download-music` - Tertiary fallback
- `qobuzapi.vercel.app/api/stream` - Fourth fallback
- `qobuz.deno.dev/stream` - Fifth fallback
