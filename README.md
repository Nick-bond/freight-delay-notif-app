## Freight Delay APP  

### Local development:

## NOTE for test we need to use origin lat/log and destination lat/log coordinates as example `40.7128,-74.0060` and `34.0522,-118.2437`

#### Update local .env file by adding value to:
```bash
TRAFFIC_API_KEY='TRAFFIC_API_KEY'
OPENAI_API_KEY='OPENAI_API_KEY'
TWILIO_ACCOUNT_SID='TWILIO_ACCOUNT_SID'
TWILIO_AUTH_TOKEN='TWILIO_AUTH_TOKEN'
TWILIO_MESSAGING_SERVICE_SID='TWILIO_MESSAGING_SERVICE_SID'
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

#### Build the app

```bash
npm run dev
```

#### for test run:

```bash
npm run test
```


Open [http://localhost:3000](http://localhost:3000) with your browser.

Project Structure 

freight-delay-notif-app/
├─ app/
│  └─ api/
│     └─ freight-delay/
│        └─ freight-delay.ts      <-- An API route that triggers the Temporal workflow
├─ lib/
│  ├─ temporal/
│  │  ├─ activities.ts    <-- Activities: fetch traffic data, AI message generation, send notification
│  │  ├─ workflows.ts     <-- Orchestration workflow definition
│  │  └─ worker.ts        <-- Temporal Worker entry point (runs separately)
│  └─ logger/           <-- Logger utility
├─ pages/
│  ├─ api/
│  │  └─ freight-delay.ts        <-- api route for post request (/api/freight-delay)
│  ├─ _app.tsx           <-- app page
│  └─ index.tsx           <-- index page
├─ .env.sample
├─ package.json
├─ tsconfig.json
└─ ...

### APP 
2. Activities (lib/temporal/activities.ts)

Fetches traffic data from a Mapbox or Google Maps service, calculates delay, and so on.

3. Workflow (lib/temporal/workflows.ts)

We define the orchestration using Temporal’s workflow which accept origin, destination, and contact as
parameters.

4. Temporal Worker (lib/temporal/worker.ts)

A standalone Node.js process that registers and runs the activities.

5. Next.js API Route (/pages/api/freight-delay.ts)

When the user submits a form in Next.js, we’ll POST to /api/freight-delay. That route will start 
the Temporal workflow, passing in the data from the form.

6. The Next.js Page (app/traffic/page.tsx)

This page renders a form where the user can:
•	Enter an origin (could be a city name, address, lat/lon, etc.).
•	Enter a destination.
•	Enter an email or phone number (the contact).
•	Submit the form to the /api/freight-delay endpoint.

