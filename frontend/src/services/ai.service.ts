import api from "./api";

export type AIResponse = {
  answer: string;
};

export async function askAIChat(question: string): Promise<string> {
  const response = await api.post<AIResponse>("/ai/chat", { question });
  return response.data.answer;
}

export async function getAIBusinessSummary(): Promise<string> {
  const response = await api.post<AIResponse>("/ai/business-summary", {});
  return response.data.answer;
}

export async function askPharmacyAgent(question: string): Promise<string> {
  const response = await api.post<AIResponse>("/ai/agent", { question });
  return response.data.answer;
}
