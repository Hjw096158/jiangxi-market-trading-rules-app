import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from './components/Button';
import Card from './components/Card';
import ProgressBar from './components/ProgressBar';
import Modal from './components/Modal';
import { loadLevels, getLevelById, getSectionById, getSectionQuestions, getSectionKnowledgePoints } from './utils/dataLoader';
import QuestionCard from './components/QuestionCard';
import './App.css';

// 模拟器组件类型
import AnnualCapacityCalculator from './simulators/AnnualCapacityCalculator';
import BilateralNegotiationSimulator from './simulators/BilateralNegotiationSimulator';
import DeviationCalculator from './simulators/DeviationCalculator';
import SupplyDemandCurveSimulator from './simulators/SupplyDemandCurveSimulator';
import QuoteMatchingSimulator from './simulators/QuoteMatchingSimulator';
import ElectricityAuctionSimulator from './simulators/ElectricityAuctionSimulator';
import CentralizedMatchingHallSimulator from './simulators/CentralizedMatchingHallSimulator';
// 第一关模拟器
import MarketRoleRecognitionSimulator from './simulators/MarketRoleRecognitionSimulator';
import RegistrationQualificationTestSimulator from './simulators/RegistrationQualificationTestSimulator';
import RegistrationProcessSimulator from './simulators/RegistrationProcessSimulator';
import InformationChangeAndCancellationSimulator from './simulators/InformationChangeAndCancellationSimulator';
// 第二关模拟器
import TransactionCycleTimelineSimulator from './simulators/TransactionCycleTimelineSimulator';
import RoleRightsMatchingSimulator from './simulators/RoleRightsMatchingSimulator';
import TransactionUnitMatchingSimulator from './simulators/TransactionUnitMatchingSimulator';
import ContractElementsPuzzleSimulator from './simulators/ContractElementsPuzzleSimulator';
// 第四关模拟器
import TimePeriodRecognitionGame from './simulators/TimePeriodRecognitionGame';
import PriceConstraintCalculator from './simulators/PriceConstraintCalculator';
import MonthlyCapacityConstraintCalculator from './simulators/MonthlyCapacityConstraintCalculator';
// 第五关模拟器
import GreenPowerTradeComparisonSimulator from './simulators/GreenPowerTradeComparisonSimulator';
import GreenPowerTradeProcessSimulator from './simulators/GreenPowerTradeProcessSimulator';
import GreenCertificateManagementSimulator from './simulators/GreenCertificateManagementSimulator';
// 第六关模拟器
import SettlementProcessSimulator from './simulators/SettlementProcessSimulator';
import CostAllocationCalculator from './simulators/CostAllocationCalculator';
// 第七关模拟器
import PowerGenerationEnterpriseManagementSimulator from './simulators/PowerGenerationEnterpriseManagementSimulator';
import ElectricityRetailCompanyArbitrageSimulator from './simulators/ElectricityRetailCompanyArbitrageSimulator';
import UserPowerPurchaseOptimizationSimulator from './simulators/UserPowerPurchaseOptimizationSimulator';
import ComprehensiveTransactionDecisionSimulator from './simulators/ComprehensiveTransactionDecisionSimulator';

// 类型定义
interface Level {
  id: number;
  name: string;
  description: string;
  estimatedTime: string;
  difficulty: number;
  sections: any[];
  simulatorCount: number;
  questionCount: number;
}

interface Section {
  id: number;
  name: string;
  learningObjectives: string[];
  questions: string[];
  simulator?: string;
}

