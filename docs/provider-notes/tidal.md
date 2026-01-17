# Tidal Provider Implementation Notes

## Source Projects Analysis

### SpotiFLAC-main / spotimeow-main / SpotiFLAC-Mobile-main (Go)
**Files**: `backend/tidal.go`, `go_backend/tidal.go`

All three projects implement similar Tidal functionality:

**Authentication:**
- OAuth2 Client Credentials flow
- Client ID/Secret (base64 encoded in code)
- Auth endpoint: `https://auth.tidal.com/v1/oauth2/token`

**API Endpoints Used:**
- `GET /v1/tracks/{id}` - Track metadata
- `GET /v1/search/tracks` - Search tracks
- Third-party APIs for download URLs (base64 encoded domains)

**Features:**
- Track info by ID
- Search by artist/track name
- ISRC matching
- Album art retrieval
- Download URL fetching (via external APIs)
- Quality selection (HiFi, Master/FLAC)
- Manifest parsing (BTS, DASH/MPD formats)

## Feature Comparison

| Feature | SpotiFLAC/spotimeow | Sargam Implementation |
|---------|---------------------|----------------------|
| Track by ID | ✅ | ✅ |
| Track by ISRC | ✅ (via search) | ✅ |
| Album by ID | ❌ | ✅ |
| Album tracks | ❌ | ✅ |
| Artist by ID | ❌ | ✅ |
| Artist top tracks | ❌ | ✅ |
| Artist albums | ❌ | ✅ |
| Similar artists | ❌ | ✅ |
| Playlist by ID | ❌ | ✅ |
| Playlist tracks | ❌ | ✅ |
| Search all types | ❌ (tracks only) | ✅ |
| Album art URL | ✅ | ✅ |
| Download URLs | ✅ (external APIs) | ❌ |
| Quality selection | ✅ | ❌ |

## Configuration

Required environment variables:
```
TIDAL_CLIENT_ID=your_client_id
TIDAL_CLIENT_SECRET=your_client_secret
TIDAL_COUNTRY_CODE=US  # Optional, defaults to US
```

## API Endpoints

```
# Authentication
POST https://auth.tidal.com/v1/oauth2/token

# Tracks
GET /v1/tracks/{id}?countryCode={code}

# Albums  
GET /v1/albums/{id}?countryCode={code}
GET /v1/albums/{id}/tracks?countryCode={code}&limit={n}&offset={o}

# Artists
GET /v1/artists/{id}?countryCode={code}
GET /v1/artists/{id}/toptracks?countryCode={code}&limit={n}&offset={o}
GET /v1/artists/{id}/albums?countryCode={code}&limit={n}&offset={o}
GET /v1/artists/{id}/similar?countryCode={code}&limit={n}&offset={o}

# Playlists
GET /v1/playlists/{uuid}?countryCode={code}
GET /v1/playlists/{uuid}/tracks?countryCode={code}&limit={n}&offset={o}
GET /v1/playlists/{uuid}/items?countryCode={code}&limit={n}&offset={o}

# Search
GET /v1/search?query={q}&countryCode={code}&limit={n}&offset={o}
GET /v1/search/tracks?query={q}&countryCode={code}&limit={n}&offset={o}
GET /v1/search/albums?query={q}&countryCode={code}&limit={n}&offset={o}
GET /v1/search/artists?query={q}&countryCode={code}&limit={n}&offset={o}
GET /v1/search/playlists?query={q}&countryCode={code}&limit={n}&offset={o}
```

## URL Patterns

Tidal URLs:
- Tracks: `https://listen.tidal.com/track/{id}` or `https://tidal.com/browse/track/{id}`
- Albums: `https://listen.tidal.com/album/{id}` or `https://tidal.com/browse/album/{id}`
- Artists: `https://listen.tidal.com/artist/{id}` or `https://tidal.com/browse/artist/{id}`
- Playlists: `https://listen.tidal.com/playlist/{uuid}` or `https://tidal.com/browse/playlist/{uuid}`

Track/Album/Artist IDs are numeric. Playlist IDs are UUIDs (8-4-4-4-12 format).

## Album Art

Album art URLs:
```
https://resources.tidal.com/images/{uuid}/{size}.jpg
```

Sizes: 160x160, 320x320, 640x640, 1280x1280

The cover UUID from API uses hyphens, but URLs use slashes:
- API returns: `ab12cd34-ef56-gh78-ij90-klmnopqrstuv`
- URL format: `ab12cd34/ef56/gh78/ij90/klmnopqrstuv`

## Audio Quality Levels

Tidal quality levels (from mediaMetadata.tags):
- `LOSSLESS` - CD quality (16-bit/44.1kHz FLAC)
- `HIRES_LOSSLESS` - Hi-Res (up to 24-bit/192kHz FLAC)
- `MQA` - Master Quality Authenticated
- `DOLBY_ATMOS` - Dolby Atmos

## Notes

1. **No Public API**: Tidal doesn't have an official public API. The client credentials approach requires registered app credentials.

2. **Country Code**: All requests require a `countryCode` parameter. Content availability varies by region.

3. **Pagination**: Uses `limit` and `offset` parameters. Response includes `totalNumberOfItems`.

4. **Download URLs**: The reference implementations use external third-party services (base64 encoded) for getting download URLs. This is not implemented in Sargam as it's a metadata-focused provider.

5. **ISRC Matching**: The reference implementations prioritize ISRC matching when searching to ensure the correct track is found.

6. **Token Caching**: Access tokens are cached and refreshed before expiration (5 minute buffer).

## External Services (Not Implemented)

The SpotiFLAC projects use these external APIs for download URLs:
- DoubleDouble (doubledouble.top)
- Various QQDL servers
- Kinopluus
- Binimum
- Squid

These are download-focused services, not metadata APIs, and are not part of Sargam's implementation.
