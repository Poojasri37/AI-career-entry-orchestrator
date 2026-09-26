# AI Career Entry Orchestrator (Inclusive Workforce Hub)

Multi-agent orchestration for inclusive hiring, skills discovery, and workforce planning — a React (Vite) workspace backed by a FastAPI agent service, with SAP BTP / Master Data Integration as the enterprise master-data backbone.

---

## SAP Architecture: Connecting an External System to SAP Master Data Integration (MDI)

Connecting an external system to SAP for Master Data (MD) integration typically utilizes **SAP Business Technology Platform (BTP)** and **SAP Master Data Integration (MDI)**, which acts as the central hub using the **SAP One Domain Model**.

Below is a step-by-step, click-by-click guide to setting up and linking an external system to SAP MDI.

```
 ┌──────────────────────┐         ┌─────────────────────────────────────────────┐
 │  External System     │  OAuth2 │  SAP BTP                                     │
 │  (HR / ERP / App)    ├────────►│  ┌─────────────────────────────────────┐    │
 └──────────────────────┘         │  │ Service Instance: Master Data       │    │
                                  │  │ Integration (MDI)                    │    │
 ┌──────────────────────┐  HTTP   │  │  businessSystemId: EXTERNAL_SYS_01  │    │
 │ SAP Integration      ├────────►│  └───────────────┬─────────────────────┘    │
 │ Suite (iFlow)        │         │                  │ SAP One Domain Model      │
 └──────────────────────┘         │  ┌───────────────▼─────────────────────┐    │
                                  │  │ Distribution Model (Push / Pull)    │    │
                                  │  │ Provider: SAP  → Consumer: Ext Sys  │    │
                                  │  └───────────────┬─────────────────────┘    │
                                  │                  │                          │
                                  │  ┌───────────────▼─────────────────────┐    │
                                  │  │ Destinations (Connectivity)         │    │
                                  │  └─────────────────────────────────────┘    │
                                  └─────────────────────────────────────────────┘
```

### Phase 1: Set Up the Service Instance in SAP BTP

First, you need to provision the Master Data Integration service so external systems have a secure landing zone to push or pull data.

1. **Log in to the SAP BTP Cockpit:** Navigate to your global account and open your specific subaccount.
2. **Access the Service Marketplace:**
   - On the left-hand navigation menu, click on **Service Marketplace**.
   - Type **Master Data Integration** into the search bar.
3. **Create the Instance:**
   - Click on the **Master Data Integration** tile.
   - Click the **Create** button.
   - In the wizard popup, select your **Cloud Foundry Runtime Environment** and target **Space**.
   - Give your instance a recognizable name (e.g., `Ext-System-MDI-Instance`).
4. **Configure Parameters (JSON):** In the parameters step, enter the required JSON payload to define your external business system identifier:

   ```json
   {
     "businessSystemId": "EXTERNAL_SYS_01",
     "enableTenantDeletion": false
   }
   ```

   Click **Create**.
5. **Generate Service Keys:**
   - Once the instance status changes to **Created**, click on it and navigate to the **Service Keys** tab.
   - Click **Create Service Key**, name it (e.g., `MDI-Service-Key`), and save.
   - View and copy the generated credentials (specifically the `clientid`, `clientsecret`, `url`, and `uaa/url`). You will use these to authenticate your external system.

### Phase 2: Configure Connectivity & Destinations on BTP

To allow data routing between SAP and your external application, configure a destination point.

1. **Navigate to Destinations:** In your BTP subaccount sidebar, go to **Connectivity > Destinations**.
2. **Create New Destination:** Click **New Destination** and fill out the fields based on your external system type (REST/SOAP/OData):
   - **Name:** `MDI_External_Destination`
   - **Type:** `HTTP`
   - **URL:** Enter the endpoint URL of your external system or SAP Integration Suite.
   - **Authentication:** Choose `OAuth2ClientCredentials` (or `BasicAuthentication` depending on the external system).
   - **Client ID & Client Secret:** Paste the credentials from your external system or service key.
3. **Save:** Click **Save** and test the connection using the **Check Connection** button.

### Phase 3: Set Up the Integration Flow (SAP Integration Suite / Cloud Integration)