interface Question {
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

// 知识点类型定义
interface KnowledgePoint {
  id: string;
  name: string;
  level: number;
  difficulty: number;
  estimatedTime: string;
  relatedSimulator: string;
  prerequisites: string[];
  learningObjectives: string[];
  content: string;
}

function App() {
  const [levels, setLevels] = useState<Level[]>([]);
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
  const [currentSection, setCurrentSection] = useState<Section | null>(null);
  const [view, setView] = useState<'levels' | 'level' | 'section'>('levels');
  const [isLoading, setIsLoading] = useState(true);
  
  // 模拟器状态
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [currentSimulator, setCurrentSimulator] = useState<React.ReactNode>(null);
  
  // 题目练习状态
  const [isPracticing, setIsPracticing] = useState(false);
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [isPracticeCompleted, setIsPracticeCompleted] = useState(false);
  
  // 知识点学习状态
  const [isLearning, setIsLearning] = useState(false);
  const [currentKnowledgePoints, setCurrentKnowledgePoints] = useState<KnowledgePoint[]>([]);
  const [currentKnowledgePointIndex, setCurrentKnowledgePointIndex] = useState(0);
  const [currentKnowledgePoint, setCurrentKnowledgePoint] = useState<KnowledgePoint | null>(null);
  const [isLearningCompleted, setIsLearningCompleted] = useState(false);
  
  // 模拟器名称到组件的映射
  const simulatorMap: Record<string, React.ReactNode> = {
    // 第一关模拟器
    '1-1 市场角色认知闯关': <MarketRoleRecognitionSimulator />,
    '1-2 注册资格自测系统': <RegistrationQualificationTestSimulator />,
    '1-3 注册流程闯关器': <RegistrationProcessSimulator />,
    '1-4 信息变更与注销模拟': <InformationChangeAndCancellationSimulator />,
    // 第二关模拟器
    '2-2 交易周期时间轴': <TransactionCycleTimelineSimulator />,
    '2-3 角色权责匹配游戏': <RoleRightsMatchingSimulator />,
    '2-4 交易单元配对游戏': <TransactionUnitMatchingSimulator />,
    '2-5 合同要素拼图游戏': <ContractElementsPuzzleSimulator />,
    // 第四关模拟器
    '4-1 时段识别游戏': <TimePeriodRecognitionGame />,
    '4-2 价格约束计算器': <PriceConstraintCalculator />,
    '4-4 月度电量约束计算器': <MonthlyCapacityConstraintCalculator />,
    // 第五关模拟器
    '5-1 绿电交易特点对比': <GreenPowerTradeComparisonSimulator />,
    '5-2 绿电交易流程模拟器': <GreenPowerTradeProcessSimulator />,
    '5-3 绿证管理模拟器': <GreenCertificateManagementSimulator />,
    // 第六关模拟器
    '6-1 结算流程模拟器': <SettlementProcessSimulator />,
    '6-3 费用分摊计算器': <CostAllocationCalculator />,
    // 其他关模拟器
      '4-3 年度电量约束计算器': <AnnualCapacityCalculator />,
      '3-1 双边协商谈判模拟器': <BilateralNegotiationSimulator />,
      '6-2 偏差电费计算器': <DeviationCalculator />,
      '3-2 供需曲线可视化模拟器': <SupplyDemandCurveSimulator />,
      '3-3 报价撮合出清模拟器': <QuoteMatchingSimulator />,
      '3-4 电力拍卖行模拟器': <ElectricityAuctionSimulator />,
      '3-5 集中撮合交易大厅': <CentralizedMatchingHallSimulator />,
      // 第七关模拟器
      '7-1 发电企业经营模拟器': <PowerGenerationEnterpriseManagementSimulator />,
      '7-2 售电公司套利模拟器': <ElectricityRetailCompanyArbitrageSimulator />,
      '7-3 用户购电优化模拟器': <UserPowerPurchaseOptimizationSimulator />,
      '7-4 综合交易决策模拟器': <ComprehensiveTransactionDecisionSimulator />
  };

  // 加载关卡数据
  useEffect(() => {
    const fetchLevels = async () => {
      setIsLoading(true);
      const data = await loadLevels();
      setLevels(data);
      setIsLoading(false);
    };
    fetchLevels();
  }, []);

  // 打开关卡详情
  const handleLevelClick = async (levelId: number) => {
    setIsLoading(true);
    const level = await getLevelById(levelId);
    setCurrentLevel(level as Level);
    setView('level');
    setIsLoading(false);
  };

  // 打开小节详情
  const handleSectionClick = async (levelId: number, sectionId: number) => {
    setIsLoading(true);
    const section = await getSectionById(levelId, sectionId);
    setCurrentSection(section as Section);
    setView('section');
    setIsLoading(false);
  };
  
  // 打开模拟器
  const handleOpenSimulator = (simulatorName: string) => {
    const simulator = simulatorMap[simulatorName];
    if (simulator) {
      setCurrentSimulator(simulator);
      setIsSimulatorOpen(true);
    }
  };
  
  // 关闭模拟器
  const handleCloseSimulator = () => {
    setIsSimulatorOpen(false);
    setCurrentSimulator(null);
  };

  // 返回关卡列表
  const handleBackToLevels = () => {
    setView('levels');
    setCurrentLevel(null);
    setCurrentSection(null);
    setIsPracticing(false);
    resetPracticeState();
  };

  // 返回关卡详情
  const handleBackToLevel = () => {
    setView('level');
    setCurrentSection(null);
    setIsPracticing(false);
    resetPracticeState();
  };

  // 重置练习状态
  const resetPracticeState = () => {
    setCurrentQuestions([]);
    setCurrentQuestionIndex(0);
    setCurrentQuestion(null);
    setCorrectAnswers(0);
    setTotalQuestions(0);
    setIsPracticeCompleted(false);
  };

  // 重置学习状态
  const resetLearningState = () => {
    setCurrentKnowledgePoints([]);
    setCurrentKnowledgePointIndex(0);
    setCurrentKnowledgePoint(null);
    setIsLearningCompleted(false);
  };

  // 开始练习
  const handleStartPractice = async () => {
    if (!currentLevel || !currentSection) return;
    
    setIsLoading(true);
    try {
      // 获取当前小节的题目
      const questions = await getSectionQuestions(currentLevel.id, currentSection.id);
      // 使用类型断言确保类型匹配
      const typedQuestions = questions as Question[];
      setCurrentQuestions(typedQuestions);
      setTotalQuestions(typedQuestions.length);
      setCorrectAnswers(0);
      setCurrentQuestionIndex(0);
      setCurrentQuestion(typedQuestions[0]);
      setIsPracticing(true);
      setIsPracticeCompleted(false);
    } catch (error) {
      console.error('Failed to load questions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 开始学习知识点
  const handleStartLearning = async () => {
    if (!currentLevel || !currentSection) return;
    
    setIsLoading(true);
    try {
      // 获取当前小节的知识点
      const knowledgePoints = await getSectionKnowledgePoints(currentLevel.id, currentSection.id);
      // 使用类型断言确保类型匹配
      const typedKnowledgePoints = knowledgePoints as KnowledgePoint[];
      setCurrentKnowledgePoints(typedKnowledgePoints);
      setCurrentKnowledgePointIndex(0);
      setCurrentKnowledgePoint(typedKnowledgePoints[0]);
      setIsLearning(true);
      setIsLearningCompleted(false);
    } catch (error) {
      console.error('Failed to load knowledge points:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 处理答案
  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
    }
  };

  // 下一题
  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setCurrentQuestion(currentQuestions[currentQuestionIndex + 1]);
    } else {
      // 练习完成
      setIsPracticeCompleted(true);
    }
  };

  // 下一个知识点
  const handleNextKnowledgePoint = () => {
    if (currentKnowledgePointIndex < currentKnowledgePoints.length - 1) {
      setCurrentKnowledgePointIndex(prev => prev + 1);
      setCurrentKnowledgePoint(currentKnowledgePoints[currentKnowledgePointIndex + 1]);
    } else {
      // 学习完成
      setIsLearningCompleted(true);
    }
  };

  // 结束练习
  const handleEndPractice = () => {
    setIsPracticing(false);
    resetPracticeState();
  };

  // 结束学习
  const handleEndLearning = () => {
    setIsLearning(false);
    resetLearningState();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold">加载中...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* 头部 */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-blue-600">江西电力市场规则学习闯关系统</h1>
            <p className="text-sm text-gray-500">系统掌握江西电力市场交易规则（4.0版）</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={handleBackToLevels}>
              首页
            </Button>
          </div>
        </div>
      </header>

      {/* 主内容 */}
      <main className="container mx-auto px-4 py-8">
        {/* 关卡列表视图 */}
        {view === 'levels' && (
          <div>
            {/* Hero Section with IP Content */}
            <div className="mb-12 bg-gradient-to-br from-indigo-900 via-blue-800 to-purple-900 rounded-2xl shadow-2xl overflow-hidden">
              {/* Cloud Pattern Background */}
              <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBmaWxsPSIjZmZmZmZmIiBkPSJNMTgwIDEwMGMtMTAgMTAtMjAgMTUtMzAgMTUtMTAgMC0yMCA1LTMwIDE1LTkgOS0yMCAxNC0zMCAxNC05IDAtMjAgLTUtMzAtMTUtMTAtMTAtMjAtMTUtMzAtMTUtMTAwIDAtMTUwIDUwLTE1MCAxNTAiLz48cGF0aCBmaWxsPSIjZmZmZmZmIiBkPSJNMTUwIDEwMGwtNTAgMTAtMjAgMTAtMTAgMTAgMCAxMC0xMCAxMC0xMCAxMCAwIDEwLTEwIDEwLTEwMTAgMCAxMDAgNTAgMTAwIDE1MCIvPjxwYXRoIGZpbGw9IiNmZmZmZmYiIGQ9Ik0xMDAgMTUwYy0yMCAwLTQwIDEwLTYwIDEwLTIwIDAtNDAgLTUtNjAgMTAtMjAgMTAtNDAgMTUtNjAgMTUtMjAgMC00MC01LTYwLTE1LTIwLTEwLTQwLTE1LTYwLTE1LTEwMCAwLTE1MCA1MC0xNTAgMTUwIi8+PC9zdmc+')]"></div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 items-center relative z-10">
                {/* Left Content */}
                <div className="p-8 lg:p-12 text-white">
                  {/* IP Branding */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <div className="bg-yellow-400 text-indigo-900 font-bold px-4 py-1 rounded-full text-sm">
                      清风道长
                    </div>
                    <div className="bg-yellow-400 text-indigo-900 font-bold px-4 py-1 rounded-full text-sm">
                      贫道略懂
                    </div>
                    <div className="bg-yellow-400 text-indigo-900 font-bold px-4 py-1 rounded-full text-sm">
                      电力江湖
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h2 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                    江西电力市场规则
                    <br />
                    <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                      学习闯关系统
                    </span>
                  </h2>
                  
                  {/* Description */}
                  <p className="text-blue-100 text-lg mb-6 leading-relaxed">
                    系统掌握江西电力市场交易规则（4.0版），通过趣味闯关模式，
                    轻松学习电力市场知识，行走电力江湖，规则在手，天下我有！
                  </p>
                  
                  {/* Features */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        🎯
                      </div>
                      <div>
                        <div className="font-semibold">7个关卡</div>
                        <div className="text-sm opacity-80">循序渐进学习</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        🎮
                      </div>
                      <div>
                        <div className="font-semibold">多种模拟器</div>
                        <div className="text-sm opacity-80">实战演练</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        📚
                      </div>
                      <div>
                        <div className="font-semibold">互动学习</div>
                        <div className="text-sm opacity-80">趣味闯关</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        ⚡
                      </div>
                      <div>
                        <div className="font-semibold">电力江湖</div>
                        <div className="text-sm opacity-80">规则在手</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Quote */}
                  <div className="border-l-4 border-yellow-400 pl-4 italic text-blue-100">
                    "江湖险恶，学习电力规则防身；电力江湖，掌握规则走遍天下" — 清风道长
                  </div>
                </div>
                
                {/* Right Visual with Hero Image */}
                <div className="relative h-80 lg:h-[500px] flex items-center justify-center p-4">
                  {/* Traditional Cloud Pattern */}
                  <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJjaXJjbGUiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxwYXRoIGQ9Ik0wIDBoMTAwdjEwMEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDBoMTAwdjEwMEgweiIgZmlsbD0iIzE4MThmZiIgZmlsbC1vcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjY2lyY2xlKSIvPjwvc3ZnPg==')]"></div>
                  
                  {/* Modern Element */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-80 h-80 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 opacity-60 blur-3xl"></div>
                  </div>
                  
                  {/* Hero Icon & Text */}
                  <div className="relative z-10 text-center text-white">
                    <div className="text-8xl mb-4">
                      <div className="inline-block transform transition-transform hover:scale-110 duration-300">
                        🏮
                      </div>
                    </div>
                    <div className="text-3xl font-bold mb-2">电力江湖</div>
                    <div className="text-xl opacity-80 mb-4">江湖险恶，规则防身</div>
                    <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full text-sm">
                      清风道长-贫道略懂-电力江湖
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2 text-center">关卡列表</h2>
              <p className="text-gray-600 text-center">按照以下关卡顺序逐步学习，每个关卡通过后解锁下一关</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {levels.map((level) => (
                <motion.div
                  key={level.id}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="group"
                >
                  <Card
                    title={`第${level.id}关：${level.name}`}
                    subtitle={`难度：${'⭐'.repeat(level.difficulty)} | 预计时长：${level.estimatedTime}`}
                    onClick={() => handleLevelClick(level.id)}
                    className="h-full bg-white hover:shadow-xl transition-all duration-300 border border-gray-100 group-hover:border-blue-200"
                  >
                    <div className="absolute top-4 right-4 bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      关卡 {level.id}
                    </div>
                    <p className="text-gray-600 mb-4 relative z-10">{level.description}</p>
                    <div className="grid grid-cols-2 gap-4 relative z-10">
                      <div className="bg-gray-50 p-3 rounded-lg transition-all group-hover:bg-blue-50">
                        <div className="text-sm text-gray-500">小节数</div>
                        <div className="font-semibold">{level.sections.length}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg transition-all group-hover:bg-blue-50">
                        <div className="text-sm text-gray-500">模拟器数</div>
                        <div className="font-semibold">{level.simulatorCount}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg transition-all group-hover:bg-blue-50">
                        <div className="text-sm text-gray-500">题目数</div>
                        <div className="font-semibold">{level.questionCount}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg transition-all group-hover:bg-blue-50">
                        <div className="text-sm text-gray-500">难度</div>
                        <div className="font-semibold">{level.difficulty}星</div>
                      </div>
                    </div>
                    <div className="mt-4 relative z-10">
                      <Button 
                        variant="primary" 
                        fullWidth
                        className="group-hover:shadow-lg transition-all"
                      >
                        <span className="group-hover:animate-pulse">进入关卡</span>
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* 关卡详情视图 */}
        {view === 'level' && currentLevel && (
          <div>
            <div className="mb-6">
              <Button variant="secondary" onClick={handleBackToLevels} className="mb-4">
                ← 返回关卡列表
              </Button>
              <h2 className="text-3xl font-bold mb-2">第{currentLevel.id}关：{currentLevel.name}</h2>
              <p className="text-gray-600 mb-4">{currentLevel.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-sm text-gray-500">预计时长</div>
                  <div className="font-semibold">{currentLevel.estimatedTime}</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-sm text-gray-500">难度</div>
                  <div className="font-semibold">{currentLevel.difficulty}星</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-sm text-gray-500">进度</div>
                  <div className="font-semibold">0 / {currentLevel.sections.length} 小节</div>
                </div>
              </div>
              <ProgressBar current={0} total={currentLevel.sections.length} label="关卡进度" className="mb-6" />
            </div>

            <h3 className="text-2xl font-bold mb-4">小节列表</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentLevel.sections.map((section) => (
                <Card
                  key={section.id}
                  title={`小节${section.id}：${section.name}`}
                  onClick={() => handleSectionClick(currentLevel.id, section.id)}
                  className="h-full"
                >
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">学习目标：</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      {section.learningObjectives.map((objective: string, index: number) => (
                        <li key={index}>{objective}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">题目数</div>
                      <div className="font-semibold">{section.questions.length}</div>
                    </div>
                    {section.simulator && (
                      <div>
                        <div className="text-sm text-gray-500">模拟器</div>
                        <div className="font-semibold">有</div>
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <Button variant="primary" fullWidth>
                      进入小节
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* 小节详情视图 */}
        {view === 'section' && currentLevel && currentSection && (
          <div>
            <div className="mb-6">
              <div className="flex gap-2 mb-4">
                <Button variant="secondary" onClick={handleBackToLevels}>
                  ← 返回关卡列表
                </Button>
                <Button variant="secondary" onClick={handleBackToLevel}>
                  ← 返回关卡详情
                </Button>
              </div>
              <h2 className="text-3xl font-bold mb-2">
                第{currentLevel.id}关：{currentLevel.name}
              </h2>
              <h3 className="text-2xl font-bold mb-4">
                小节{currentSection.id}：{currentSection.name}
              </h3>
              <div className="mb-4">
                <h4 className="font-semibold mb-2">学习目标：</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  {currentSection.learningObjectives.map((objective, index) => (
                    <li key={index}>{objective}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 知识点学习 */}
            {isLearning ? (
              <div className="mb-6">
                {currentKnowledgePoint ? (
                  <div className="max-w-3xl mx-auto">
                    {/* 学习进度 */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-sm text-gray-500">
                          知识点 {currentKnowledgePointIndex + 1} / {currentKnowledgePoints.length}
                        </div>
                        <div className="text-sm text-gray-500">
                          预计时长：{currentKnowledgePoint.estimatedTime}
                        </div>
                      </div>
                      <ProgressBar 
                        current={currentKnowledgePointIndex + 1} 
                        total={currentKnowledgePoints.length} 
                        label="学习进度" 
                        className="mb-4" 
                      />
                    </div>
                    
                    {/* 知识点卡片 */}
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                      <h3 className="text-2xl font-bold mb-4">{currentKnowledgePoint.name}</h3>
                      <div className="mb-4">
                        <div className="text-sm text-gray-500 mb-1">难度：{'⭐'.repeat(currentKnowledgePoint.difficulty)}</div>
                        {currentKnowledgePoint.relatedSimulator && (
                          <div className="text-sm text-gray-500">关联模拟器：{currentKnowledgePoint.relatedSimulator}</div>
                        )}
                      </div>
                      
                      <div className="mb-6">
                        <h4 className="font-semibold mb-2">学习目标：</h4>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          {currentKnowledgePoint.learningObjectives.map((objective, index) => (
                            <li key={index}>{objective}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="mb-6">
                        <h4 className="font-semibold mb-2">核心知识点：</h4>
                        <div className="prose max-w-none">
                          {currentKnowledgePoint.content.split('\n').map((line, index) => {
                            if (line.startsWith('# ')) {
                              return <h5 key={index} className="text-lg font-semibold mt-4 mb-2">{line.replace('# ', '')}</h5>;
                            } else if (line.startsWith('## ')) {
                              return <h6 key={index} className="text-md font-semibold mt-3 mb-1">{line.replace('## ', '')}</h6>;
                            } else if (line.startsWith('### ')) {
                              return <h6 key={index} className="text-md font-medium mt-2 mb-1">{line.replace('### ', '')}</h6>;
                            } else if (line.startsWith('- ')) {
                              return <div key={index} className="ml-4 mt-1"><span className="text-blue-600">•</span> {line.replace('- ', '')}</div>;
                            } else if (line.startsWith('  - ')) {
                              return <div key={index} className="ml-8 mt-1"><span className="text-blue-600">◦</span> {line.replace('  - ', '')}</div>;
                            } else if (line.startsWith('```')) {
                              return null; // 暂时跳过代码块
                            } else if (line.startsWith('| ')) {
                              return null; // 暂时跳过表格
                            } else if (line.trim() === '') {
                              return <br key={index} />;
                            } else {
                              return <p key={index} className="mt-1">{line}</p>;
                            }
                          })}
                        </div>
                      </div>
                      
                      <Button variant="primary" fullWidth onClick={handleNextKnowledgePoint}>
                        {currentKnowledgePointIndex < currentKnowledgePoints.length - 1 ? '下一个知识点' : '完成学习'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-bold mb-2">加载知识点中...</h3>
                    <p className="text-gray-600">请稍候，正在准备知识点</p>
                  </div>
                )}
                
                {/* 学习完成结果 */}
                {isLearningCompleted && (
                  <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-lg">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold mb-2">学习完成！</h3>
                      <p className="text-gray-600 mb-4">恭喜您完成了本节的知识点学习</p>
                      <div className="text-3xl font-bold text-green-600 mb-4">
                        ✓ 学习成功
                      </div>
                      <div className="text-sm text-gray-500">
                        共学习了 {currentKnowledgePoints.length} 个知识点
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <Button variant="primary" fullWidth onClick={handleStartLearning}>
                        重新学习
                      </Button>
                      <Button variant="secondary" fullWidth onClick={handleEndLearning}>
                        结束学习
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : isPracticing ? (
              <div className="mb-6">
                {currentQuestion ? (
                  <div className="max-w-3xl mx-auto">
                    {/* 答题进度 */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-sm text-gray-500">
                          题目 {currentQuestionIndex + 1} / {totalQuestions}
                        </div>
                        <div className="text-sm text-gray-500">
                          得分：{correctAnswers} / {totalQuestions}
                        </div>
                      </div>
                      <ProgressBar 
                        current={currentQuestionIndex + 1} 
                        total={totalQuestions} 
                        label="答题进度" 
                        className="mb-4" 
                      />
                    </div>
                    
                    {/* 题目卡片 */}
                    <QuestionCard
                      question={currentQuestion}
                      onAnswer={handleAnswer}
                      onNext={handleNextQuestion}
                    />
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-bold mb-2">加载题目中...</h3>
                    <p className="text-gray-600">请稍候，正在准备题目</p>
                  </div>
                )}
                
                {/* 练习完成结果 */}
                {isPracticeCompleted && (
                  <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-lg">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold mb-2">练习完成！</h3>
                      <p className="text-gray-600 mb-4">恭喜您完成了本节的题目练习</p>
                      <div className="flex justify-center items-center gap-4 mb-6">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-blue-600">{correctAnswers}</div>
                          <div className="text-sm text-gray-500">答对题数</div>
                        </div>
                        <div className="text-2xl font-bold text-gray-400">/</div>
                        <div className="text-center">
                          <div className="text-4xl font-bold text-gray-600">{totalQuestions}</div>
                          <div className="text-sm text-gray-500">总题数</div>
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-green-600 mb-4">
                        {Math.round((correctAnswers / totalQuestions) * 100)}%
                      </div>
                      <div className="text-sm text-gray-500">正确率</div>
                    </div>
                    
                    <div className="space-y-4">
                      <Button variant="primary" fullWidth onClick={handleStartPractice}>
                        重新练习
                      </Button>
                      <Button variant="secondary" fullWidth onClick={handleEndPractice}>
                        结束练习
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 知识点学习 */}
                <Card title="知识点学习" className="h-full">
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">本节知识点：</h4>
                    <div className="text-gray-600 mb-4">
                      共 {currentSection.questions.length > 0 ? currentSection.questions.length : 0} 个知识点
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
                      <div className="font-medium mb-2">学习建议：</div>
                      <div className="text-sm text-gray-600">
                        建议先学习知识点，再进行题目练习和模拟器操作，这样可以更好地理解和掌握相关知识。
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button variant="primary" fullWidth onClick={handleStartLearning}>
                      开始学习知识点
                    </Button>
                  </div>
                </Card>

                {/* 题目练习 */}
                <Card title="题目练习" className="h-full">
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">本节题目：</h4>
                    <div className="text-gray-600 mb-4">
                      共 {currentSection.questions.length} 道题目
                    </div>
                    {currentSection.questions.length > 0 ? (
                      <ul className="space-y-3">
                        {currentSection.questions.map((questionId, index) => (
                          <li key={questionId} className="bg-gray-50 p-3 rounded-lg">
                            <div className="font-medium">{index + 1}. 题目 {questionId}</div>
                            <div className="text-sm text-gray-500">点击开始答题</div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-gray-500 text-center py-4">
                        暂无题目
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <Button variant="primary" fullWidth onClick={handleStartPractice}>
                      开始答题
                    </Button>
                  </div>
                </Card>

                {/* 模拟器 */}
                {currentSection.simulator && (
                  <Card title="模拟器练习" className="h-full md:col-span-2">
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">模拟器名称：</h4>
                      <div className="text-gray-600 mb-4">
                        {currentSection.simulator}
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <div className="font-medium mb-2">模拟器说明：</div>
                        <div className="text-sm text-gray-600">
                          通过模拟器实战练习，加深对知识点的理解。
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button variant="primary" fullWidth onClick={() => currentSection.simulator && handleOpenSimulator(currentSection.simulator)}>
                        进入模拟器
                      </Button>
                    </div>
                  </Card>
                )}
              </div>
            )}
          </div>
        )}
      </main>
      
      {/* 模拟器模态框 */}
      <Modal
        isOpen={isSimulatorOpen}
        onClose={handleCloseSimulator}
        size="xl"
        title="模拟器练习"
      >
        <div className="p-2">
          {currentSimulator}
        </div>
      </Modal>

      {/* 页脚 */}
      <footer className="bg-gradient-to-br from-indigo-900 via-blue-800 to-purple-900 mt-12 pt-12 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* IP Branding */}
            <div className="text-center md:text-left">
              <div className="text-2xl font-bold text-white mb-2">
                <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                  电力江湖
                </span>
              </div>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                <div className="bg-yellow-400 text-indigo-900 font-bold px-3 py-1 rounded-full text-xs">
                  清风道长
                </div>
                <div className="bg-yellow-400 text-indigo-900 font-bold px-3 py-1 rounded-full text-xs">
                  贫道略懂
                </div>
                <div className="bg-yellow-400 text-indigo-900 font-bold px-3 py-1 rounded-full text-xs">
                  电力江湖
                </div>
              </div>
              <div className="text-blue-100 text-sm">
                江湖险恶，学习电力规则防身；电力江湖，掌握规则走遍天下
              </div>
            </div>
            
            {/* Quick Links */}
            <div className="text-center">
              <div className="text-lg font-semibold text-white mb-4">快速链接</div>
              <div className="space-y-2">
                <a href="#" className="text-blue-100 hover:text-yellow-400 transition-colors text-sm">首页</a>
                <br />
                <a href="#" className="text-blue-100 hover:text-yellow-400 transition-colors text-sm">关卡列表</a>
                <br />
                <a href="#" className="text-blue-100 hover:text-yellow-400 transition-colors text-sm">模拟器</a>
                <br />
                <a href="#" className="text-blue-100 hover:text-yellow-400 transition-colors text-sm">知识点库</a>
              </div>
            </div>
            
            {/* System Info */}
            <div className="text-center md:text-right">
              <div className="text-lg font-semibold text-white mb-4">系统信息</div>
              <div className="space-y-2 text-sm text-blue-100">
                <div>江西电力市场规则（4.0版）</div>
                <div>基于React 18 + TypeScript开发</div>
                <div>© 2026 电力江湖</div>
              </div>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="border-t border-white/20 pt-6 mt-6 text-center">
            <p className="text-white/60 text-sm">
              江西电力市场规则学习闯关系统 | 开发：清风道长-贫道略懂-电力江湖
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;