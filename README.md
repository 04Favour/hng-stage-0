# Gender Classification API

A lightweight REST API built with NestJS that classifies names by gender using the [Genderize.io](https://genderize.io) API. Returns enriched, processed responses with confidence scoring and full input validation.

---

## Live Demo

**Base URL:** `https://hng-stage-0-ydsm.vercel.app`

```
GET /api/classify?name=favour
```

---

## Tech Stack

- **Framework:** NestJS (TypeScript)
- **Runtime:** Node.js
- **Validation:** class-validator + class-transformer
- **External API:** Genderize.io
- **Deployment:** Vercel

---

## Getting Started

### Prerequisites

- Node.js >= 18
- npm or yarn or pnpm

### Installation

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
pnpm install
```

### Running Locally

```bash
# development
pnpm run start:dev

# production
pnpm run build
pnpm run start:prod
```

The server starts on `http://localhost:3009` by default. Override with the `PORT` environment variable.

---

## API Reference

### `GET /api/classify`

Classifies a name by gender with enriched metadata.

#### Query Parameters

| Parameter | Type   | Required | Description        |
|-----------|--------|----------|--------------------|
| `name`    | string | Yes      | The name to classify |

#### Success Response `200`

```json
{
  "status": "success",
  "data": {
    "name": "favour",
    "gender": "female",
    "probability": 0.84,
    "sample_size": 312,
    "is_confident": true,
    "processed_at": "2026-04-14T10:32:00.000Z"
  }
}
```

#### Field Descriptions

| Field | Description |
|-------|-------------|
| `gender` | `"male"` or `"female"` |
| `probability` | Confidence score from Genderize (0–1) |
| `sample_size` | Number of data points Genderize used |
| `is_confident` | `true` when `probability >= 0.7` AND `sample_size >= 100` |
| `processed_at` | UTC ISO 8601 timestamp generated per request |

---

#### Error Responses

All errors follow a consistent shape:

```json
{
  "status": "error",
  "message": "<description>"
}
```

| Status | Scenario |
|--------|----------|
| `400`  | Missing or empty `name` parameter |
| `400`  | Name has no gender prediction (e.g. gibberish input) |
| `422`  | `name` is not a string |
| `502`  | Genderize.io is unreachable |

---

## Project Structure

```
src/
├── main.ts                   # Bootstrap, CORS, global pipes & filters
├── app.module.ts
├── app.controller.ts         # GET /api/classify
├── app.service.ts            # Business logic & Genderize integration
├── classify.dto.ts           # Input validation (IsString, IsNotEmpty)
└── http-exception.filter.ts  # Unified { status, message } error format
```

---

## Key Design Decisions

**Custom exception filter** — NestJS's default error shape (`{ statusCode, message, error }`) is replaced globally so every error — whether thrown by validation or service logic — returns the same `{ status: "error", message }` structure.

**`exceptionFactory` on ValidationPipe** — distinguishes between a missing name (→ `400`) and a type mismatch (→ `422`) at the pipe level, before the request reaches the controller.

**`encodeURIComponent` on the query** — prevents malformed URLs for names with special characters, spaces, or accents.

**No hardcoded timestamps** — `processed_at` is generated fresh on every request via `new Date().toISOString()`.

---

## CORS

All responses include:

```
Access-Control-Allow-Origin: *
```

Configured via `app.enableCors({ origin: '*' })` in `main.ts`.

---

## License

MIT