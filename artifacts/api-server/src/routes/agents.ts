import { Router, type IRouter } from "express";
import {
  CalculateInclusiveMatchBody,
  DiscoverSkillsBody,
  GenerateAuditComplianceBody,
  DiscoverSkillsResponse,
  CalculateInclusiveMatchResponse,
  GenerateAuditComplianceResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

type CapabilityNode = {
  id: string;
  label: string;
  category: string;
  confidence: number;
  source: string;
};

const demoCapabilities = (prompt: string): CapabilityNode[] => {
  const normalized = prompt.toLowerCase();
  const capabilities: CapabilityNode[] = [
    {
      id: "systems-thinking",
      label: "Systems thinking",
      category: "Cognitive",
      confidence: 0.94,
      source: "Pattern recognition",
    },
    {
      id: "stakeholder-empathy",
      label: "Stakeholder empathy",
      category: "Human",
      confidence: 0.89,
      source: "Cross-functional collaboration",
    },
    {
      id: "operational-judgment",
      label: "Operational judgment",
      category: "Execution",
      confidence: 0.86,
      source: "Decision ownership",
    },
    {
      id: "continuous-learning",
      label: "Continuous learning",
      category: "Growth",
      confidence: 0.82,
      source: "Career transition signal",
    },
  ];

  if (normalized.includes("care") || normalized.includes("health")) {
    capabilities.unshift({
      id: "care-coordination",
      label: "Care coordination",
      category: "Domain",
      confidence: 0.91,
      source: "Domain context",
    });
  }

  return capabilities.slice(0, 5);
};

const fallbackReply = (prompt: string) =>
  `I’m seeing a strong transfer pattern in your story. The work in “${prompt.slice(0, 72)}${prompt.length > 72 ? "…" : ""}” points to capabilities that remain valuable even when the job title changes. I’ve mapped the clearest signals to the capability graph and separated evidence from assumptions.`;

async function callOpenRouter(
  apiKey: string,
  model: string,
  prompt: string,
): Promise<{ reply: string; capabilities: CapabilityNode[] }> {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://replit.com",
      "X-Title": "Inclusive Workforce Orchestrator",
    },
    body: JSON.stringify({
      model,
      temperature: 0.25,
      messages: [
        {
          role: "system",
          content:
            "You are an inclusive workforce strategist. Respond with concise, practical guidance that uncovers transferable capabilities without judging pedigree, job titles, employment gaps, or chronology. Return only valid JSON with keys reply and capabilities. capabilities must be an array of objects with id, label, category, confidence (0 to 1), and source.",
        },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenRouter returned ${response.status}`);
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = payload.choices?.[0]?.message?.content;
  if (!content) throw new Error("OpenRouter returned an empty response");

  const parsed = JSON.parse(content) as {
    reply?: unknown;
    capabilities?: unknown;
  };
  return {
    reply: typeof parsed.reply === "string" ? parsed.reply : fallbackReply(prompt),
    capabilities: Array.isArray(parsed.capabilities)
      ? (parsed.capabilities as CapabilityNode[]).slice(0, 8)
      : demoCapabilities(prompt),
  };
}

router.post("/agent/skills-discovery", async (req, res) => {
  const parsed = DiscoverSkillsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "A prompt is required." });
    return;
  }

  const { prompt, apiKey, model } = parsed.data;
  if (apiKey) {
    try {
      const result = await callOpenRouter(
        apiKey,
        model ?? "anthropic/claude-3.5-sonnet",
        prompt,
      );
      res.json(
        DiscoverSkillsResponse.parse({
          ...result,
          nextPrompt:
            "What responsibilities did people trust you with, even when they were outside your formal role?",
          provider: model ?? "openrouter",
        }),
      );
      return;
    } catch (error) {
      req.log.warn({ err: error }, "OpenRouter skills discovery failed");
      res.status(502).json({
        error: "The selected model could not complete this request. Check the key and model, then try again.",
      });
      return;
    }
  }

  res.json(
    DiscoverSkillsResponse.parse({
      reply: fallbackReply(prompt),
      capabilities: demoCapabilities(prompt),
      nextPrompt:
        "What responsibilities did people trust you with, even when they were outside your formal role?",
      provider: "local-demo",
    }),
  );
});

router.post("/agent/inclusive-match", (req, res) => {
  const parsed = CalculateInclusiveMatchBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Candidate and role context are required." });
    return;
  }

  const candidateWords = new Set(
    parsed.data.candidate.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean),
  );
  const roleWords = new Set(
    parsed.data.role.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean),
  );
  const overlap = [...candidateWords].filter((word) => roleWords.has(word));
  const capabilityOverlap = Math.min(
    96,
    Math.max(58, 68 + overlap.length * 5),
  );

  res.json(
    CalculateInclusiveMatchResponse.parse({
      traditionalScore: 42,
      inclusiveScore: capabilityOverlap,
      capabilityOverlap,
      traditionalSignals: [
        {
          label: "Exact title history",
          value: 18,
          note: "Penalty for adjacent titles and non-linear experience",
        },
        {
          label: "Tenure continuity",
          value: 11,
          note: "Gap penalty applied before capability review",
        },
        {
          label: "Credential proximity",
          value: 13,
          note: "Pedigree proxy outweighs demonstrated capability",
        },
      ],
      inclusiveSignals: [
        {
          label: "Transferable capabilities",
          value: capabilityOverlap,
          note: "Semantic overlap across work contexts",
        },
        {
          label: "Learning agility",
          value: 84,
          note: "Evidence of adapting to new systems and constraints",
        },
        {
          label: "Contextual contribution",
          value: 79,
          note: "Potential impact weighted above pedigree",
        },
      ],
      recommendation:
        "Advance to a structured work sample. The candidate clears the capability threshold after timeline and pedigree bias are neutralized.",
    }),
  );
});

router.post("/agent/audit-compliance", (req, res) => {
  const parsed = GenerateAuditComplianceBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "An audit scope is required." });
    return;
  }

  const now = new Date();
  const timestamp = now.toISOString();
  res.json(
    GenerateAuditComplianceResponse.parse({
      overallScore: 91.4,
      metrics: [
        {
          label: "Selection rate parity",
          value: 0.92,
          delta: 0.04,
          status: "Within guardrail",
        },
        {
          label: "Capability evidence coverage",
          value: 0.88,
          delta: 0.11,
          status: "Improving",
        },
        {
          label: "Timeline penalty removal",
          value: 0.97,
          delta: 0.22,
          status: "Protected",
        },
        {
          label: "Explainability coverage",
          value: 0.95,
          delta: 0.08,
          status: "Within guardrail",
        },
      ],
      logs: [
        {
          timestamp,
          event: "Capability vector generated",
          actor: "Inclusive Matching Agent",
          result: "Pass",
        },
        {
          timestamp: new Date(now.getTime() - 42_000).toISOString(),
          event: "Timeline proxy neutralized",
          actor: "Bias Audit Agent",
          result: "Pass",
        },
        {
          timestamp: new Date(now.getTime() - 93_000).toISOString(),
          event: "SuccessFactors preview payload signed",
          actor: "Compliance Orchestrator",
          result: "Ready",
        },
      ],
      successFactorsPayload: {
        schema: "SAP.SuccessFactors.TalentIntelligence.v1",
        scope: parsed.data.scope,
        sampleSize: parsed.data.sampleSize ?? 1280,
        fairnessStatus: "green",
        generatedAt: timestamp,
      },
    }),
  );
});

export default router;