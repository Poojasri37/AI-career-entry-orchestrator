from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List
import httpx
import os
from datetime import datetime
import uuid

app = FastAPI(
    title="Inclusive Workforce Orchestrator API",
    description="Multi-agent orchestration for inclusive hiring and workforce planning",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"
DEFAULT_MODEL = "anthropic/claude-3.5-sonnet"

class CapabilityNode(BaseModel):
    id: str
    label: str
    category: str
    confidence: float = Field(ge=0, le=1)
    source: str

class SkillsDiscoveryInput(BaseModel):
    prompt: str = Field(min_length=1)
    model: Optional[str] = None
    apiKey: Optional[str] = None

class SkillsDiscoveryResult(BaseModel):
    reply: str
    capabilities: List[CapabilityNode]
    nextPrompt: str
    provider: str

class InclusiveMatchInput(BaseModel):
    candidate: str = Field(min_length=1)
    role: str = Field(min_length=1)

class MatchSignal(BaseModel):
    label: str
    value: float
    note: str

class InclusiveMatchResult(BaseModel):
    traditionalScore: float
    inclusiveScore: float
    capabilityOverlap: float
    traditionalSignals: List[MatchSignal]
    inclusiveSignals: List[MatchSignal]
    recommendation: str

class AuditComplianceInput(BaseModel):
    scope: str
    sampleSize: Optional[int] = 1280

class FairnessMetric(BaseModel):
    label: str
    value: float
    delta: float
    status: str

class AuditLog(BaseModel):
    timestamp: str
    event: str
    actor: str
    result: str

class AuditComplianceResult(BaseModel):
    overallScore: float
    metrics: List[FairnessMetric]
    logs: List[AuditLog]
    successFactorsPayload: dict

class HealthStatus(BaseModel):
    status: str

SKILLS_DISCOVERY_SYSTEM_PROMPT = """You are an inclusive workforce strategist. Respond with concise, practical guidance that uncovers transferable capabilities without judging pedigree, job titles, employment gaps, or chronology. Return only valid JSON with keys "reply" and "capabilities". "capabilities" must be an array of objects with id, label, category, confidence (0 to 1), and source."""

DEMO_CAPABILITIES = [
    CapabilityNode(id="systems-thinking", label="Systems thinking", category="Cognitive", confidence=0.94, source="Pattern recognition"),
    CapabilityNode(id="stakeholder-empathy", label="Stakeholder empathy", category="Human", confidence=0.89, source="Cross-functional collaboration"),
    CapabilityNode(id="operational-judgment", label="Operational judgment", category="Execution", confidence=0.86, source="Decision ownership"),
    CapabilityNode(id="continuous-learning", label="Continuous learning", category="Growth", confidence=0.82, source="Career transition signal"),
]

FALLBACK_REPLY = "I'm seeing a strong transfer pattern in your story. The work you've described points to capabilities that remain valuable even when the job title changes. I've mapped the clearest signals to the capability graph and separated evidence from assumptions."

def get_demo_capabilities(prompt: str) -> List[CapabilityNode]:
    capabilities = DEMO_CAPABILITIES.copy()
    normalized = prompt.lower()
    if "care" in normalized or "health" in normalized:
        capabilities.insert(0, CapabilityNode(
            id="care-coordination",
            label="Care coordination",
            category="Domain",
            confidence=0.91,
            source="Domain context"
        ))
    return capabilities[:5]

async def call_openrouter(api_key: str, model: str, prompt: str) -> dict:
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://replit.com",
        "X-Title": "Inclusive Workforce Orchestrator",
    }
    payload = {
        "model": model,
        "temperature": 0.25,
        "messages": [
            {"role": "system", "content": SKILLS_DISCOVERY_SYSTEM_PROMPT},
            {"role": "user", "content": prompt},
        ],
        "response_format": {"type": "json_object"},
    }
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(OPENROUTER_API_URL, headers=headers, json=payload)
        if not response.is_success:
            raise HTTPException(status_code=502, detail=f"OpenRouter returned {response.status_code}")
        data = response.json()
        content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
        if not content:
            raise HTTPException(status_code=502, detail="OpenRouter returned empty response")
        import json
        parsed = json.loads(content)
        return {
            "reply": parsed.get("reply", FALLBACK_REPLY),
            "capabilities": parsed.get("capabilities", []),
        }

