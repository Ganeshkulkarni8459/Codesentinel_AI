
import { GoogleGenAI, Type } from "@google/genai";
import { GeminiResponseSchema, ReviewPhase } from "../types";

const cleanJson = (text: string): string => {
  try {
    const match = text.match(/```json\n([\s\S]*?)\n```/);
    if (match && match[1]) {
      return match[1];
    }
    return text.replace(/```json/g, '').replace(/```/g, '');
  } catch (e) {
    return text;
  }
};

const getSystemInstruction = (phase: ReviewPhase) => `
You are CodeSentinel AI, a world-class Senior Security Architect and Autonomous Marathon Agent.
Current Phase: ${phase}

CORE DIRECTIVES:
1. **Autonomous Operation**: You plan, execute, and validate without human help.
2. **Deep Understanding**: Map data flow and security boundaries.
3. **Validation Loop**: Simulate "Browser Validation". For findings, provide 'validationEvidence' (simulated console output).
4. **Performance Benchmarking**: Identify bottlenecks. Provide numeric strings for 'currentValue' and 'optimizedValue' (e.g., "850ms", "120ms").
5. **Self-Correction**: Be honest. If a finding is likely a false positive during validation, mark it as such.
6. **Output**: You MUST return a valid JSON object matching the provided schema.

PHASE-SPECIFIC FOCUS:
- ${ReviewPhase.UNDERSTANDING}: Map architecture components and their risk levels.
- ${ReviewPhase.ANALYSIS}: Find 3-5 security vulnerabilities.
- ${ReviewPhase.VALIDATION}: Provide proof-of-concept evidence for found vulnerabilities.
- ${ReviewPhase.BENCHMARK}: Identify performance hotspots with specific latency metrics.
- ${ReviewPhase.TESTING}: Generate integration test cases.
`;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    thoughtProcess: { type: Type.STRING, description: "A detailed explanation of the agent's reasoning." },
    summary: { type: Type.STRING, description: "A high-level status update for the mission control dashboard." },
    findings: {
      type: Type.OBJECT,
      properties: {
        vulnerabilities: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              severity: { type: Type.STRING, enum: ["CRITICAL", "HIGH", "MEDIUM", "LOW"] },
              confidence: { type: Type.STRING, enum: ["CONFIRMED", "HIGH", "MEDIUM", "LOW"] },
              type: { type: Type.STRING },
              location: { type: Type.STRING },
              description: { type: Type.STRING },
              exploitability: { type: Type.STRING },
              validationEvidence: { type: Type.STRING },
              status: { type: Type.STRING, enum: ["OPEN", "VALIDATED", "FALSE_POSITIVE", "FIXED"] }
            },
            required: ["id", "severity", "type", "description", "status"]
          }
        },
        performance: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              impact: { type: Type.STRING, enum: ["HIGH", "MEDIUM", "LOW"] },
              component: { type: Type.STRING },
              metric: { type: Type.STRING },
              currentValue: { type: Type.STRING },
              optimizedValue: { type: Type.STRING },
              suggestion: { type: Type.STRING }
            },
            required: ["id", "impact", "component", "currentValue", "optimizedValue"]
          }
        },
        architecture: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              type: { type: Type.STRING },
              riskLevel: { type: Type.STRING, enum: ["HIGH", "MEDIUM", "LOW"] },
              details: { type: Type.STRING }
            },
            required: ["name", "type", "riskLevel"]
          }
        },
        tests: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              type: { type: Type.STRING, enum: ["UNIT", "INTEGRATION", "E2E"] },
              status: { type: Type.STRING, enum: ["PASS", "FAIL", "PENDING"] },
              coverageDelta: { type: Type.STRING }
            },
            required: ["id", "name", "type", "status"]
          }
        }
      }
    },
    thoughtSignatureUpdate: {
      type: Type.OBJECT,
      properties: {
        simulatedDuration: { type: Type.INTEGER, description: "Minutes elapsed in this phase." },
        nextPlannedAction: { type: Type.STRING },
        decisions: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              timestamp: { type: Type.STRING },
              action: { type: Type.STRING },
              justification: { type: Type.STRING },
              outcome: { type: Type.STRING }
            }
          }
        }
      }
    }
  },
  required: ["thoughtProcess", "summary"]
};

export const analyzeCodeBlock = async (
  code: string,
  phase: ReviewPhase,
  apiKey: string
): Promise<GeminiResponseSchema> => {
  // Always create a new instance to ensure we use the latest API key
  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [
        {
          text: `
            SESSION ID: ORCH-MARATHON-${Date.now()}
            OPERATIONAL PHASE: ${phase}
            
            CODE TO ANALYZE:
            \`\`\`typescript
            ${code}
            \`\`\`
            
            Perform your deep inspection now. Ensure you update the 'findings' object relevant to the current phase.
            Return results in STRICT JSON.
          `
        }
      ],
      config: {
        systemInstruction: getSystemInstruction(phase),
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        maxOutputTokens: 20000,
        thinkingConfig: { thinkingBudget: 16384 }, 
      },
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from CodeSentinel Core");

    const jsonStr = cleanJson(text);
    return JSON.parse(jsonStr) as GeminiResponseSchema;
    
  } catch (error: any) {
    console.error("Gemini Core Error:", error);
    return {
      thoughtProcess: `SYSTEM ALERT: Phase ${phase} encountered a neural latency spike. Reason: ${error.message || 'Unknown API Error'}. Initiating auto-recovery sequence...`,
      summary: `Critical disruption in ${phase}. Attempting self-correction.`,
      nextPhase: phase // Suggest retry
    };
  }
};
