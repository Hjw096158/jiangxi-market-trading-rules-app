// 用户类型
export interface User {
  id: string;
  username: string;
  email: string;
  currentLevel: number;
  unlockedLevels: number[];
  levelScores: Record<string, { score: number; stars: number }>;
  achievements: string[];
}

// 题目类型
export interface Question {
  id: string;
  level: number;
  subLevel: number;
  type: 'single_choice' | 'multiple_choice' | 'true_false' | 'calculation' | 'case_study';
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options?: string[];
  answer: string | string[];
  explanation: string;
  relatedSimulator?: string;
}

// 关卡类型
export interface Level {
  id: number;
  name: string;
  description: string;
  estimatedTime: string;
  difficulty: number;
  sections: Section[];
  simulatorCount: number;
  questionCount: number;
}

// 小节类型
export interface Section {
  id: number;
  name: string;
  learningObjectives: string[];
  questions: string[]; // 题目ID数组
  simulator?: string;
}

// 模拟器类型
export interface Simulator {
  id: string;
  name: string;
  description: string;
  type: 'calculator' | 'process' | 'trading_hall' | 'business_strategy';
  relatedQuestions: string[];
}

// 结算单类型
export interface SettlementBill {
  id: string;
  type: 'coal' | 'new_energy' | 'wholesale' | 'retail' | 'grid_proxy' | 'daily' | 'test';
  companyName: string;
  period: string;
  data: any; // 具体结算单数据
  sections: SettlementSection[];
}

// 结算单小节类型
export interface SettlementSection {
  title: string;
  content: any;
  calculations?: Calculation[];
}

// 计算类型
export interface Calculation {
  formula: string;
  description: string;
  result: number;
}

// 游戏状态类型
export interface GameState {
  currentUser: User | null;
  isPlaying: boolean;
  currentLevel: number;
  currentSection: number;
  score: number;
  stars: number;
  achievements: string[];
  leaderboard: { username: string; score: number }[];
}