If your external system does not connect directly via API, route it through SAP Cloud Integration.

1. **Open SAP Integration Suite:** Go to your Integration Suite tenant home page and open **Design > Integrations**.
2. **Configure the iFlow (Integration Flow):**
   - Copy or create an integration package for master data (e.g., Business Partners or Products).
   - Go to **Security Material**, click **Create**, and select **OAuth2 Credentials**. Enter your MDI Token URL, Client ID, and Client Secret, then click **Deploy**.
   - Map the fields from the external payload schema to match the **SAP One Domain Model** standard fields (e.g., ensuring `BusinessPartner` fields line up correctly).
3. **Deploy the iFlow:** Save your configurations and click **Deploy** to activate the message routing path.

### Phase 4: Configure Data Distribution (Orchestration)

Tell SAP what specific master data objects (like Customers, Materials, or Cost Centers) are allowed to flow to this external system.

1. **Open Master Data Orchestration / Distribution Model:** Access your distribution management tool or app within your SAP landscape (such as the **Manage Distribution Model** app).
2. **Create a Distribution Model:**
   - Click **Create**.
   - Specify a **Model Name** and choose the **Business Object Type** (e.g., Business Partner or Product).
   - Set the distribution mode to **Push** or **Pull** and define your package size (e.g., `50`).
   - Check **Continuous Distribution** if data should sync in real-time.
3. **Assign Systems:**
   - Select the **Provider Interface**.
   - Link your SAP source as the provider and your newly created external business system (`EXTERNAL_SYS_01`) as the consumer destination.
4. **Save and Activate:** Click **Save**, review any data filter criteria (such as company code or plant-specific splits), and click **Activate**.

### Phase 5: Test the Integration

1. Trigger a test payload creation or update in either your external system or SAP.
2. Go to **Monitoring > Message Monitoring** in your Integration Suite or BTP dashboard to verify that the master data message transferred successfully without payload mapping errors.

---

## Project Overview

The **Inclusive Workforce Hub** keeps human judgment in the loop while specialized AI agents surface the invisible signal in hiring and workforce decisions.

### Features

| Agent | Endpoint | Purpose |
| --- | --- | --- |
| Skills Discovery | `POST /api/agent/skills-discovery` | Turns a candidate's background into a structured capability graph |
| Inclusive Match | `POST /api/agent/inclusive-match` | Compares traditional fit scoring against capability-overlap scoring |
| Audit & Compliance | `POST /api/agent/audit-compliance` | Reviews hiring output for bias indicators and compliance gaps |
| Health | `GET /api/healthz` | Service liveness check |

## Stack

- **Frontend:** React 19 + Vite + TypeScript, Tailwind CSS v4, Radix UI, TanStack Query, Recharts, wouter
- **Backend:** Python FastAPI + Uvicorn, Pydantic v2, httpx
- **AI:** OpenRouter (`anthropic/claude-3.5-sonnet` by default)
- **Workspace:** pnpm workspaces, TypeScript 5.9

## Getting Started

### Backend (FastAPI)

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env   # then fill in your keys
uvicorn main:app --reload --port 8000
```

`backend/.env`:

```env
OPENROUTER_API_KEY=sk-or-v1-...
PORT=8000
```

> **Never commit `.env` files.** They are git-ignored; keep real credentials out of history.

### Frontend

```powershell
pnpm install
pnpm --filter @workspace/inclusive-workforce-orchestrator run dev
```

### Checks

```powershell
pnpm run typecheck   # typecheck across all packages
pnpm run build       # typecheck + build all packages
```

## Repository Layout

```
backend/                                  FastAPI agent service (main.py)
artifacts/
  inclusive-workforce-orchestrator/       Main React app (Vite)
  mockup-sandbox/                         Design sandbox app
scripts/                                  Workspace tooling
lib/                                      Shared libraries
```

## Environment Variables

| Variable | Where | Description |
| --- | --- | --- |
| `OPENROUTER_API_KEY` | `backend/.env` | API key for OpenRouter model calls |
| `PORT` | `backend/.env` | Backend port (default `8000`) |

## License

MIT
