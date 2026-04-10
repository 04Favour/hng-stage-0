# Gender Classification API

A NestJS REST API that predicts the gender of a given name using the [Genderize.io](https://genderize.io) external service. It returns the predicted gender, probability score, sample size, and a confidence flag.

---

## Live Demo

```
https://hng-stage-0-ydsm.vercel.app/api/classify/?name=favour
```

---

## Tech Stack

- [NestJS](https://nestjs.com/) — Node.js framework
- [class-validator](https://github.com/typestack/class-validator) — DTO validation
- [Genderize.io API](https://genderize.io/) — External gender prediction service
- Deployed on [Vercel](https://vercel.com/)

---

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm

### Installation

```bash
git clone <your-repo-url>
cd <project-folder>
pnpm install
```

### Running the App

```bash
# Development (watch mode)
pnpm run start:dev

```

The server starts on `http://localhost:3009` by default.

---

## API Reference

### `GET /api/classify`

Predicts the gender of a given first name.

#### Query Parameters

| Parameter | Type   | Required | Description                        |
|-----------|--------|----------|------------------------------------|
| `name`    | string | Yes      | A name containing only letters (a–z, A–Z) |

#### Success Response — `200 OK`

```json
{
  "status": "success",
  "data": {
    "name": "favour",
    "gender": "female",
    "probability": 0.97,
    "sample_size": 964,
    "is_confident": true,
    "processed_at": "2026-04-10T17:38:03.000Z"
  }
}
```

| Field          | Type    | Description                                                                 |
|----------------|---------|-----------------------------------------------------------------------------|
| `name`         | string  | The name that was queried                                                   |
| `gender`       | string  | Predicted gender: `"male"` or `"female"`                                    |
| `probability`  | number  | Confidence score from Genderize.io (0–1)                                    |
| `sample_size`  | number  | Number of records used to make the prediction                               |
| `is_confident` | boolean | `true` if probability ≥ 0.7 **and** sample size ≥ 100, otherwise `false`   |
| `processed_at` | string  | ISO 8601 timestamp of when the request was processed                        |

#### Error Responses

| Status | Scenario                                          | Message                                      |
|--------|---------------------------------------------------|----------------------------------------------|
| `400`  | `name` query param is missing or empty            | `Please provide name`                        |
| `400`  | `name` contains non-alphabetic characters         | `Name must be string`                        |
| `400`  | Genderize.io has no data for the provided name    | `No prediction available for the provided name` |
| `502`  | Genderize.io is unreachable                       | `The external service is currently unreachable` |
| `502`  | Unexpected error during processing                | `Unable to continue with your request`       |

#### Error Response Shape

```json
{
  "message": "No prediction available for the provided name",
  "error": "Bad Request",
  "statusCode": 400
}
```

---

## Confidence Logic

The `is_confident` flag is determined by the following rule:

```
is_confident = (probability >= 0.7) AND (sample_size >= 100)
```

This means a prediction is only considered reliable if Genderize.io is at least 70% confident **and** based on a reasonably large sample.

---

## Project Structure

```
src/
├── app.controller.ts   # Route handler — GET /api/classify
├── app.service.ts      # Business logic and Genderize.io integration
├── app.module.ts       # NestJS module wiring
├── classify.dto.ts     # Input validation (DTO)
└── main.ts             # App entry point
```

---

## Example Requests

```bash
# Valid name
curl "http://localhost:3009/api/classify?name=james"

# Missing name — returns 400
curl "http://localhost:3009/api/classify"

# Non-alphabetic name — returns 400
curl "http://localhost:3009/api/classify?name=j4mes"
```