import type { FlowAiActionType } from "@/types/painCard";

export type FlowFieldType = "textarea" | "input" | "select" | "radio";

export type FlowFieldConfig = {
  key: string;
  label: string;
  helper?: string;
  path: string;
  type: FlowFieldType;
  rows?: number;
  placeholder?: string;
  options?: string[];
};

export type FlowStepConfig = {
  step: number;
  totalSteps: number;
  label: string;
  title: string;
  rule: string;
  intro: string;
  aiStatus: "disabled" | "enabled" | "required";
  heroIllustration: string;
  heroAlt: string;
  fields: FlowFieldConfig[];
  actions: { id: FlowAiActionType; label: string }[];
  resultTargetPaths?: string[];
};

export type WorksheetFlowConfig = {
  id: "lite" | "ai-detective";
  title: string;
  description: string;
  stepCount: number;
  ctaLabel: string;
  firstStepPath: string;
  steps: FlowStepConfig[];
};

const liteSteps: FlowStepConfig[] = [
  {
    step: 1,
    totalSteps: 6,
    label: "方向",
    title: "抱怨先不要解，先收斂成一個方向",
    rule: "先忠實寫下原句，再把它收斂到一條值得追的線。",
    intro: "這張卡先從原句出發，讓 AI 幫你縮窄，而不是直接給答案。",
    aiStatus: "enabled",
    heroIllustration: "e1-knot-unraveling",
    heroAlt: "把模糊抱怨收進一條更清楚的線索",
    fields: [
      {
        key: "verbatim",
        label: "原句抱怨",
        helper: "至少 10 字，先保留真人原來的口氣。",
        path: "complaint.verbatim",
        type: "textarea",
        rows: 4,
      },
      {
        key: "source_name",
        label: "是誰說的",
        helper: "保留真名、暱稱或你慣用的化名。",
        path: "complaint.source_name",
        type: "textarea",
        rows: 2,
      },
      {
        key: "direction",
        label: "目前收斂版本",
        helper: "可以自己寫，也可以採用 AI 候選版本。",
        path: "stuck_formula.ai_polished",
        type: "textarea",
        rows: 3,
      },
    ],
    actions: [
      { id: "narrow_scope", label: "幫我收斂" },
      { id: "challenge_assumption", label: "挑戰我的假設" },
    ],
    resultTargetPaths: ["stuck_formula.ai_polished"],
  },
  {
    step: 2,
    totalSteps: 6,
    label: "卡點",
    title: "把焦點痛點，壓到一個真的卡住的步驟",
    rule: "不要只說很亂，要講清楚到底卡在哪一步。",
    intro: "AI 會幫你挑戰這是不是表面抱怨，逼近真正動不了的那一步。",
    aiStatus: "enabled",
    heroIllustration: "e13-stuck-loop",
    heroAlt: "先承認現在怎麼硬撐，才找得到真正卡住的地方",
    fields: [
      {
        key: "focus_pain",
        label: "焦點痛點",
        path: "workaround.tool_name",
        type: "textarea",
        rows: 3,
      },
      {
        key: "workaround",
        label: "試過哪些，為什麼沒用",
        path: "workaround.why_still_stuck",
        type: "textarea",
        rows: 4,
      },
    ],
    actions: [
      { id: "challenge_assumption", label: "挑戰我的假設" },
      { id: "find_gap", label: "幫我補缺口" },
    ],
    resultTargetPaths: ["workaround.tool_name", "workaround.why_still_stuck"],
  },
  {
    step: 3,
    totalSteps: 6,
    label: "取捨",
    title: "真正放不下的，不是表面答案，是你一直犧牲的那一邊",
    rule: "用一句完整的話寫出你真正放不下的是什麼。",
    intro: "AI 會幫你抓你是不是在混淆偏好和真正的犧牲。",
    aiStatus: "enabled",
    heroIllustration: "e14-contradiction-scale",
    heroAlt: "兩邊都想保住，但一定有一邊一直被犧牲",
    fields: [
      {
        key: "tradeoff_a",
        label: "想保住的 A",
        path: "contradiction.side_a",
        type: "textarea",
        rows: 3,
      },
      {
        key: "tradeoff_b",
        label: "想保住的 B",
        path: "contradiction.side_b",
        type: "textarea",
        rows: 3,
      },
      {
        key: "tradeoff_reason",
        label: "我真正放不下的是...",
        path: "contradiction.sacrificed_reason",
        type: "textarea",
        rows: 3,
      },
    ],
    actions: [
      { id: "challenge_assumption", label: "抓我哪裡矛盾" },
      { id: "rewrite_candidate", label: "幫我改寫更準" },
    ],
    resultTargetPaths: ["contradiction.sacrificed_reason"],
  },
  {
    step: 4,
    totalSteps: 6,
    label: "證據",
    title: "先列證據，不先下結論",
    rule: "先看市場裡到底有沒有人在講同一個痛。",
    intro: "AI 在這裡要做的不是給解法，而是協助你辨認哪些線索其實不是同一類痛。",
    aiStatus: "required",
    heroIllustration: "e15-evidence-stack",
    heroAlt: "把你真正放不下的事，拿去照市場裡有沒有人也在痛",
    fields: [
      {
        key: "evidence_raw",
        label: "市場證據整理",
        path: "ai_evidence.raw_response",
        type: "textarea",
        rows: 8,
      },
      {
        key: "evidence_judgment",
        label: "你的判斷",
        path: "ai_evidence.eight_answers.q5_public_evidence",
        type: "textarea",
        rows: 4,
      },
      {
        key: "evidence_summary",
        label: "一句總結",
        path: "ai_evidence.eight_answers.q7_possible_fake_pains",
        type: "textarea",
        rows: 3,
      },
    ],
    actions: [
      { id: "find_gap", label: "幫我補缺口" },
      { id: "challenge_assumption", label: "這些真的同一個痛嗎" },
    ],
    resultTargetPaths: [
      "ai_evidence.raw_response",
      "ai_evidence.eight_answers.q5_public_evidence",
      "ai_evidence.eight_answers.q7_possible_fake_pains",
    ],
  },
  {
    step: 5,
    totalSteps: 6,
    label: "真人",
    title: "找 3 個下週真的聯絡得到的人",
    rule: "AI 可以幫你檢查樣本是否偏掉，但不代填名字。",
    intro: "這一步要把抽象痛點落到真人世界。",
    aiStatus: "enabled",
    heroIllustration: "e12-three-named-people",
    heroAlt: "把抽象痛點，落到下週真的找得到的三個人",
    fields: [
      {
        key: "people_list",
        label: "3 個真人（每行：姓名｜聯絡方式｜關係）",
        helper: "例如：Maggie｜LINE: xxx｜正在經歷這個痛",
        path: "people.list",
        type: "textarea",
        rows: 5,
      },
      {
        key: "people_background",
        label: "這 3 個人的共同背景",
        path: "people.background",
        type: "textarea",
        rows: 3,
      },
    ],
    actions: [
      { id: "find_gap", label: "幫我檢查樣本偏差" },
      { id: "next_step", label: "我下一步該聯絡誰" },
    ],
  },
  {
    step: 6,
    totalSteps: 6,
    label: "訪談",
    title: "把訪談題寫好，再誠實做一次真假判斷",
    rule: "問題要拿來驗證痛點，不是偷問解法。",
    intro: "AI 可以幫你挑出誘導式問題，也可以幫你把問題寫得更能驗證。",
    aiStatus: "enabled",
    heroIllustration: "e10-interviewer-portrait",
    heroAlt: "帶著問題去問真人，而不是帶著答案去推銷",
    fields: [
      {
        key: "interview_questions",
        label: "訪談題（可先寫 3 題）",
        path: "interview_plan.questions",
        type: "textarea",
        rows: 6,
      },
      {
        key: "verdict_reason",
        label: "這輪想確認什麼",
        path: "verdict.reason_100w",
        type: "textarea",
        rows: 3,
      },
    ],
    actions: [
      { id: "challenge_assumption", label: "幫我抓誘導問題" },
      { id: "rewrite_candidate", label: "幫我改寫訪談題" },
    ],
    resultTargetPaths: ["interview_plan.questions", "verdict.reason_100w"],
  },
];

