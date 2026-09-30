# CivicConnect API v1

## Purpose

The API provides the HTTP boundary between the client-facing application and the CivicConnect backend.

## Base Path

/api/v1

## Initial Endpoint

### Change Request Status

PATCH

/api/v1/requests/:id/status

### Request Body

```json
{
  "status": "Accepted"
}