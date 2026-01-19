import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import Card from '../components/Card';

interface MarketPrice {
  id: string;
  type: 'wholesale' | 'retail';
  period: 'peak' | 'valley' | 'flat';
  price: number;
  timeRange: string;
  volatility: 'low' | 'medium' | 'high';
}

interface CustomerType {
  id: string;
  name: string;
  consumptionPattern: 'peak' | 'valley' | 'flat' | 'mixed';
  averageConsumption: number;
  priceSensitivity: 'low' | 'medium' | 'high';
  contractType: 'fixed' | 'floating' | 'time-of-use';
}

interface ArbitrageStrategy {
  id: string;
  name: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
  profitPotential: 'low' | 'medium' | 'high';
  complexity: 'simple' | 'medium' | 'complex';
}

interface StrategyResult {
  strategy: ArbitrageStrategy;
  chosenCustomers: CustomerType[];
  purchasedWholesale: MarketPrice[];
  soldRetail: MarketPrice[];
  totalCost: number;
  totalRevenue: number;
  profit: number;
  profitMargin: number;
  riskAssessment: string;
  recommendation: string;
}

const ElectricityRetailCompanyArbitrageSimulator: React.FC = () => {
  // 模拟器状态
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedStrategy, setSelectedStrategy] = useState<string>('');
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [wholesalePurchases, setWholesalePurchases] = useState<string[]>([]);
  const [retailSales, setRetailSales] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [simulationResult, setSimulationResult] = useState<StrategyResult | null>(null);
  
  // 市场价格数据
  const marketPrices: MarketPrice[] = [
    // 批发价格
    {
      id: 'wholesale-peak',
      type: 'wholesale',
      period: 'peak',
      price: 450,
      timeRange: '08:00-22:00',
      volatility: 'high'
    },
    {
      id: 'wholesale-flat',
      type: 'wholesale',
      period: 'flat',
      price: 380,
      timeRange: '07:00-08:00, 22:00-23:00',
      volatility: 'medium'
    },
    {
      id: 'wholesale-valley',
      type: 'wholesale',
      period: 'valley',
      price: 300,
      timeRange: '23:00-07:00',
      volatility: 'low'
    },
    // 零售价格
    {
      id: 'retail-peak',
      type: 'retail',
      period: 'peak',
      price: 650,
      timeRange: '08:00-22:00',
      volatility: 'medium'
    },
    {
      id: 'retail-flat',
      type: 'retail',
      period: 'flat',
      price: 520,
      timeRange: '07:00-08:00, 22:00-23:00',
      volatility: 'low'
    },
    {
      id: 'retail-valley',
      type: 'retail',
      period: 'valley',
      price: 400,
      timeRange: '23:00-07:00',
      volatility: 'low'
    }
  ];
  
  // 客户类型数据
  const customerTypes: CustomerType[] = [
    {
      id: 'customer-industrial',
      name: '工业用户',
      consumptionPattern: 'peak',
      averageConsumption: 100000,
      priceSensitivity: 'low',
      contractType: 'fixed'
    },
    {
      id: 'customer-commercial',
      name: '商业用户',
      consumptionPattern: 'peak',
      averageConsumption: 50000,
      priceSensitivity: 'medium',
      contractType: 'time-of-use'
    },
    {
      id: 'customer-residential',
      name: '居民用户',
      consumptionPattern: 'mixed',
      averageConsumption: 10000,
      priceSensitivity: 'high',
      contractType: 'time-of-use'
    },
    {
      id: 'customer-data-center',
      name: '数据中心',
      consumptionPattern: 'flat',
      averageConsumption: 80000,
      priceSensitivity: 'medium',
      contractType: 'floating'
    },
    {
      id: 'customer-agricultural',
      name: '农业用户',
      consumptionPattern: 'valley',
      averageConsumption: 30000,
      priceSensitivity: 'high',
      contractType: 'fixed'
    }
  ];
  
  // 套利策略数据
  const arbitrageStrategies: ArbitrageStrategy[] = [
    {
      id: 'strategy-peak-valley',
      name: '峰谷价差套利',
      description: '利用批发市场峰谷电价差异，低买高卖获取利润',
      riskLevel: 'low',
      profitPotential: 'medium',
      complexity: 'simple'
    },
    {
      id: 'strategy-time-of-use',
      name: '分时电价套利',
      description: '根据不同时段的价格波动，灵活调整购售电策略',
      riskLevel: 'medium',
      profitPotential: 'high',
      complexity: 'medium'
    },
    {
      id: 'strategy-customer-matching',
      name: '客户需求匹配套利',
      description: '根据不同客户的用电模式，优化购售电组合',
      riskLevel: 'low',
      profitPotential: 'medium',
      complexity: 'medium'
    },
    {
      id: 'strategy-market-volatility',
      name: '市场波动套利',
      description: '利用批发市场价格波动，短期买卖获取价差收益',
      riskLevel: 'high',
      profitPotential: 'high',
      complexity: 'complex'
    }
  ];
  
  // 选择策略
  const handleStrategySelect = (strategyId: string) => {
    setSelectedStrategy(strategyId);
  };
  
  // 选择客户
  const toggleCustomer = (customerId: string) => {
    setSelectedCustomers(prev => 
      prev.includes(customerId)
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  };
  
  // 选择批发购电
  const toggleWholesalePurchase = (priceId: string) => {
    setWholesalePurchases(prev => 
      prev.includes(priceId)
        ? prev.filter(id => id !== priceId)
        : [...prev, priceId]
    );
  };
  
  // 选择零售售电
  const toggleRetailSale = (priceId: string) => {
    setRetailSales(prev => 
      prev.includes(priceId)
        ? prev.filter(id => id !== priceId)
        : [...prev, priceId]
    );
  };
  
  // 计算套利结果
  const calculateArbitrageResult = () => {
    const strategy = arbitrageStrategies.find(s => s.id === selectedStrategy) || arbitrageStrategies[0];
    const customers = customerTypes.filter(c => selectedCustomers.includes(c.id));
    const wholesale = marketPrices.filter(p => wholesalePurchases.includes(p.id));
    const retail = marketPrices.filter(p => retailSales.includes(p.id));
    
    // 计算总成本和总收入
    const totalConsumption = customers.reduce((sum, customer) => sum + customer.averageConsumption, 0);
    
    // 简化计算：假设批发购电按照平均价格，零售售电按照平均价格
    const avgWholesalePrice = wholesale.length > 0 
      ? wholesale.reduce((sum, price) => sum + price.price, 0) / wholesale.length
      : marketPrices.filter(p => p.type === 'wholesale').reduce((sum, p) => sum + p.price, 0) / 3;
    
    const avgRetailPrice = retail.length > 0 
      ? retail.reduce((sum, price) => sum + price.price, 0) / retail.length
      : marketPrices.filter(p => p.type === 'retail').reduce((sum, p) => sum + p.price, 0) / 3;
    
    const totalCost = totalConsumption * avgWholesalePrice;
    const totalRevenue = totalConsumption * avgRetailPrice;
    const profit = totalRevenue - totalCost;
    const profitMargin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;
    
    // 风险评估
    let riskAssessment = '';
    if (strategy.riskLevel === 'high') {
      riskAssessment = '该策略风险较高，需要密切关注市场价格波动，建议设置止损机制。';
    } else if (strategy.riskLevel === 'medium') {
      riskAssessment = '该策略风险中等，需要定期评估市场变化，调整购售电比例。';
    } else {
      riskAssessment = '该策略风险较低，适合稳定经营，建议长期持有。';
    }
    
    // 建议
    let recommendation = '';
    if (profitMargin > 15) {
      recommendation = '您的套利策略表现优秀，利润空间较大，建议适当扩大规模。';
    } else if (profitMargin > 8) {
      recommendation = '您的套利策略表现良好，利润空间合理，建议保持现有规模。';
    } else if (profitMargin > 0) {
      recommendation = '您的套利策略利润空间较小，建议优化客户组合或调整价格策略。';
    } else {
      recommendation = '您的套利策略目前处于亏损状态，建议重新评估市场价格和客户选择。';
    }
    
    const result: StrategyResult = {
      strategy,
      chosenCustomers: customers,
      purchasedWholesale: wholesale,
      soldRetail: retail,
      totalCost,
      totalRevenue,
      profit,
      profitMargin,
      riskAssessment,
      recommendation
    };
    
    setSimulationResult(result);
    setShowResults(true);
  };
  
  // 重置模拟
  const resetSimulation = () => {
    setCurrentStep(0);
    setSelectedStrategy('');
    setSelectedCustomers([]);
    setWholesalePurchases([]);
    setRetailSales([]);
    setShowResults(false);
    setSimulationResult(null);
  };
  
  // 进入下一步
  const nextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  // 回到上一步
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center mb-4">7-2 售电公司套利模拟器</h2>
      
      {/* 模拟器说明 */}
      <Card className="mb-6">
        <h3 className="text-lg font-semibold mb-4">模拟器说明</h3>
        <p className="text-gray-600 mb-4">
          本模拟器模拟售电公司在批发市场和零售市场之间的套利过程。您需要选择合适的套利策略，
          匹配目标客户群体，并根据市场价格制定购售电计划，以实现利润最大化。
        </p>
        <p className="text-gray-600">
          售电公司的核心盈利模式是通过在批发市场购买电力，然后以更高的价格销售给终端客户，
          赚取中间的价差。不同的套利策略具有不同的风险和收益特征，您需要根据市场情况做出合理决策。
        </p>
      </Card>
      
      {!showResults ? (
        <>
          {/* 模拟步骤 */}
          <Card className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">模拟步骤</h3>
              <div className="text-sm text-gray-500">
                步骤 {currentStep + 1} / 共 3 步
              </div>
            </div>
            <div className="flex justify-between">
              {['选择套利策略', '选择目标客户', '制定购售电计划'].map((step, index) => (
                <div 
                  key={index}
                  className={`flex-1 text-center py-2 rounded-lg ${index === currentStep ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  {step}
                </div>
              ))}
            </div>
          </Card>
          
          {/* 步骤内容 */}
          <Card className="mb-6">
            {currentStep === 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">选择套利策略</h3>
                <p className="text-gray-600 mb-6">请根据市场情况和公司风险偏好选择合适的套利策略：</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {arbitrageStrategies.map(strategy => (
                    <motion.div
                      key={strategy.id}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                      className={`cursor-pointer ${selectedStrategy === strategy.id ? 'ring-2 ring-blue-500' : ''}`}
                    >
                      <Card 
                        className="h-full p-4"
                        onClick={() => handleStrategySelect(strategy.id)}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold">{strategy.name}</h4>
                            <p className="text-sm text-gray-600 mt-1">{strategy.description}</p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${selectedStrategy === strategy.id ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                            {selectedStrategy === strategy.id ? '已选择' : '选择'}
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mt-4">
                          <div className="text-center">
                            <div className="text-gray-500 text-xs">风险等级</div>
                            <div className={`font-medium text-xs ${strategy.riskLevel === 'high' ? 'text-red-600' : strategy.riskLevel === 'medium' ? 'text-yellow-600' : 'text-green-600'}`}>
                              {strategy.riskLevel === 'high' ? '高' : strategy.riskLevel === 'medium' ? '中' : '低'}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-gray-500 text-xs">收益潜力</div>
                            <div className={`font-medium text-xs ${strategy.profitPotential === 'high' ? 'text-green-600' : strategy.profitPotential === 'medium' ? 'text-yellow-600' : 'text-red-600'}`}>
                              {strategy.profitPotential === 'high' ? '高' : strategy.profitPotential === 'medium' ? '中' : '低'}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-gray-500 text-xs">复杂程度</div>
                            <div className={`font-medium text-xs ${strategy.complexity === 'complex' ? 'text-red-600' : strategy.complexity === 'medium' ? 'text-yellow-600' : 'text-green-600'}`}>
                              {strategy.complexity === 'complex' ? '复杂' : strategy.complexity === 'medium' ? '中等' : '简单'}
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
            
            {currentStep === 1 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">选择目标客户</h3>
                <p className="text-gray-600 mb-6">请根据套利策略选择合适的客户群体：</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {customerTypes.map(customer => (
                    <motion.div
                      key={customer.id}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                      className={`cursor-pointer ${selectedCustomers.includes(customer.id) ? 'ring-2 ring-blue-500' : ''}`}
                    >
                      <Card 
                        className="h-full p-3"
                        onClick={() => toggleCustomer(customer.id)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-sm">{customer.name}</h4>
                          <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${selectedCustomers.includes(customer.id) ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                            {selectedCustomers.includes(customer.id) ? '已选择' : '选择'}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500">用电模式：</span>
                            <span className="font-medium">{customer.consumptionPattern === 'peak' ? '高峰' : customer.consumptionPattern === 'valley' ? '低谷' : customer.consumptionPattern === 'flat' ? '平段' : '混合'}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500">平均用电量：</span>
                            <span className="font-medium">{customer.averageConsumption.toLocaleString()} kWh</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500">价格敏感度：</span>
                            <span className="font-medium">{customer.priceSensitivity === 'high' ? '高' : customer.priceSensitivity === 'medium' ? '中' : '低'}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500">合同类型：</span>
                            <span className="font-medium">{customer.contractType === 'fixed' ? '固定价格' : customer.contractType === 'floating' ? '浮动价格' : '分时价格'}</span>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
            
            {currentStep === 2 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">制定购售电计划</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 批发市场购电 */}
                  <div>
                    <h4 className="font-medium mb-3">批发市场购电</h4>
                    <div className="space-y-3">
                      {marketPrices.filter(p => p.type === 'wholesale').map(price => (
                        <motion.div
                          key={price.id}
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                          className={`cursor-pointer p-3 rounded-lg border ${wholesalePurchases.includes(price.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}
                          onClick={() => toggleWholesalePurchase(price.id)}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">{price.period === 'peak' ? '高峰' : price.period === 'valley' ? '低谷' : '平段'}时段</div>
                              <div className="text-sm text-gray-500">{price.timeRange}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-xl">{price.price} 元/MWh</div>
                              <div className={`text-xs ${price.volatility === 'high' ? 'text-red-600' : price.volatility === 'medium' ? 'text-yellow-600' : 'text-green-600'}`}>
                                {price.volatility === 'high' ? '高波动' : price.volatility === 'medium' ? '中波动' : '低波动'}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  {/* 零售市场售电 */}
                  <div>
                    <h4 className="font-medium mb-3">零售市场售电</h4>
                    <div className="space-y-3">
                      {marketPrices.filter(p => p.type === 'retail').map(price => (
                        <motion.div
                          key={price.id}
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                          className={`cursor-pointer p-3 rounded-lg border ${retailSales.includes(price.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}
                          onClick={() => toggleRetailSale(price.id)}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">{price.period === 'peak' ? '高峰' : price.period === 'valley' ? '低谷' : '平段'}时段</div>
                              <div className="text-sm text-gray-500">{price.timeRange}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-xl">{price.price} 元/MWh</div>
                              <div className={`text-xs ${price.volatility === 'high' ? 'text-red-600' : price.volatility === 'medium' ? 'text-yellow-600' : 'text-green-600'}`}>
                                {price.volatility === 'high' ? '高波动' : price.volatility === 'medium' ? '中波动' : '低波动'}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
          
          {/* 步骤导航按钮 */}
          <div className="flex justify-between">
            <Button 
              variant="secondary"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              上一步
            </Button>
            {currentStep < 2 ? (
              <Button 
                variant="primary"
                onClick={nextStep}
                disabled={currentStep === 0 && !selectedStrategy}
              >
                下一步
              </Button>
            ) : (
              <Button 
                variant="primary"
                onClick={calculateArbitrageResult}
                disabled={selectedCustomers.length === 0 || wholesalePurchases.length === 0 || retailSales.length === 0}
              >
                计算套利结果
              </Button>
            )}
          </div>
        </>
      ) : (
        /* 模拟结果 */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {simulationResult && (
            <Card className="mb-6">
              <h3 className="text-xl font-semibold mb-6 text-center">套利结果</h3>
              
              {/* 策略选择 */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3">您选择的套利策略</h4>
                <Card className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-medium">{simulationResult.strategy.name}</h5>
                      <p className="text-gray-600 mt-1">{simulationResult.strategy.description}</p>
                    </div>
                    <div className="text-right">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${simulationResult.strategy.riskLevel === 'high' ? 'bg-red-100 text-red-700' : simulationResult.strategy.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                        {simulationResult.strategy.riskLevel === 'high' ? '高风险' : simulationResult.strategy.riskLevel === 'medium' ? '中风险' : '低风险'}
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium mt-1 ${simulationResult.strategy.profitPotential === 'high' ? 'bg-green-100 text-green-700' : simulationResult.strategy.profitPotential === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                        {simulationResult.strategy.profitPotential === 'high' ? '高收益' : simulationResult.strategy.profitPotential === 'medium' ? '中收益' : '低收益'}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
              
              {/* 客户选择 */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3">选择的客户群体</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {simulationResult.chosenCustomers.map(customer => (
                    <div key={customer.id} className="p-3 rounded-lg bg-gray-50">
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        用电模式：{customer.consumptionPattern === 'peak' ? '高峰' : customer.consumptionPattern === 'valley' ? '低谷' : customer.consumptionPattern === 'flat' ? '平段' : '混合'}
                      </div>
                      <div className="text-sm text-gray-500">
                        平均用电量：{customer.averageConsumption.toLocaleString()} kWh
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 财务结果 */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3">财务结果</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-gray-500 text-sm mb-1">总购电成本</div>
                    <div className="text-2xl font-bold text-blue-700">
                      {simulationResult.totalCost.toLocaleString()} 元
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-gray-500 text-sm mb-1">总售电收入</div>
                    <div className="text-2xl font-bold text-green-700">
                      {simulationResult.totalRevenue.toLocaleString()} 元
                    </div>
                  </div>
                  <div className={`p-4 rounded-lg text-center ${simulationResult.profit > 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                    <div className="text-gray-500 text-sm mb-1">套利利润</div>
                    <div className={`text-2xl font-bold ${simulationResult.profit > 0 ? 'text-green-700' : 'text-red-700'}`}>
                      {simulationResult.profit.toLocaleString()} 元
                    </div>
                  </div>
                  <div className={`p-4 rounded-lg text-center ${simulationResult.profitMargin > 10 ? 'bg-green-50' : simulationResult.profitMargin > 5 ? 'bg-yellow-50' : 'bg-red-50'}`}>
                    <div className="text-gray-500 text-sm mb-1">利润率</div>
                    <div className={`text-2xl font-bold ${simulationResult.profitMargin > 10 ? 'text-green-700' : simulationResult.profitMargin > 5 ? 'text-yellow-700' : 'text-red-700'}`}>
                      {simulationResult.profitMargin.toFixed(2)}%
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 风险评估和建议 */}
              <div className="space-y-4 mb-8">
                <Card className="p-4">
                  <h4 className="font-medium mb-2">风险评估</h4>
                  <p className="text-gray-700">{simulationResult.riskAssessment}</p>
                </Card>
                <Card className="p-4">
                  <h4 className="font-medium mb-2">优化建议</h4>
                  <p className="text-gray-700">{simulationResult.recommendation}</p>
                </Card>
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
          )}
        </motion.div>
      )}
    </div>
  );
};

export default ElectricityRetailCompanyArbitrageSimulator;