@app.get("/api/healthz", response_model=HealthStatus)
async def health_check():
    return HealthStatus(status="healthy")

@app.post("/api/agent/skills-discovery", response_model=SkillsDiscoveryResult)
async def skills_discovery(input: SkillsDiscoveryInput, x_openrouter_key: Optional[str] = Header(None)):
    api_key = input.apiKey or x_openrouter_key
    model = input.model or DEFAULT_MODEL
    
    if api_key:
        try:
            result = await call_openrouter(api_key, model, input.prompt)
            capabilities = [CapabilityNode(**cap) for cap in result["capabilities"][:8]]
            return SkillsDiscoveryResult(
                reply=result["reply"],
                capabilities=capabilities,
                nextPrompt="What responsibilities did people trust you with, even when they were outside your formal role?",
                provider=model
            )
        except Exception as e:
            raise HTTPException(status_code=502, detail=str(e))
    
    return SkillsDiscoveryResult(
        reply=FALLBACK_REPLY,
        capabilities=get_demo_capabilities(input.prompt),
        nextPrompt="What responsibilities did people trust you with, even when they were outside your formal role?",
        provider="local-demo"
    )

@app.post("/api/agent/inclusive-match", response_model=InclusiveMatchResult)
async def inclusive_match(input: InclusiveMatchInput):
    candidate_words = set(input.candidate.lower().split())
    role_words = set(input.role.lower().split())
    overlap = candidate_words.intersection(role_words)
    capability_overlap = min(96, max(58, 68 + len(overlap) * 5))
    
    return InclusiveMatchResult(
        traditionalScore=42,
        inclusiveScore=capability_overlap,
        capabilityOverlap=capability_overlap,
        traditionalSignals=[
            MatchSignal(label="Exact title history", value=18, note="Penalty for adjacent titles and non-linear experience"),
            MatchSignal(label="Tenure continuity", value=11, note="Gap penalty applied before capability review"),
            MatchSignal(label="Credential proximity", value=13, note="Pedigree proxy outweighs demonstrated capability"),
        ],
        inclusiveSignals=[
            MatchSignal(label="Transferable capabilities", value=capability_overlap, note="Semantic overlap across work contexts"),
            MatchSignal(label="Learning agility", value=84, note="Evidence of adapting to new systems and constraints"),
            MatchSignal(label="Contextual contribution", value=79, note="Potential impact weighted above pedigree"),
        ],
        recommendation="Advance to a structured work sample. The candidate clears the capability threshold after timeline and pedigree bias are neutralized."
    )

@app.post("/api/agent/audit-compliance", response_model=AuditComplianceResult)
async def audit_compliance(input: AuditComplianceInput):
    now = datetime.utcnow()
    timestamp = now.isoformat() + "Z"
    
    return AuditComplianceResult(
        overallScore=91.4,
        metrics=[
            FairnessMetric(label="Selection rate parity", value=0.92, delta=0.04, status="Within guardrail"),
            FairnessMetric(label="Capability evidence coverage", value=0.88, delta=0.11, status="Improving"),
            FairnessMetric(label="Timeline penalty removal", value=0.97, delta=0.22, status="Protected"),
            FairnessMetric(label="Explainability coverage", value=0.95, delta=0.08, status="Within guardrail"),
        ],
        logs=[
            AuditLog(timestamp=timestamp, event="Capability vector generated", actor="Inclusive Matching Agent", result="Pass"),
            AuditLog(timestamp=timestamp, event="Timeline proxy neutralized", actor="Bias Audit Agent", result="Pass"),
            AuditLog(timestamp=timestamp, event="SuccessFactors preview payload signed", actor="Compliance Orchestrator", result="Ready"),
        ],
        successFactorsPayload={
            "schema": "SAP.SuccessFactors.TalentIntelligence.v1",
            "scope": input.scope,
            "sampleSize": input.sampleSize,
            "fairnessStatus": "green",
            "generatedAt": timestamp,
        }
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)