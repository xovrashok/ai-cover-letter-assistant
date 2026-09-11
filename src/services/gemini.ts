import { GoogleGenAI } from "@google/genai";

interface GenerateParams {
  apiKey: string;
  userResume: string;
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  tone?: "Professional" | "Short";
}

export const generateCoverLetter = async ({
  apiKey,
  userResume,
  jobTitle,
  companyName,
  jobDescription,
  tone = "Short",
}: GenerateParams): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    You are a professional IT career mentor helping a Frontend Developer apply for a job.
    Generate a highly tailored cover letter in Ukrainian language based on the user's resume and job details.

    Job Details:
    - Position: ${jobTitle}
    - Company: ${companyName}
    - Description: ${jobDescription}

    User Resume/Experience:
    ${userResume}

    Requirements:
    - Tone: ${tone}.
    - Highlight exact matches between user skills and job requirements.
    - Focus heavily on relevant React, TypeScript, and Extension/Web experience if mentioned.
    - Keep it concise and natural (under 150 words).
    - Do NOT use placeholder brackets like [Your Name]. Use the name from the resume or sign off naturally.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
  });

  return response.text || "";
};
