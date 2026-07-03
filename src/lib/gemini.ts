import { GoogleGenAI } from "@google/genai";

export interface GeminiTriageResult {
  condition: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  confidence: number;
  reasoning: string;
  firstAid: string[];
  urgency: string;
  estimatedRecovery: string;
  recommendedAction: string;
  recoveryConfidence: number;
}

/**
 * Perform server-side Gemini Vision visual triage on a cat's photo.
 * Expects the image file content as a Buffer.
 */
export async function triageImage(
  imageBuffer: Buffer,
  mimeType: string
): Promise<GeminiTriageResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured on the server.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const base64Data = imageBuffer.toString("base64");

  const prompt = `You are a professional veterinary assistant helping triage rescued stray cats.
Analyze this photo of a cat to assess its medical condition.
Return your assessment in a strict structured JSON format.

Do not write any markdown code blocks, do not wrap in backticks, and do not include any surrounding text. Return ONLY raw valid JSON matching the schema below.

JSON Schema:
{
  "condition": "A short, readable name of the suspected condition (e.g., 'Eye Infection', 'Open Wound', 'Fracture', 'Skin Scabies')",
  "severity": "Must be exactly one of: 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'",
  "confidence": "An integer percentage between 0 and 100 representing your diagnosis confidence",
  "reasoning": "A concise paragraph explaining what symptoms are visible and why you reached this triage status",
  "firstAid": ["A list of 3-4 simple, safe, non-medical first aid actions community members can perform safely before transport"],
  "urgency": "A brief timeframe badge text (e.g., 'Emergency', 'Vet within 2 hours', 'Vet within 24h', 'Monitor')",
  "estimatedRecovery": "Estimated healing timeframe (e.g., '1-2 weeks', '3-4 weeks', '1 month+')",
  "recommendedAction": "Immediate recommendation for the transporter or rescuer",
  "recoveryConfidence": "An integer percentage between 0 and 100 representing the prognosis recovery confidence"
}`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [
          { text: prompt },
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType || "image/jpeg",
            },
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: {
        type: "object",
        properties: {
          condition: { type: "string" },
          severity: { type: "string", enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"] },
          confidence: { type: "integer" },
          reasoning: { type: "string" },
          firstAid: { type: "array", items: { type: "string" } },
          urgency: { type: "string" },
          estimatedRecovery: { type: "string" },
          recommendedAction: { type: "string" },
          recoveryConfidence: { type: "integer" }
        },
        required: [
          "condition",
          "severity",
          "confidence",
          "reasoning",
          "firstAid",
          "urgency",
          "estimatedRecovery",
          "recommendedAction",
          "recoveryConfidence"
        ]
      }
    }
  });

  const responseText = response.text;
  if (!responseText) {
    throw new Error("Empty response from Gemini Vision API.");
  }

  // Clean the response just in case the model added backticks
  const cleaned = responseText.trim().replace(/^```json\s*/i, "").replace(/```$/, "");
  return JSON.parse(cleaned) as GeminiTriageResult;
}
