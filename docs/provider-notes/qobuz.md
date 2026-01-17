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

| Feature | SpotiFLAC/spotimeow | Sargam Implementation |
|---------|---------------------|----------------------|
| Track by ID | ❌ | ✅ |
| Track by ISRC | ✅ (via search) | ✅ |
| Track search | ✅ | ✅ |
| Album by ID | ❌ | ✅ |
| Album tracks | ❌ | ✅ |
| Album search | ❌ | ✅ |
| Album by UPC | ❌ | ✅ |
| Artist by ID | ❌ | ✅ |
| Artist albums | ❌ | ✅ |
| Artist search | ❌ | ✅ |
| Playlist by ID | ❌ | ✅ |
| Playlist tracks | ❌ | ✅ |
| Playlist search | ❌ | ✅ |
| Catalog search (all) | ❌ | ✅ |
| Download URLs | ✅ (external APIs) | ❌ |
| Quality selection | ✅ | ❌ (constants only) |

## Configuration

Optional environment variable:
```
QOBUZ_APP_ID=798273057  # Optional, uses default if not set
```

## API Endpoints

```
# Track
GET /track/get?track_id={id}&app_id={appId}
GET /track/search?query={q}&limit={n}&offset={o}&app_id={appId}

# Album
GET /album/get?album_id={id}&app_id={appId}
GET /album/search?query={q}&limit={n}&offset={o}&app_id={appId}

# Artist
GET /artist/get?artist_id={id}&app_id={appId}
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

5. **External Download APIs**: The reference implementations use external APIs (base64 encoded) for getting actual download URLs. These are not implemented in Sargam.

## External Services (Not Implemented)

The SpotiFLAC projects use external APIs for download URLs:
- `dab.yeet.su` - Primary Qobuz download API
- Various fallback services

These are download-focused services and not part of Sargam's metadata-focused implementation.
