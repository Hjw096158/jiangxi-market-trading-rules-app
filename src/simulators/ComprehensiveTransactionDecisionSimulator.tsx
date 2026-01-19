import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import Card from '../components/Card';

interface MarketEvent {
  id: string;
  name: string;
  type: 'policy' | 'weather' | 'economic' | 'technical';
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
  probability: 'low' | 'medium' | 'high';
  expectedEffect: string;
}

interface DecisionOption {
  id: string;
  name: string;
  description: string;
  action: string;
  riskLevel: 'low' | 'medium' | 'high';
  potentialReward: 'low' | 'medium' | 'high';
  expectedOutcome: string;
}

interface RoundResult {
  round: number;
  event: MarketEvent;
  chosenOption: DecisionOption;
  actualOutcome: string;
  score: number;
  cumulativeScore: number;
  roundEvaluation: string;
}

interface GameResult {
  totalRounds: number;
  totalScore: number;
  averageScore: number;
  roundResults: RoundResult[];
  finalEvaluation: string;
  recommendations: string[];
  gameLevel: 'beginner' | 'intermediate' | 'advanced';
}

const ComprehensiveTransactionDecisionSimulator: React.FC = () => {
  // 模拟器状态
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [roundResults, setRoundResults] = useState<RoundResult[]>([]);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  
  // 市场事件数据
  const marketEvents: MarketEvent[] = [
    {
      id: 'event-1',
      name: '政府出台新能源补贴政策',
      type: 'policy',
      description: '国家宣布提高新能源发电补贴标准，鼓励清洁能源发展',
      impact: 'positive',
      probability: 'high',
      expectedEffect: '新能源发电企业收益增加，市场电价可能下降'
    },
    {
      id: 'event-2',
      name: '夏季高温天气',
      type: 'weather',
      description: '全国范围内出现持续高温天气，用电需求激增',
      impact: 'positive',
      probability: 'medium',
      expectedEffect: '用电需求增加，市场电价上涨'
    },
    {
      id: 'event-3',
      name: '经济增速放缓',
      type: 'economic',
      description: '宏观经济增速放缓，工业用电需求下降',
      impact: 'negative',
      probability: 'low',
      expectedEffect: '用电需求减少，市场电价下跌'
    },
    {
      id: 'event-4',
      name: '电网故障',
      type: 'technical',
      description: '主要输电线路发生故障，电力供应紧张',
      impact: 'negative',
      probability: 'low',
      expectedEffect: '局部地区电力供应不足，电价波动剧烈'
    },
    {
      id: 'event-5',
      name: '国际能源价格上涨',
      type: 'economic',
      description: '国际煤炭、天然气价格大幅上涨',
      impact: 'negative',
      probability: 'medium',
      expectedEffect: '火力发电成本增加，市场电价上涨'
    }
  ];
  
  // 决策选项数据
  const generateDecisionOptions = (event: MarketEvent): DecisionOption[] => {
    if (event.impact === 'positive') {
      return [
        {
          id: 'option-1',
          name: '增加现货市场交易',
          description: '利用市场价格上涨机会，增加现货市场交易量',
          action: '提高现货市场申报电量，降低长期合同比例',
          riskLevel: 'medium',
          potentialReward: 'high',
          expectedOutcome: '在价格上涨期间获得更高收益'
        },
        {
          id: 'option-2',
          name: '锁定长期合同',
          description: '与客户签订长期合同，锁定当前价格',
          action: '增加年度、月度合同比例，减少现货交易',
          riskLevel: 'low',
          potentialReward: 'medium',
          expectedOutcome: '确保稳定收益，避免市场价格波动风险'
        },
        {
          id: 'option-3',
          name: '观望等待',
          description: '暂不调整交易策略，观察市场变化',
          action: '保持现有交易结构不变',
          riskLevel: 'low',
          potentialReward: 'low',
          expectedOutcome: '避免决策失误，但可能错过收益机会'
        }
      ];
    } else if (event.impact === 'negative') {
      return [
        {
          id: 'option-1',
          name: '增加长期合同比例',
          description: '通过长期合同锁定价格，降低市场风险',
          action: '增加年度、月度合同比例，减少现货交易',
          riskLevel: 'low',
          potentialReward: 'medium',
          expectedOutcome: '稳定收益，降低市场价格下跌风险'
        },
        {
          id: 'option-2',
          name: '参与辅助服务市场',
          description: '转向辅助服务市场，寻找新的收益增长点',
          action: '减少电能量市场交易，增加辅助服务提供',
          riskLevel: 'high',
          potentialReward: 'high',
          expectedOutcome: '在电能量市场低迷时，通过辅助服务获得收益'
        },
        {
          id: 'option-3',
          name: '降低发电量',
          description: '减少发电量，降低成本支出',
          action: '降低机组出力，减少燃料消耗',
          riskLevel: 'medium',
          potentialReward: 'low',
          expectedOutcome: '减少损失，但可能影响市场份额'
        }
      ];
    } else {
      return [
        {
          id: 'option-1',
          name: '维持现有策略',
          description: '保持当前交易结构不变',
          action: '继续执行现有交易计划',
          riskLevel: 'low',
          potentialReward: 'medium',
          expectedOutcome: '稳定运营，避免不必要的风险'
        },
        {
          id: 'option-2',
          name: '优化交易结构',
          description: '调整不同交易品种的比例，优化收益结构',
          action: '微调各交易市场的电量分配',
          riskLevel: 'medium',
          potentialReward: 'medium',
          expectedOutcome: '在稳定市场中获得更好的收益结构'
        },
        {
          id: 'option-3',
          name: '拓展新市场',
          description: '尝试进入新的交易市场或品种',
          action: '探索绿电交易、容量市场等新领域',
          riskLevel: 'high',
          potentialReward: 'high',
          expectedOutcome: '开拓新的收益来源，但存在一定风险'
        }
      ];
    }
  };
  
  // 当前轮次数据
  const currentEvent = marketEvents[currentRound];
  const currentOptions = generateDecisionOptions(currentEvent);
  
  // 选择决策选项
  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
  };
  
  // 计算轮次结果
  const calculateRoundResult = () => {
    const chosenOption = currentOptions.find(option => option.id === selectedOption) || currentOptions[0];
    
    // 计算得分（基于风险和收益的平衡）
    const riskScore = chosenOption.riskLevel === 'low' ? 30 : chosenOption.riskLevel === 'medium' ? 20 : 10;
    const rewardScore = chosenOption.potentialReward === 'high' ? 40 : chosenOption.potentialReward === 'medium' ? 30 : 20;
    const appropriatenessScore = currentEvent.impact === 'positive' && chosenOption.potentialReward === 'high' ? 30 : 
                                 currentEvent.impact === 'negative' && chosenOption.riskLevel === 'low' ? 30 : 20;
    
    let roundScore = riskScore + rewardScore + appropriatenessScore;
    
    // 随机因素（±10分）
    const randomFactor = Math.floor(Math.random() * 21) - 10;
    roundScore = Math.max(0, Math.min(100, roundScore + randomFactor));
    
    // 累积得分
    const cumulativeScore = roundResults.reduce((sum, result) => sum + result.score, 0) + roundScore;
    
    // 生成实际结果和评价
    const actualOutcomes = [
      '市场发展符合预期，决策取得了良好效果',
      '市场出现了一些意外变化，但决策基本适应了市场情况',
      '市场变化超出预期，决策效果不佳',
      '决策非常成功，获得了超出预期的收益',
      '决策存在一定失误，导致了一些损失'
    ];
    
    const actualOutcome = actualOutcomes[Math.floor(Math.random() * actualOutcomes.length)];
    
    let roundEvaluation = '';
    if (roundScore >= 80) {
      roundEvaluation = '决策非常优秀，充分利用了市场机会，风险控制得当';
    } else if (roundScore >= 60) {
      roundEvaluation = '决策良好，基本适应了市场情况，取得了预期效果';
    } else if (roundScore >= 40) {
      roundEvaluation = '决策一般，存在一些不足之处，需要进一步改进';
    } else {
      roundEvaluation = '决策不佳，未能有效应对市场变化，需要认真总结经验教训';
    }
    
    const result: RoundResult = {
      round: currentRound + 1,
      event: currentEvent,
      chosenOption,
      actualOutcome,
      score: roundScore,
      cumulativeScore,
      roundEvaluation
    };
    
    const newResults = [...roundResults, result];
    setRoundResults(newResults);
    
    // 检查游戏是否完成
    if (currentRound < marketEvents.length - 1) {
      setShowResult(true);
    } else {
      // 游戏完成，计算最终结果
      const totalScore = newResults.reduce((sum, result) => sum + result.score, 0);
      const averageScore = totalScore / newResults.length;
      
      let finalEvaluation = '';
      let gameLevel: 'beginner' | 'intermediate' | 'advanced' = 'beginner';
      
      if (averageScore >= 80) {
        finalEvaluation = '恭喜！您在综合交易决策模拟中表现出色，展现了优秀的市场分析能力和决策水平。您能够准确把握市场机会，合理控制风险，是一名出色的电力市场交易者。';
        gameLevel = 'advanced';
      } else if (averageScore >= 60) {
        finalEvaluation = '不错！您在综合交易决策模拟中表现良好，具备基本的市场分析能力和决策水平。您能够根据市场情况做出合理决策，但在风险控制和机会把握方面还有提升空间。';
        gameLevel = 'intermediate';
      } else {
        finalEvaluation = '继续努力！您在综合交易决策模拟中表现一般，需要进一步提升市场分析能力和决策水平。建议您加强对电力市场规则的学习，提高对市场变化的敏感度和应对能力。';
        gameLevel = 'beginner';
      }
      
      // 生成建议
      const recommendations = [
        '关注政策变化，及时调整交易策略',
        '合理组合不同交易品种，分散市场风险',
        '加强市场预测能力，提高决策的前瞻性',
        '建立完善的风险管理机制',
        '不断学习和总结经验，持续提升决策水平'
      ];
      
      const gameResultData: GameResult = {
        totalRounds: marketEvents.length,
        totalScore,
        averageScore,
        roundResults: newResults,
        finalEvaluation,
        recommendations,
        gameLevel
      };
      
      setGameResult(gameResultData);
      setGameCompleted(true);
    }
  };
  
  // 进入下一轮
  const nextRound = () => {
    setShowResult(false);
    setSelectedOption('');
    setCurrentRound(prev => prev + 1);
  };
  
  // 重置游戏
  const resetGame = () => {
    setCurrentRound(0);
    setSelectedOption('');
    setShowResult(false);
    setRoundResults([]);
    setGameCompleted(false);
    setGameResult(null);
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center mb-4">7-4 综合交易决策模拟器</h2>
      
      {/* 模拟器说明 */}
      <Card className="mb-6">
        <h3 className="text-lg font-semibold mb-4">模拟器说明</h3>
        <p className="text-gray-600 mb-4">
          本模拟器是一个5轮的综合交易决策游戏，您将面对不同的市场事件，需要做出相应的交易决策。
          每轮您需要根据市场事件的性质和影响，选择合适的交易策略，以实现收益最大化和风险最小化。
        </p>
        <p className="text-gray-600">
          游戏结束后，系统将根据您的决策表现给出综合评价和改进建议。通过这个模拟器，您可以锻炼
          在复杂市场环境下的决策能力，提高对电力市场规则的理解和应用水平。
        </p>
      </Card>
      
      {!gameCompleted ? (
        <>
          {/* 游戏进度 */}
          <Card className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">游戏进度</h3>
              <div className="text-sm text-gray-500">
                第 {currentRound + 1} 轮 / 共 {marketEvents.length} 轮
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${((currentRound + 1) / marketEvents.length) * 100}%` }}
              ></div>
            </div>
            {roundResults.length > 0 && (
              <div className="mt-4 text-right">
                <div className="text-sm text-gray-500">当前累积得分：</div>
                <div className="font-bold text-lg">{roundResults.reduce((sum, result) => sum + result.score, 0)}</div>
              </div>
            )}
          </Card>
          
          {!showResult ? (
            <>
              {/* 当前市场事件 */}
              <Card className="mb-6">
                <h3 className="text-lg font-semibold mb-4">当前市场事件</h3>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{currentEvent.name}</h4>
                      <div className="text-sm text-gray-500 mt-1">{currentEvent.type === 'policy' ? '政策事件' : currentEvent.type === 'weather' ? '天气事件' : currentEvent.type === 'economic' ? '经济事件' : '技术事件'}</div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${currentEvent.impact === 'positive' ? 'bg-green-100 text-green-700' : currentEvent.impact === 'negative' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                      {currentEvent.impact === 'positive' ? '正面影响' : currentEvent.impact === 'negative' ? '负面影响' : '中性影响'}
                    </div>
                  </div>
                  <div className="mt-3">
                    <h5 className="font-medium text-sm">事件描述：</h5>
                    <p className="text-gray-700 mt-1">{currentEvent.description}</p>
                  </div>
                  <div className="mt-3">
                    <h5 className="font-medium text-sm">预期影响：</h5>
                    <p className="text-gray-700 mt-1">{currentEvent.expectedEffect}</p>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-sm text-gray-500">事件概率：</div>
                      <div className={`font-medium ${currentEvent.probability === 'high' ? 'text-green-700' : currentEvent.probability === 'medium' ? 'text-yellow-700' : 'text-red-700'}`}>
                        {currentEvent.probability === 'high' ? '高' : currentEvent.probability === 'medium' ? '中' : '低'}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">影响程度：</div>
                      <div className={`font-medium ${currentEvent.impact === 'positive' ? 'text-green-700' : currentEvent.impact === 'negative' ? 'text-red-700' : 'text-blue-700'}`}>
                        {currentEvent.impact === 'positive' ? '正面' : currentEvent.impact === 'negative' ? '负面' : '中性'}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
              
              {/* 决策选项 */}
              <Card className="mb-6">
                <h3 className="text-lg font-semibold mb-4">决策选项</h3>
                <div className="space-y-3">
                  {currentOptions.map(option => (
                    <motion.div
                      key={option.id}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                      className={`cursor-pointer ${selectedOption === option.id ? 'ring-2 ring-blue-500' : ''}`}
                    >
                      <Card 
                        className="h-full p-4"
                        onClick={() => handleOptionSelect(option.id)}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold">{option.name}</h4>
                            <div className="text-sm text-gray-600 mt-1">{option.description}</div>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${selectedOption === option.id ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                            {selectedOption === option.id ? '已选择' : '选择'}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <div className="text-sm text-gray-500">行动方案：</div>
                            <div className="text-gray-700 mt-1 text-sm">{option.action}</div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <div className="text-sm text-gray-500">风险等级：</div>
                              <div className={`font-medium ${option.riskLevel === 'high' ? 'text-red-600' : option.riskLevel === 'medium' ? 'text-yellow-600' : 'text-green-600'}`}>
                                {option.riskLevel === 'high' ? '高' : option.riskLevel === 'medium' ? '中' : '低'}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">潜在收益：</div>
                              <div className={`font-medium ${option.potentialReward === 'high' ? 'text-green-600' : option.potentialReward === 'medium' ? 'text-yellow-600' : 'text-red-600'}`}>
                                {option.potentialReward === 'high' ? '高' : option.potentialReward === 'medium' ? '中' : '低'}
                              </div>
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">预期结果：</div>
                            <div className="text-gray-700 mt-1 text-sm">{option.expectedOutcome}</div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </Card>
              
              {/* 决策按钮 */}
              <div className="flex justify-center">
                <Button 
                  variant="primary"
                  size="large"
                  onClick={calculateRoundResult}
                  disabled={!selectedOption}
                >
                  执行决策
                </Button>
              </div>
            </>
          ) : (
            /* 轮次结果 */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {roundResults.length > 0 && (
                <Card className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">第 {currentRound + 1} 轮结果</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* 结果概览 */}
                    <div>
                      <div className="p-4 bg-green-50 rounded-lg mb-4">
                        <div className="text-center">
                          <div className="text-gray-500 text-sm mb-1">本轮得分</div>
                          <div className="text-3xl font-bold text-green-700">{roundResults[roundResults.length - 1].score}</div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="text-center">
                          <div className="text-gray-500 text-sm mb-1">累积得分</div>
                          <div className="text-3xl font-bold text-blue-700">{roundResults[roundResults.length - 1].cumulativeScore}</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* 详细结果 */}
                    <div>
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm text-gray-500">市场事件：</div>
                          <div className="font-medium">{roundResults[roundResults.length - 1].event.name}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">选择的决策：</div>
                          <div className="font-medium">{roundResults[roundResults.length - 1].chosenOption.name}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">实际结果：</div>
                          <div className="text-gray-700">{roundResults[roundResults.length - 1].actualOutcome}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">本轮评价：</div>
                          <div className="text-gray-700">{roundResults[roundResults.length - 1].roundEvaluation}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 继续按钮 */}
                  <div className="flex justify-center">
                    <Button 
                      variant="primary"
                      onClick={nextRound}
                    >
                      进入下一轮
                    </Button>
                  </div>
                </Card>
              )}
            </motion.div>
          )}
        </>
      ) : (
        /* 游戏完成结果 */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {gameResult && (
            <Card className="mb-6">
              <h3 className="text-xl font-semibold mb-6 text-center">游戏完成！</h3>
              
              {/* 最终得分 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-gray-500 text-sm mb-1">总得分</div>
                  <div className="text-3xl font-bold text-green-700">{gameResult.totalScore}</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-gray-500 text-sm mb-1">平均得分</div>
                  <div className="text-3xl font-bold text-blue-700">{gameResult.averageScore.toFixed(1)}</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <div className="text-gray-500 text-sm mb-1">游戏等级</div>
                  <div className="text-3xl font-bold text-purple-700">
                    {gameResult.gameLevel === 'advanced' ? '高级' : gameResult.gameLevel === 'intermediate' ? '中级' : '初级'}
                  </div>
                </div>
              </div>
              
              {/* 每轮结果 */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3">每轮详细结果</h4>
                <div className="space-y-3">
                  {gameResult.roundResults.map((result, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-medium">第 {result.round} 轮</div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${result.score >= 80 ? 'bg-green-100 text-green-700' : result.score >= 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                          {result.score} 分
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                        <div>
                          <div className="text-gray-500">事件：</div>
                          <div>{result.event.name}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">决策：</div>
                          <div>{result.chosenOption.name}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">评价：</div>
                          <div>{result.roundEvaluation}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 最终评价和建议 */}
              <div className="space-y-4 mb-8">
                <Card className="p-4">
                  <h4 className="font-medium mb-2">最终评价</h4>
                  <p className="text-gray-700">{gameResult.finalEvaluation}</p>
                </Card>
                <Card className="p-4">
                  <h4 className="font-medium mb-2">改进建议</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {gameResult.recommendations.map((recommendation, index) => (
                      <li key={index}>{recommendation}</li>
                    ))}
                  </ul>
                </Card>
              </div>
              
              {/* 重置按钮 */}
              <div className="flex justify-center">
                <Button 
                  variant="primary"
                  size="large"
                  onClick={resetGame}
                >
                  重新开始游戏
                </Button>
              </div>
            </Card>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default ComprehensiveTransactionDecisionSimulator;