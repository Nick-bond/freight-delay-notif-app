## Freight Delay APP  

### Local development:

#### Update local .env file by adding value to:
```bash

```

#### Install packages

```bash
npm install
```

#### Run temporal server required for workers

```bash
brew install temporal 
temporal server start-dev
```

#### Run workers

```bash
npm run start-worker
```

```bash
npm run dev
```

for test run:

```bash

```


Open [http://localhost:3000](http://localhost:3000) with your browser.

Project Structure 

freight-delay-notif-app/
├─ app/
│  ├─ page/
│  │  └─ traffic.tsx         <-- A Next.js page with a form for route & contact info
│  └─ api/
│     └─ freight-delay/
│        └─ freight-delay.ts      <-- An API route that triggers the Temporal workflow
├─ lib/
│  ├─ temporal/
│  │  ├─ activities.ts    <-- SDK: fetch traffic data, AI message generation, send notification
│  │  ├─ workflows.ts     <-- Orchestration workflow definition
│  │  └─ worker.ts        <-- Temporal Worker entry point (runs separately)
│  └─ index.ts           <-- Logger utility
├─ pages/
│  ├─ api/
│  │  └─ freight-delay.ts        <-- api route for post request (/api/freight-delay)
│  ├─ _app.tsx           <-- Logger utility
│  └─ index.tsx           <-- Logger utility
├─ .env.local
├─ package.json
├─ tsconfig.json
└─ ...

### SDK 
2. Activities (lib/temporal/activities.ts)

Below is an updated activity that fetches traffic data from a Mapbox or Google Maps service, 
calculates delay, and so on. (Here we show a mock snippet for Mapbox, but you can adapt it for 
Google Maps’ Directions API with traffic.)

3. Workflow (lib/temporal/workflows.ts)

We define the orchestration using Temporal’s workflow. Notice we now accept origin, destination, and contact as
parameters rather than a routeId.

4. Temporal Worker (lib/temporal/worker.ts)

A standalone Node.js process that registers and runs the activities. You can start this with a script like
"start-worker": "ts-node lib/temporal/worker.ts" in your package.json.

5. Next.js API Route (/api/freight-delay/freight-delay.ts)

When the user submits a form in Next.js, we’ll POST to /api/freight-delay. That route will start 
the Temporal workflow, passing in the data from the form.

6. The Next.js Page (app/traffic/page.tsx)

This page renders a form where the user can:
•	Enter an origin (could be a city name, address, lat/lon, etc.).
•	Enter a destination.
•	Enter an email or phone number (the contact).
•	Submit the form to the /api/freight-delay endpoint.

