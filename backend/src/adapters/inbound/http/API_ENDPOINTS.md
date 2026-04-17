# FuelEU Maritime API Endpoints

Base URL: `/api`

## Routes Endpoints

### Get All Routes
```
GET /api/routes
```
**Query Parameters:**
- `vesselType` (optional) - Filter by vessel type (string)
- `fuelType` (optional) - Filter by fuel type (string)
- `year` (optional) - Filter by year (integer, 2000-3000)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [Route[]],
  "count": number
}
```

---

### Set Baseline Route
```
POST /api/routes/:routeId/baseline
```
**Path Parameters:**
- `routeId` (required) - The route ID to set as baseline

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Route {routeId} set as baseline",
  "data": Route
}
```

**Error Response:** `404 Not Found`
```json
{
  "success": false,
  "error": "Route with ID {routeId} not found"
}
```

---

### Get Route Comparison
```
GET /api/routes/comparison
```
**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "comparisons": RouteComparison[],
    "target": number
  }
}
```

**Error Response:** `404 Not Found`
```json
{
  "success": false,
  "error": "No baseline route set. Please set a baseline first."
}
```

---

## Compliance Endpoints

### Get Compliance Balance
```
GET /api/compliance/cb
```
**Query Parameters:**
- `shipId` (required) - Ship identifier (string)
- `year` (required) - Year (integer, 2000-3000)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "shipId": string,
    "year": number,
    "cbBefore": number,
    "applied": number,
    "cbAfter": number
  }
}
```

---

### Get Adjusted Compliance Balance
```
GET /api/compliance/adjusted-cb
```
**Query Parameters:**
- `shipId` (required) - Ship identifier (string)
- `year` (required) - Year (integer, 2000-3000)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "shipId": string,
    "year": number,
    "cbBefore": number,
    "applied": number,
    "cbAfter": number
  }
}
```

---

## Banking Endpoints

### Get Bank Records
```
GET /api/banking/records
```
**Query Parameters:**
- `shipId` (required) - Ship identifier (string)
- `year` (required) - Year (integer, 2000-3000)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": BankEntry[],
  "count": number
}
```

---

### Bank Surplus
```
POST /api/banking/bank
```
**Request Body:**
```json
{
  "shipId": string,
  "year": number,
  "amount": number
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Successfully banked {amount} gCO2eq for ship {shipId} in year {year}",
  "data": BankEntry
}
```

**Error Responses:**
- `400 Bad Request` - Invalid input or business logic error
  - Amount must be positive
  - Ship has no surplus to bank
  - Amount exceeds available surplus
- `404 Not Found` - Ship/year compliance data not found

---

### Apply Banked Surplus
```
POST /api/banking/apply
```
**Request Body:**
```json
{
  "shipId": string,
  "year": number,
  "amount": number
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Successfully applied {amount} gCO2eq from banked surplus for ship {shipId} in year {year}",
  "data": {
    "shipId": string,
    "year": number,
    "cbBefore": number,
    "applied": number,
    "cbAfter": number
  }
}
```

**Error Responses:**
- `400 Bad Request` - Invalid input or insufficient banked balance
- `404 Not Found` - Ship/year compliance data not found

---

## Pooling Endpoints

### Create Pool
```
POST /api/pools
```
**Request Body:**
```json
{
  "year": number,
  "members": [
    {
      "shipId": string,
      "cbBefore": number
    }
  ]
}
```

**Validation:**
- `year` - Required, integer between 2000-3000
- `members` - Required, array with minimum 2 members
- Each member must have `shipId` (string) and `cbBefore` (number)

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Successfully created pool for year {year} with {count} members",
  "data": {
    "id": number,
    "year": number,
    "createdAt": string,
    "members": [
      {
        "id": number,
        "poolId": number,
        "shipId": string,
        "cbBefore": number,
        "cbAfter": number
      }
    ]
  }
}
```

**Error Responses:**
- `400 Bad Request` - Pool validation failed
  - Pool must have at least 2 members
  - Pool sum must be non-negative
  - Invalid member data

---

## Common Response Formats

### Success Response
```json
{
  "success": true,
  "data": any,
  "message": string (optional)
}
```

### Error Response
```json
{
  "success": false,
  "error": string
}
```

### Validation Error Response
```json
{
  "errors": [
    {
      "msg": string,
      "param": string,
      "location": string
    }
  ]
}
```

---

## HTTP Status Codes

- `200 OK` - Successful GET/PUT/PATCH request
- `201 Created` - Successful POST request that creates a resource
- `400 Bad Request` - Validation error or business logic error
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Unexpected server error

---

## Example cURL Commands

### Get all routes for Container ships in 2025
```bash
curl -X GET "http://localhost:3000/api/routes?vesselType=Container&year=2025"
```

### Set route as baseline
```bash
curl -X POST "http://localhost:3000/api/routes/R001/baseline"
```

### Get compliance balance
```bash
curl -X GET "http://localhost:3000/api/compliance/cb?shipId=SHIP001&year=2025"
```

### Bank surplus
```bash
curl -X POST "http://localhost:3000/api/banking/bank" \
  -H "Content-Type: application/json" \
  -d '{"shipId":"SHIP001","year":2025,"amount":5000}'
```

### Create a pool
```bash
curl -X POST "http://localhost:3000/api/pools" \
  -H "Content-Type: application/json" \
  -d '{
    "year": 2025,
    "members": [
      {"shipId": "SHIP001", "cbBefore": 15000},
      {"shipId": "SHIP002", "cbBefore": -10000}
    ]
  }'
```
