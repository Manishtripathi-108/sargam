# Providers

This folder contains provider integrations (e.g., Saavn, Gaana). Providers are responsible for fetching raw data from third-party APIs and mapping it into the core models.

## Responsibilities

- Implement client calls to the external API.
- Validate required fields before mapping (fail fast).
- Map provider-specific responses to core models.
- Normalize audio quality to the core enum (`low`, `medium`, `high`, `lossless`).
- Keep pagination consistent (page starts at 1, central `limit` enforcement).

## Mappers: Required Outputs

- Return core entities without magic defaults. Unknown numeric fields should be `null`.
- `release_date`: use `null` when unknown; do not use placeholders like `0000-01-01`.
- `disc_number` / `track_number`: use `null` when unknown.
- Audio: return normalized `SongAudio` keyed by quality.

## Errors

- Use `AppError` for all provider failures.
- Data corruption from provider should use status `502` and include provider name and entity id.
- Missing entities should throw `notFound(...)` via `assertData(...)`.

## Boundaries: What must not leak

- Raw provider response shapes must not leak outside provider modules.
- Provider-specific pagination keys (e.g., `p`/`n`) must be handled internally.
- Provider-specific audio URL transforms should result in normalized core audio.

## Utilities

- Token extraction helpers live alongside each provider (e.g., `saavn.utils.ts`).
- Use `assertData(res.data, '... not found')` to reduce repeated checks.
