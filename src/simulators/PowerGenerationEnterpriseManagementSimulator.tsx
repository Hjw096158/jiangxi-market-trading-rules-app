import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import Card from '../components/Card';

interface MarketScenario {
  id: string;
  name: string;
  description: string;
  demand: 'high' | 'medium' | 'low';
  priceTrend: 'rising' | 'stable' | 'falling';
  renewableEnergyRatio: number;
  fuelPrice: number;
}

interface TransactionOption {
  id: string;
  name: string;
  type: 'annual' | 'monthly' | 'day-ahead';
  price: number;
  quantity: number;
  risk: 'low' | 'medium' | 'high';
  profitPotential: 'low' | 'medium' | 'high';
}

interface DecisionResult {
  scenario: MarketScenario;
  chosenOptions: TransactionOption[];
  totalRevenue: number;
  totalCost: number;
  profit: number;
  riskLevel: 'low' | 'medium' | 'high';
  evaluation: string;
}

const PowerGenerationEnterpriseManagementSimulator: React.FC = () => {
  // 模拟器状态
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [decisionHistory, setDecisionHistory] = useState<DecisionResult[]>([]);
  const [simulationComplete, setSimulationComplete] = useState(false);
  
  // 市场场景数据
  const marketScenarios: MarketScenario[] = [
    {
      id: 'scenario-1',
      name: '夏季用电高峰',
      description: '夏季高温导致用电需求激增，电网负荷达到峰值',
      demand: 'high',
      priceTrend: 'rising',
      renewableEnergyRatio: 0.3,
      fuelPrice: 800
    },
    {
      id: 'scenario-2',
      name: '春秋季平峰期',
      description: '春秋季气温适宜，用电需求平稳，可再生能源发电充足',
      demand: 'medium',
      priceTrend: 'stable',
      renewableEnergyRatio: 0.5,
      fuelPrice: 700
    },
    {
      id: 'scenario-3',
      name: '冬季枯水期',
      description: '冬季降水减少，水电出力不足，火电需求增加',
      demand: 'high',
      priceTrend: 'rising',
      renewableEnergyRatio: 0.2,
      fuelPrice: 900
    },
    {
      id: 'scenario-4',
      name: '新能源大发期',
      description: '风力和太阳能资源丰富，新能源发电比例高，电力供应充足',
      demand: 'medium',
      priceTrend: 'falling',
      renewableEnergyRatio: 0.7,
      fuelPrice: 650
    },
    {
      id: 'scenario-5',
      name: '经济下行期',
      description: '经济增速放缓，工业用电需求下降，电力市场供大于求',
      demand: 'low',
      priceTrend: 'falling',
      renewableEnergyRatio: 0.4,
      fuelPrice: 600
    }
  ];
  
  // 交易选项数据
  const generateTransactionOptions = (scenario: MarketScenario): TransactionOption[] => {
    const basePrice = scenario.demand === 'high' ? 500 : scenario.demand === 'medium' ? 400 : 300;
    
    return [
      {
        id: 'option-1',
        name: '年度合同交易',
        type: 'annual',
        price: basePrice * 0.95,
        quantity: 100000,
        risk: 'low',
        profitPotential: 'low'
      },
      {
        id: 'option-2',
        name: '月度集中竞价',
        type: 'monthly',
        price: basePrice * (scenario.priceTrend === 'rising' ? 1.05 : scenario.priceTrend === 'falling' ? 0.95 : 1),
        quantity: 50000,
        risk: 'medium',
        profitPotential: 'medium'
      },
      {
        id: 'option-3',
        name: '日前现货市场',
        type: 'day-ahead',
        price: basePrice * (scenario.priceTrend === 'rising' ? 1.15 : scenario.priceTrend === 'falling' ? 0.85 : 1),
        quantity: 30000,
        risk: 'high',
        profitPotential: 'high'
      },
      {
        id: 'option-4',
        name: '双边协商交易',
        type: 'monthly',
        price: basePrice * 1,
        quantity: 70000,
        risk: 'medium',
        profitPotential: 'medium'
      }
    ];
  };
  
  // 当前场景
  const currentScenario = marketScenarios[currentRound];
  // 当前交易选项
  const currentOptions = generateTransactionOptions(currentScenario);
  
  // 选择交易选项
  const toggleOption = (optionId: string) => {
    setSelectedOptions(prev => 
      prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };
  
  // 计算决策结果
  const calculateResults = () => {
    const chosenOptions = currentOptions.filter(option => selectedOptions.includes(option.id));
    
    // 计算总成本和总收入
    let totalRevenue = 0;
    let totalCost = 0;
    
    chosenOptions.forEach(option => {
      totalRevenue += option.price * option.quantity;
      // 成本计算：燃料成本 + 固定成本
      const fuelCost = currentScenario.fuelPrice * option.quantity * 0.5;
      const fixedCost = option.quantity * 50;
      totalCost += fuelCost + fixedCost;
    });
    
    const profit = totalRevenue - totalCost;
    
    // 风险评估
    const riskLevels = chosenOptions.map(option => {
      if (option.risk === 'high') return 3;
      if (option.risk === 'medium') return 2;
      return 1;
    });
    const avgRisk = riskLevels.length > 0 ? riskLevels.reduce((a, b) => a + b, 0) / riskLevels.length : 1;
    
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    if (avgRisk > 2.5) riskLevel = 'high';
    else if (avgRisk > 1.5) riskLevel = 'medium';
    
    // 决策评价
    let evaluation = '';
    if (profit > 5000000) {
      evaluation = '优秀的决策！您在当前市场环境下获得了可观的利润。';
    } else if (profit > 2000000) {
      evaluation = '良好的决策，您获得了不错的利润。';
    } else if (profit > 0) {
      evaluation = '基本合格的决策，您实现了盈利。';
    } else {
      evaluation = '需要改进的决策，您出现了亏损。';
    }
    
    const result: DecisionResult = {
      scenario: currentScenario,
      chosenOptions,
      totalRevenue,
      totalCost,
      profit,
      riskLevel,
      evaluation
    };
    
    setDecisionHistory(prev => [...prev, result]);
    setShowResults(true);
  };
  
  // 进入下一轮
  const nextRound = () => {
    setShowResults(false);
    setSelectedOptions([]);
    
    if (currentRound < marketScenarios.length - 1) {
      setCurrentRound(prev => prev + 1);
    } else {
      setSimulationComplete(true);
    }
  };
  
  // 重置模拟
  const resetSimulation = () => {
    setCurrentRound(0);
    setSelectedOptions([]);
    setShowResults(false);
    setDecisionHistory([]);
    setSimulationComplete(false);
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center mb-4">7-1 发电企业经营模拟器</h2>
      
      {/* 模拟器说明 */}
      <Card className="mb-6">
        <h3 className="text-lg font-semibold mb-4">模拟器说明</h3>
        <p className="text-gray-600 mb-4">
          本模拟器模拟发电企业在不同市场环境下的经营决策过程。您需要根据当前市场场景，选择合适的交易方式和电量组合，
          以实现企业利润最大化。模拟共分为5轮，每轮代表不同的市场环境。
        </p>
        <p className="text-gray-600">
          每轮您可以选择多种交易方式组合，包括年度合同、月度集中竞价、日前现货市场和双边协商交易。
          不同的交易方式具有不同的风险和收益特征，您需要根据市场情况做出合理决策。
        </p>
      </Card>
      
      {!simulationComplete ? (
        <>
          {/* 模拟进度 */}
          <Card className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">模拟进度</h3>
              <div className="text-sm text-gray-500">
                第 {currentRound + 1} 轮 / 共 {marketScenarios.length} 轮
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${((currentRound + 1) / marketScenarios.length) * 100}%` }}
              ></div>
            </div>
          </Card>
          
          {/* 当前市场场景 */}
          <Card className="mb-6">
            <h3 className="text-lg font-semibold mb-4">当前市场场景</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-blue-700 mb-2">{currentScenario.name}</h4>
                <p className="text-gray-600 mb-4">{currentScenario.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">用电需求：</span>
                    <span className={`font-medium ${currentScenario.demand === 'high' ? 'text-red-600' : currentScenario.demand === 'medium' ? 'text-yellow-600' : 'text-green-600'}`}>
                      {currentScenario.demand === 'high' ? '高' : currentScenario.demand === 'medium' ? '中' : '低'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">价格趋势：</span>
                    <span className={`font-medium ${currentScenario.priceTrend === 'rising' ? 'text-green-600' : currentScenario.priceTrend === 'falling' ? 'text-red-600' : 'text-blue-600'}`}>
                      {currentScenario.priceTrend === 'rising' ? '上涨' : currentScenario.priceTrend === 'falling' ? '下跌' : '稳定'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">新能源发电比例：</span>
                    <span className="font-medium">{currentScenario.renewableEnergyRatio * 100}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">燃料价格：</span>
                    <span className="font-medium">{currentScenario.fuelPrice} 元/吨</span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-700 mb-2">决策提示</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {currentScenario.demand === 'high' && (
                    <li>当前需求高，可考虑提高现货市场交易比例以获取更高收益</li>
                  )}
                  {currentScenario.demand === 'low' && (
                    <li>当前需求低，建议增加长期合同比例以降低风险</li>
                  )}
                  {currentScenario.priceTrend === 'rising' && (
                    <li>价格呈上涨趋势，可考虑提前锁定未来交易价格</li>
                  )}
                  {currentScenario.priceTrend === 'falling' && (
                    <li>价格呈下跌趋势，建议减少长期合同，增加短期灵活交易</li>
                  )}
                  {currentScenario.renewableEnergyRatio > 0.5 && (
                    <li>新能源发电比例高，需注意市场价格波动风险</li>
                  )}
                </ul>
              </div>
            </div>
          </Card>
          
          {/* 交易选项 */}
          <Card className="mb-6">
            <h3 className="text-lg font-semibold mb-4">交易选项</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentOptions.map(option => (
                <motion.div
                  key={option.id}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className={`cursor-pointer ${selectedOptions.includes(option.id) ? 'ring-2 ring-blue-500' : ''}`}
                >
                  <Card 
                    className="h-full p-4"
                    onClick={() => toggleOption(option.id)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{option.name}</h4>
                        <div className="text-sm text-gray-500 mt-1">{option.type === 'annual' ? '年度' : option.type === 'monthly' ? '月度' : '日前'}交易</div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${selectedOptions.includes(option.id) ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                        {selectedOptions.includes(option.id) ? '已选择' : '未选择'}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">交易价格：</span>
                        <span className="font-medium">{option.price} 元/MWh</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">建议交易量：</span>
                        <span className="font-medium">{option.quantity.toLocaleString()} MWh</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <div className="text-gray-500 text-sm">风险等级：</div>
                          <div className={`font-medium text-xs ${option.risk === 'high' ? 'text-red-600' : option.risk === 'medium' ? 'text-yellow-600' : 'text-green-600'}`}>
                            {option.risk === 'high' ? '高' : option.risk === 'medium' ? '中' : '低'}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-sm">收益潜力：</div>
                          <div className={`font-medium text-xs ${option.profitPotential === 'high' ? 'text-green-600' : option.profitPotential === 'medium' ? 'text-yellow-600' : 'text-red-600'}`}>
                            {option.profitPotential === 'high' ? '高' : option.profitPotential === 'medium' ? '中' : '低'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </Card>
          
          {/* 决策结果 */}
          {showResults && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="mb-6">
                <h3 className="text-lg font-semibold mb-4">决策结果</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-gray-500 text-sm mb-1">总收入</div>
                      <div className="text-2xl font-bold text-green-700">
                        {decisionHistory[currentRound].totalRevenue.toLocaleString()} 元
                      </div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <div className="text-gray-500 text-sm mb-1">总成本</div>
                      <div className="text-2xl font-bold text-red-700">
                        {decisionHistory[currentRound].totalCost.toLocaleString()} 元
                      </div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-gray-500 text-sm mb-1">净利润</div>
                      <div className={`text-2xl font-bold ${decisionHistory[currentRound].profit > 0 ? 'text-green-700' : 'text-red-700'}`}>
                        {decisionHistory[currentRound].profit.toLocaleString()} 元
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">风险等级：</span>
                      <span className={`font-medium ${decisionHistory[currentRound].riskLevel === 'high' ? 'text-red-600' : decisionHistory[currentRound].riskLevel === 'medium' ? 'text-yellow-600' : 'text-green-600'}`}>
                        {decisionHistory[currentRound].riskLevel === 'high' ? '高' : decisionHistory[currentRound].riskLevel === 'medium' ? '中' : '低'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">决策评价：</span>
                      <p className="mt-1 text-gray-700">{decisionHistory[currentRound].evaluation}</p>
                    </div>
                  </div>
                  <div className="flex justify-center mt-4">
                    <Button 
                      variant="primary"
                      onClick={nextRound}
                    >
                      {currentRound < marketScenarios.length - 1 ? '进入下一轮' : '查看最终结果'}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
          
          {/* 决策按钮 */}
          {!showResults && (
            <div className="flex justify-center mt-6">
              <Button 
                variant="primary"
                size="large"
                onClick={calculateResults}
                disabled={selectedOptions.length === 0}
              >
                执行决策
              </Button>
            </div>
          )}
        </>
      ) : (
        /* 模拟完成结果 */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="mb-6">
            <h3 className="text-xl font-semibold mb-6 text-center">模拟完成！</h3>
            
            {/* 总体业绩 */}
            <div className="space-y-6 mb-8">
              <div>
                <h4 className="text-lg font-semibold mb-4 text-center">总体业绩</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-gray-500 text-sm mb-1">总销售收入</div>
                    <div className="text-2xl font-bold text-green-700">
                      {decisionHistory.reduce((sum, result) => sum + result.totalRevenue, 0).toLocaleString()} 元
                    </div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg text-center">
                    <div className="text-gray-500 text-sm mb-1">总运营成本</div>
                    <div className="text-2xl font-bold text-red-700">
                      {decisionHistory.reduce((sum, result) => sum + result.totalCost, 0).toLocaleString()} 元
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-gray-500 text-sm mb-1">总净利润</div>
                    <div className={`text-2xl font-bold ${decisionHistory.reduce((sum, result) => sum + result.profit, 0) > 0 ? 'text-green-700' : 'text-red-700'}`}>
                      {decisionHistory.reduce((sum, result) => sum + result.profit, 0).toLocaleString()} 元
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 各轮结果 */}
              <div>
                <h4 className="text-lg font-semibold mb-4">各轮决策结果</h4>
                <div className="space-y-4">
                  {decisionHistory.map((result, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h5 className="font-medium">第 {index + 1} 轮：{result.scenario.name}</h5>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${result.profit > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {result.profit > 0 ? '盈利' : '亏损'}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <div className="text-sm text-gray-500">收入</div>
                          <div className="font-medium">{result.totalRevenue.toLocaleString()} 元</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">成本</div>
                          <div className="font-medium">{result.totalCost.toLocaleString()} 元</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">利润</div>
                          <div className={`font-medium ${result.profit > 0 ? 'text-green-700' : 'text-red-700'}`}>
                            {result.profit.toLocaleString()} 元
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 text-sm text-gray-600">
                        评价：{result.evaluation}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
              
              {/* 经营建议 */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="text-lg font-semibold mb-4">经营建议</h4>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>在高需求时期，适当提高现货市场交易比例可以获得更高收益</li>
                  <li>在低需求时期，增加长期合同比例可以降低市场风险</li>
                  <li>燃料价格上涨时，应提前锁定燃料供应或调整交易策略</li>
                  <li>新能源发电比例高时，需注意市场价格波动风险</li>
                  <li>合理组合不同类型的交易方式，实现风险与收益的平衡</li>
                </ul>
              </div>
            </div>
            
            {/* 重置按钮 */}
            <div className="flex justify-center mt-6">
              <Button 
                variant="primary"
                size="large"
                onClick={resetSimulation}
              >
                重新开始模拟
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default PowerGenerationEnterpriseManagementSimulator;