// 加载题库数据
export const loadQuestions = async () => {
  const questions = await import('../data/questions.json');
  return questions.default;
};

// 加载关卡数据
export const loadLevels = async () => {
  const levels = await import('../data/levels.json');
  return levels.default;
};

// 加载知识点数据
export const loadKnowledgePoints = async () => {
  const knowledgePoints = await import('../data/knowledgePoints.json');
  return knowledgePoints.default;
};

// 根据关卡ID获取关卡
export const getLevelById = async (id: number) => {
  const levels = await loadLevels();
  return levels.find((level: any) => level.id === id);
};

// 根据小节ID获取小节
export const getSectionById = async (levelId: number, sectionId: number) => {
  const level = await getLevelById(levelId);
  if (!level) return null;
  return level.sections.find((section: any) => section.id === sectionId);
};

// 根据题目ID获取题目
export const getQuestionById = async (id: string) => {
  const questions = await loadQuestions();
  return questions.find((question: any) => question.id === id);
};

// 根据知识点ID获取知识点
export const getKnowledgePointById = async (id: string) => {
  const knowledgePoints = await loadKnowledgePoints();
  return knowledgePoints.find((kp: any) => kp.id === id);
};

// 获取关卡的所有题目
export const getLevelQuestions = async (levelId: number) => {
  const questions = await loadQuestions();
  return questions.filter((question: any) => question.level === levelId);
};

// 获取关卡的所有知识点
export const getLevelKnowledgePoints = async (levelId: number) => {
  const knowledgePoints = await loadKnowledgePoints();
  return knowledgePoints.filter((kp: any) => kp.level === levelId);
};

// 获取小节的所有题目
export const getSectionQuestions = async (levelId: number, sectionId: number) => {
  const questions = await loadQuestions();
  return questions.filter((question: any) => 
    question.level === levelId && question.subLevel === sectionId
  );
};

// 获取小节对应的知识点（根据小节ID和关卡ID）
export const getSectionKnowledgePoints = async (levelId: number, sectionId: number) => {
  const knowledgePoints = await loadKnowledgePoints();
  // 知识点ID格式为 KP-<levelId>-<sectionId>
  return knowledgePoints.filter((kp: any) => 
    kp.level === levelId && parseInt(kp.id.split('-')[2]) === sectionId
  );
};