import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    system: "GraphWard AI Sovereign Engine",
    mode: "Air-Gapped Private VPC",
    version: "4.8.2-enterprise",
    timestamp: new Date().toISOString(),
    vLLMReady: true,
    activeASTNodes: 2104,
  });
});

// AST Remediation AI Assist endpoint
app.post("/api/remediate", async (req, res) => {
  try {
    const { vulnerability, fileCode, customPrompt } = req.body;
    const ai = getAIClient();

    if (ai) {
      const prompt = `You are GraphWard AI, a specialized enterprise DevSecOps continuous code remediation engine.
Vulnerability / CVE: ${JSON.stringify(vulnerability || {})}
Custom Guidance: ${customPrompt || "Generate precision AST-safe diff with zero test breakage"}
Code Context:
\`\`\`
${fileCode || "// Vulnerable code snippet"}
\`\`\`

Provide a strict, production-grade AST remediation plan, explaining:
1. Root cause in AST call hierarchy
2. Precise self-correcting fix with zero regressions
3. Suggested automated regression test case
4. Generated Diff Patch in standard Git diff format.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
      });

      return res.json({
        success: true,
        source: "gemini-3.7-flash",
        analysis: response.text,
      });
    } else {
      // Fallback enterprise simulated R-CLI AST synthesis
      return res.json({
        success: true,
        source: "GraphWard-R-CLI-vLLM-Local",
        analysis: `[AST ANALYSIS COMPLETE]
Root Cause: Insecure algorithm negotiation in AST token parsing block (Line 84).
Remediation: Injected constant-time HMAC signature verification, enforced explicit whitelist algorithm checks, eliminated algorithm confusion ('none' exploit vector).
Verification: 142/142 Unit Tests Passed (0 Regressions, 100% Branch Coverage).
SAST Rule: Semgrep ruleset security.jwt.insecure-algo-check CLEARED.`,
      });
    }
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Analysis failed";
    return res.status(500).json({ success: false, error: errMessage });
  }
});

// PoC Export JSON endpoint
app.get("/api/poc/export", (_req, res) => {
  const pocData = {
    enterpriseClient: "Global FinTech Holdings Corp (Tier-1 Banking)",
    period: "14-Day Continuous Remediation PoC",
    generatedAt: new Date().toISOString(),
    executiveMetrics: {
      initialTechnicalDebtUSD: 2410000,
      remediatedTechnicalDebtUSD: 1820000,
      netSavingsUSD: 1820000,
      cveReductionPercent: 75.5,
      mttrReductionPercent: 99.5,
      mttrBaselineMinutes: 295200, // 205 days
      mttrGraphWardMinutes: 14,
      zeroBreakageRate: "100.0%",
      regressionsCount: 0,
      totalPRsMerged: 184,
      locAnalyzed: 2500000,
    },
    topRemediatedCVEs: [
      { id: "CVE-2026-3182", title: "JWT Insecure Algorithm Negotiation", severity: "CRITICAL", file: "auth_service.py", status: "REMEDIATED" },
      { id: "CVE-2026-4401", title: "AES-GCM Weak IV Re-use in Crypto Vault", severity: "CRITICAL", file: "payment_gateway/crypto.go", status: "REMEDIATED" },
      { id: "CVE-2026-1928", title: "Connection Pool Memory Safety Hazard", severity: "HIGH", file: "user_db/session.rs", status: "REMEDIATED" },
      { id: "CVE-2026-5590", title: "Claims Sanitizer Prototype Pollution", severity: "HIGH", file: "token_vault/signer.ts", status: "REMEDIATED" },
    ],
    complianceReadiness: {
      soc2TypeII: "PASSED",
      iso27001: "COMPLIANT",
      pciDssV4: "VERIFIED (Requirement 6.3.2 Zero High Vulnerabilities)",
      hipaa: "COMPLIANT",
    },
  };

  res.setHeader("Content-Disposition", 'attachment; filename="GraphWard_14Day_PoC_Report.json"');
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify(pocData, null, 2));
});

// Vite middleware for dev / static for prod
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`GraphWard AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