const aiDetectiveSteps: FlowStepConfig[] = [
  ...liteSteps.slice(0, 6).map((step, index) => ({
    ...step,
    totalSteps: 8,
    step: index + 1,
  })),
  {
    step: 7,
    totalSteps: 8,
    label: "樣本",
    title: "讓 AI 先挑戰你的訪談樣本是不是偏掉",
    rule: "這一張卡不是加更多名字，而是加更好的樣本判斷。",
    intro: "當你準備訪談真人時，AI 要先問：你找的這些人是不是剛好都太像。",
    aiStatus: "enabled",
    heroIllustration: "e3-personas-halftone",
    heroAlt: "多個人物樣本並排，用來檢查是不是只看見同一類人",
    fields: [
      {
        key: "sample_bias",
        label: "目前 3 個真人，可能的共同偏差是什麼？",
        path: "ai_evidence.eight_answers.q8_interview_targets",
        type: "textarea",
        rows: 4,
      },
    ],
    actions: [
      { id: "challenge_assumption", label: "挑戰我的樣本" },
      { id: "find_gap", label: "補一個反例" },
    ],
    resultTargetPaths: ["ai_evidence.eight_answers.q8_interview_targets"],
  },
  {
    step: 8,
    totalSteps: 8,
    label: "判斷",
    title: "先做一輪暫時 verdict，但要讓 AI 先紅隊挑戰你",
    rule: "這一步不是宣布勝利，而是讓 AI 問你：你是不是下結論太早。",
    intro: "只有經過挑戰後還站得住腳的判斷，才值得進下一輪。",
    aiStatus: "required",
    heroIllustration: "e18-stage-two-horizon",
    heroAlt: "在做最後判斷前，先看見前方還有一條需要驗證的地平線",
    fields: [
      {
        key: "most_confident",
        label: "我目前最有把握的證據",
        path: "verdict.most_confident_evidence",
        type: "textarea",
        rows: 3,
      },
      {
        key: "least_confident",
        label: "我最沒把握的是",
        path: "verdict.least_confident",
        type: "textarea",
        rows: 3,
      },
      {
        key: "final_reason",
        label: "現在的判斷理由",
        path: "verdict.reason_100w",
        type: "textarea",
        rows: 4,
      },
    ],
    actions: [
      { id: "challenge_assumption", label: "紅隊挑戰我" },
      { id: "next_step", label: "我下一步應該驗什麼" },
    ],
    resultTargetPaths: [
      "verdict.most_confident_evidence",
      "verdict.least_confident",
      "verdict.reason_100w",
    ],
  },
];

export const worksheetFlowRegistry: Record<WorksheetFlowConfig["id"], WorksheetFlowConfig> = {
  lite: {
    id: "lite",
    title: "6-card condensed",
    description: "快速走完一次 condensed pain ID card。",
    stepCount: 6,
    ctaLabel: "開始 6-card flow",
    firstStepPath: "/learn/worksheet-lite/01?flow=lite",
    steps: liteSteps,
  },
  "ai-detective": {
    id: "ai-detective",
    title: "8-card AI detective",
    description: "讓 AI 更積極挑戰假設、抓盲點、幫你採納回卡片。",
    stepCount: 8,
    ctaLabel: "開始 8-card AI detective",
    firstStepPath: "/learn/worksheet-lite/01?flow=ai-detective",
    steps: aiDetectiveSteps,
  },
};

export function getWorksheetFlowConfig(flowId: string | undefined | null): WorksheetFlowConfig {
  if (flowId === "ai-detective") return worksheetFlowRegistry["ai-detective"];
  return worksheetFlowRegistry.lite;
}

export function getWorksheetStepConfig(flowId: string | undefined | null, step: number) {
  const flow = getWorksheetFlowConfig(flowId);
  return flow.steps.find((item) => item.step === step) ?? flow.steps[0];
}
