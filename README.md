## Setup Instructions

### Prerequisites

- Node.js (v18 or above)
- MongoDB (running locally or in the cloud, e.g., MongoDB Atlas)
- Redis (for queue-based log processing)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. Install dependencies:

   ```bash
   yarn
   ```

3. Configure environment variables:
   Create a `.env` file at the root of the project and configure the following variables:

   ```env
   NODE_ENV=development
   SERVER_PORT=3000
   DB_URI=mongodb://localhost:27017/api-logs
   REDIS_URI=redis://default:<password>@localhost:6379
   ```

4. Start MongoDB and Redis:
   Ensure both services are running.

5. Start the application:

   ```bash
   npm run start
   ```

6. Run tests:
   ```bash
   npm run test
   ```

---

## Sample API Requests and Responses

### 1. POST /logs

**Description**: Log an API request.

**Request:**

```json
{
  "endpoint": "/api/resource",
  "method": "GET",
  "userId": "user123",
  "timestamp": "2024-12-18T12:34:56.789Z"
}
```

**Response:**

```json
{
  "message": "Log queued for processing"
}
```

### 2. GET /analytics/summary

**Description**: Fetch API usage summary.

**Response:**

```json
{
    "totalRequestsPerEndpoint": [
        {
            "_id": "https://bruised-effector.name/",
            "totalRequests": 5173
        },
        {
            "_id": "https://monstrous-academics.com",
            "totalRequests": 5149
        },
        ...All Endpoints
    ],
    "mostAccessed": "https://bruised-effector.name/"
}
```

### 3. GET /analytics/user/:userId

**Description**: Fetch user-specific analytics.

**Response:**

```json
{
    "totalRequests": 5004,
    "endpoints": [
        {
            "endpoint": "https://funny-stump.info",
            "totalRequests": 23
        },
        {
            "endpoint": "https://blushing-cheetah.info/",
            "totalRequests": 29
        },
        ...All Endpoints accessed
    ]
}
```

### 4. GET /logs

**Description**: Fetch logs with filtering and pagination.

**Request Query Params:**

```txt
endpoint=https://obedient-eternity.com
userId=bce10bae5e7a64afd773616f
startDate=2023-12-11T21:19:25.792Z
endDate=2024-12-10T21:19:25.792Z
page=1
limit=20
```

**Response:**

```json
[
    {
        "id": "67640931e5b4756db7b5943f",
        "endpoint": "https://obedient-eternity.com",
        "method": "GET",
        "userId": "bce10bae5e7a64afd773616f",
        "timestamp": "2024-12-10T16:43:23.645Z"
    },
    {
        "id": "676405d527873c367662c20e",
        "endpoint": "https://obedient-eternity.com",
        "method": "DELETE",
        "userId": "bce10bae5e7a64afd773616f",
        "timestamp": "2024-12-09T16:11:49.394Z"
    },
    {
        "id": "676405d427873c367661e7b4",
        "endpoint": "https://obedient-eternity.com",
        "method": "GET",
        "userId": "bce10bae5e7a64afd773616f",
        "timestamp": "2024-12-08T08:10:00.849Z"
    },
    ... 17 more results
]
```

---

## MongoDB Schema Design

### Collection: `ApiLogs`

**Schema:**

```json
{
  "endpoint": { "type": "string", "index": true },
  "method": { "type": "string" },
  "userId": { "type": "string", "index": true },
  "timestamp": { "type": "date", "index": true }
}
```

### Indexing

1. **Compound Index:** `{ userId: 1, timestamp: -1 }` for fast filtering by user and time.
2. **Single Index:** `endpoint` to optimize endpoint-based analytics.

---

## Optimization Strategies

### Query Optimization

- Using the aggregation pipelines with `$match` and `$group` stages for filtering and summarizing data efficiently.
- Leveraging MongoDB’s indexes to minimize query execution time.

### Storage Optimization

- We can use a capped collection for active logs to limit size and improve write performance.
- Archiving older logs (older than 30 days) to a separate collection using a worker process.

### Scalability

- Implemented batch writes to handle high write throughput for the `/logs` endpoint.
- Employing Bull Queue to decouple logging from analytics queries and ensure asynchronous processing.

---
