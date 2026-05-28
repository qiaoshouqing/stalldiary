export type StallAccent = "coral" | "teal" | "green" | "gold" | "ink";

export type StallEntry = {
  id: string;
  productId: string | null;
  productName: string | null;
  sourceText: string;
  sourceUrl: string | null;
  title: string;
  description: string;
  productTags: string[];
  channelTags: string[];
  moodTags: string[];
  stallType: string;
  accent: StallAccent;
  createdAt: string;
  updatedAt: string;
};

export type StallProduct = {
  id: string;
  name: string;
  description: string;
  accent: StallAccent;
  stallCount: number;
  createdAt: string;
  updatedAt: string;
};

export type ActivityDay = {
  date: string;
  promoCount: number;
  codeCount: number;
};

export type ActivitySummary = {
  from: string;
  to: string;
  promoTotal: number;
  codeTotal: number;
  promoActiveDays: number;
  codeActiveDays: number;
  overlapDays: number;
  maxPromoCount: number;
  maxCodeCount: number;
  codeSource: "github" | "missing-token" | "error";
};

export type ActivityResponse = {
  days: ActivityDay[];
  summary: ActivitySummary;
};
