import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import Card from '../components/Card';

interface TariffPlan {
  id: string;
  name: string;
  type: 'fixed' | 'time-of-use' | 'peak-valley' | 'demand';
  description: string;
  basePrice: number;
  peakPrice?: number;
  valleyPrice?: number;
  flatPrice?: number;
  demandCharge?: number;
  minimumCharge?: number;
  suitableFor: string[];
}

interface CustomerConsumption {
  id: string;
  customerType: string;
  totalConsumption: number;
  peakConsumption: number;
  valleyConsumption: number;
  flatConsumption: number;
  maximumDemand: number;
  consumptionPattern: string;
}

interface OptimizationResult {
  selectedTariff: TariffPlan;
  customerConsumption: CustomerConsumption;
  estimatedCost: number;
  costBreakdown: {
    peakCost: number;
    valleyCost: number;
    flatCost: number;
    demandCost: number;
    total: number;
  };
  savings: number;
  percentageSavings: number;
  recommendation: string;
  suitabilityScore: number;
}

const UserPowerPurchaseOptimizationSimulator: React.FC = () => {
  // 模拟器状态
  const [selectedTariff, setSelectedTariff] = useState<string>('');
  const [customerType, setCustomerType] = useState<string>('residential');
  const [consumptionData, setConsumptionData] = useState<CustomerConsumption>({
    id: 'user-1',
    customerType: '居民用户',
    totalConsumption: 500,
    peakConsumption: 200,
    valleyConsumption: 100,
    flatConsumption: 200,
    maximumDemand: 2,
    consumptionPattern: '混合用电'
  });
  const [showResults, setShowResults] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  
  // 电价套餐数据
  const tariffPlans: TariffPlan[] = [
    {
      id: 'tariff-1',
      name: '居民阶梯电价',
      type: 'fixed',
      description: '居民用户的基础电价，采用阶梯定价模式',
      basePrice: 0.6,
      minimumCharge: 0,
      suitableFor: ['居民用户', '小型商业用户']
    },
    {
      id: 'tariff-2',
      name: '峰谷分时电价',
      type: 'peak-valley',
      description: '根据不同时段制定不同电价，鼓励错峰用电',
      basePrice: 0,
      peakPrice: 0.8,
      valleyPrice: 0.4,
      flatPrice: 0.6,
      suitableFor: ['居民用户', '商业用户', '工业用户']
    },
    {
      id: 'tariff-3',
      name: '商业统一电价',
      type: 'fixed',
      description: '商业用户的统一电价，不分时段',
      basePrice: 0.9,
      minimumCharge: 100,
      suitableFor: ['商业用户', '办公场所']
    },
    {
      id: 'tariff-4',
      name: '工业两部制电价',
      type: 'demand',
      description: '工业用户的两部制电价，包括电度电价和基本电价',
      basePrice: 0.7,
      demandCharge: 30,
      minimumCharge: 500,
      suitableFor: ['工业用户', '大型企业']
    },
    {
      id: 'tariff-5',
      name: '农业生产电价',
      type: 'fixed',
      description: '农业生产专用电价，享受政府补贴',
      basePrice: 0.5,
      minimumCharge: 0,
      suitableFor: ['农业用户', '农村地区']
    }
  ];
  
  // 客户类型对应的默认用电数据
  const defaultConsumptionData: Record<string, CustomerConsumption> = {
    residential: {
      id: 'user-residential',
      customerType: '居民用户',
      totalConsumption: 500,
      peakConsumption: 200,
      valleyConsumption: 100,
      flatConsumption: 200,
      maximumDemand: 2,
      consumptionPattern: '混合用电'
    },
    commercial: {
      id: 'user-commercial',
      customerType: '商业用户',
      totalConsumption: 5000,
      peakConsumption: 2500,
      valleyConsumption: 500,
      flatConsumption: 2000,
      maximumDemand: 20,
      consumptionPattern: '高峰用电'
    },
    industrial: {
      id: 'user-industrial',
      customerType: '工业用户',
      totalConsumption: 20000,
      peakConsumption: 8000,
      valleyConsumption: 4000,
      flatConsumption: 8000,
      maximumDemand: 100,
      consumptionPattern: '连续用电'
    },
    agricultural: {
      id: 'user-agricultural',
      customerType: '农业用户',
      totalConsumption: 3000,
      peakConsumption: 1000,
      valleyConsumption: 1500,
      flatConsumption: 500,
      maximumDemand: 10,
      consumptionPattern: '低谷用电'
    }
  };
  
  // 处理客户类型选择
  const handleCustomerTypeChange = (type: string) => {
    setCustomerType(type);
    setConsumptionData(defaultConsumptionData[type]);
  };
  
  // 处理电价套餐选择
  const handleTariffSelect = (tariffId: string) => {
    setSelectedTariff(tariffId);
  };
  
  // 计算优化结果
  const calculateOptimization = () => {
    const tariff = tariffPlans.find(t => t.id === selectedTariff) || tariffPlans[0];
    const baseTariff = tariffPlans[0]; // 基准电价（居民阶梯电价）
    
    // 计算不同电价套餐的费用
    const calculateCost = (plan: TariffPlan): number => {
      let cost = 0;
      
      if (plan.type === 'fixed') {
        // 固定电价计算
        cost = consumptionData.totalConsumption * plan.basePrice;
      } else if (plan.type === 'peak-valley' || plan.type === 'time-of-use') {
        // 峰谷分时电价计算
        const peakCost = plan.peakPrice! * consumptionData.peakConsumption;
        const valleyCost = plan.valleyPrice! * consumptionData.valleyConsumption;
        const flatCost = plan.flatPrice! * consumptionData.flatConsumption;
        cost = peakCost + valleyCost + flatCost;
      } else if (plan.type === 'demand') {
        // 两部制电价计算
        const energyCost = consumptionData.totalConsumption * plan.basePrice;
        const demandCost = consumptionData.maximumDemand * plan.demandCharge!;
        cost = energyCost + demandCost;
      }
      
      // 应用最低消费限制
      if (plan.minimumCharge && cost < plan.minimumCharge) {
        cost = plan.minimumCharge;
      }
      
      return cost;
    };
    
    const estimatedCost = calculateCost(tariff);
    const baseCost = calculateCost(baseTariff);
    const savings = baseCost - estimatedCost;
    const percentageSavings = baseCost > 0 ? (savings / baseCost) * 100 : 0;
    
    // 计算费用明细
    let peakCost = 0;
    let valleyCost = 0;
    let flatCost = 0;
    let demandCost = 0;
    
    if (tariff.type === 'peak-valley' || tariff.type === 'time-of-use') {
      peakCost = tariff.peakPrice! * consumptionData.peakConsumption;
      valleyCost = tariff.valleyPrice! * consumptionData.valleyConsumption;
      flatCost = tariff.flatPrice! * consumptionData.flatConsumption;
    } else if (tariff.type === 'demand') {
      const energyCost = consumptionData.totalConsumption * tariff.basePrice;
      peakCost = energyCost * (consumptionData.peakConsumption / consumptionData.totalConsumption);
      valleyCost = energyCost * (consumptionData.valleyConsumption / consumptionData.totalConsumption);
      flatCost = energyCost * (consumptionData.flatConsumption / consumptionData.totalConsumption);
      demandCost = consumptionData.maximumDemand * tariff.demandCharge!;
    } else {
      const unitCost = estimatedCost / consumptionData.totalConsumption;
      peakCost = consumptionData.peakConsumption * unitCost;
      valleyCost = consumptionData.valleyConsumption * unitCost;
      flatCost = consumptionData.flatConsumption * unitCost;
    }
    
    // 计算适合度分数（0-100）
    const suitabilityScore = Math.min(100, 
      (tariff.suitableFor.includes(consumptionData.customerType) ? 30 : 0) +
      (percentageSavings > 20 ? 40 : percentageSavings > 10 ? 30 : percentageSavings > 5 ? 20 : 10) +
      (tariff.type === 'peak-valley' && consumptionData.valleyConsumption > consumptionData.peakConsumption ? 30 : 0)
    );
    
    // 生成建议
    let recommendation = '';
    if (percentageSavings > 20) {
      recommendation = '该电价套餐非常适合您，预计可节省超过20%的电费，强烈建议选择！';
    } else if (percentageSavings > 10) {
      recommendation = '该电价套餐比较适合您，预计可节省10-20%的电费，建议考虑选择。';
    } else if (percentageSavings > 5) {
      recommendation = '该电价套餐对您有一定的节省效果，预计可节省5-10%的电费，可以考虑选择。';
    } else {
      recommendation = '该电价套餐对您的节省效果有限，建议您考虑其他更适合的套餐。';
    }
    
    const result: OptimizationResult = {
      selectedTariff: tariff,
      customerConsumption: consumptionData,
      estimatedCost,
      costBreakdown: {
        peakCost,
        valleyCost,
        flatCost,
        demandCost,
        total: estimatedCost
      },
      savings,
      percentageSavings,
      recommendation,
      suitabilityScore
    };
    
    setOptimizationResult(result);
    setShowResults(true);
  };
  
  // 更新用电数据
  const updateConsumptionData = (field: keyof CustomerConsumption, value: number) => {
    setConsumptionData(prev => ({
      ...prev,
      [field]: value,
      totalConsumption: prev.peakConsumption + prev.valleyConsumption + prev.flatConsumption
    }));
  };
  
  // 重置模拟
  const resetSimulation = () => {
    setSelectedTariff('');
    setCustomerType('residential');
    setConsumptionData(defaultConsumptionData['residential']);
    setShowResults(false);
    setOptimizationResult(null);
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center mb-4">7-3 用户购电优化模拟器</h2>
      
      {/* 模拟器说明 */}
      <Card className="mb-6">
        <h3 className="text-lg font-semibold mb-4">模拟器说明</h3>
        <p className="text-gray-600 mb-4">
          本模拟器帮助用户根据自身用电情况选择最优的电价套餐。您可以选择不同的客户类型，
          调整用电数据，并比较不同电价套餐的费用差异，从而找到最适合自己的购电方案。
        </p>
        <p className="text-gray-600">
          不同的电价套餐具有不同的计费方式，包括固定电价、峰谷分时电价、两部制电价等。
          选择合适的电价套餐可以帮助您节省电费支出，同时优化电力资源的使用效率。
        </p>
      </Card>
      
      {!showResults ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左侧：客户类型和用电数据 */}
          <div className="space-y-6">
            {/* 客户类型选择 */}
            <Card>
              <h3 className="text-lg font-semibold mb-4">选择客户类型</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'residential', name: '居民用户' },
                  { id: 'commercial', name: '商业用户' },
                  { id: 'industrial', name: '工业用户' },
                  { id: 'agricultural', name: '农业用户' }
                ].map(type => (
                  <div 
                    key={type.id}
                    className={`cursor-pointer p-4 rounded-lg border ${customerType === type.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}
                    onClick={() => handleCustomerTypeChange(type.id)}
                  >
                    <div className="font-medium">{type.name}</div>
                  </div>
                ))}
              </div>
            </Card>
            
            {/* 用电数据设置 */}
            <Card>
              <h3 className="text-lg font-semibold mb-4">用电数据设置</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-gray-700">高峰时段用电量 (kWh)</label>
                    <span className="text-blue-600 font-medium">{consumptionData.peakConsumption}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={customerType === 'industrial' ? 10000 : customerType === 'commercial' ? 5000 : 1000}
                    value={consumptionData.peakConsumption}
                    onChange={(e) => updateConsumptionData('peakConsumption', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-gray-700">低谷时段用电量 (kWh)</label>
                    <span className="text-blue-600 font-medium">{consumptionData.valleyConsumption}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={customerType === 'industrial' ? 10000 : customerType === 'commercial' ? 5000 : 1000}
                    value={consumptionData.valleyConsumption}
                    onChange={(e) => updateConsumptionData('valleyConsumption', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-gray-700">平段时段用电量 (kWh)</label>
                    <span className="text-blue-600 font-medium">{consumptionData.flatConsumption}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={customerType === 'industrial' ? 10000 : customerType === 'commercial' ? 5000 : 1000}
                    value={consumptionData.flatConsumption}
                    onChange={(e) => updateConsumptionData('flatConsumption', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-gray-700">最大需量 (kW)</label>
                    <span className="text-blue-600 font-medium">{consumptionData.maximumDemand}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max={customerType === 'industrial' ? 200 : customerType === 'commercial' ? 50 : 10}
                    step="1"
                    value={consumptionData.maximumDemand}
                    onChange={(e) => updateConsumptionData('maximumDemand', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>
                
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">总用电量：</span>
                    <span className="font-bold">{consumptionData.totalConsumption} kWh</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-gray-600">用电模式：</span>
                    <span className="font-bold">{consumptionData.consumptionPattern}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          
          {/* 右侧：电价套餐选择 */}
          <div className="space-y-6">
            <Card>
              <h3 className="text-lg font-semibold mb-4">选择电价套餐</h3>
              <div className="space-y-3">
                {tariffPlans.map(plan => (
                  <motion.div
                    key={plan.id}
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                    className={`cursor-pointer p-4 rounded-lg border ${selectedTariff === plan.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}
                    onClick={() => handleTariffSelect(plan.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{plan.name}</div>
                        <div className="text-sm text-gray-500 mt-1">{plan.description}</div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${selectedTariff === plan.id ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                        {selectedTariff === plan.id ? '已选择' : '选择'}
                      </div>
                    </div>
                    
                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                      {plan.type === 'fixed' && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">基础电价：</span>
                          <span className="font-medium">{plan.basePrice} 元/kWh</span>
                        </div>
                      )}
                      
                      {(plan.type === 'peak-valley' || plan.type === 'time-of-use') && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-500">高峰电价：</span>
                            <span className="font-medium">{plan.peakPrice} 元/kWh</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">低谷电价：</span>
                            <span className="font-medium">{plan.valleyPrice} 元/kWh</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">平段电价：</span>
                            <span className="font-medium">{plan.flatPrice} 元/kWh</span>
                          </div>
                        </>
                      )}
                      
                      {plan.type === 'demand' && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-500">电度电价：</span>
                            <span className="font-medium">{plan.basePrice} 元/kWh</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">基本电价：</span>
                            <span className="font-medium">{plan.demandCharge} 元/kW·月</span>
                          </div>
                        </>
                      )}
                      
                      {plan.minimumCharge && (
                        <div className="flex justify-between col-span-2">
                          <span className="text-gray-500">最低消费：</span>
                          <span className="font-medium">{plan.minimumCharge} 元</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-3 text-xs text-gray-500">
                      适合用户：{plan.suitableFor.join('、')}
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
            
            {/* 计算按钮 */}
            <div className="flex justify-center">
              <Button 
                variant="primary"
                size="large"
                onClick={calculateOptimization}
                disabled={!selectedTariff}
                className="w-full"
              >
                计算最优方案
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* 优化结果 */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {optimizationResult && (
            <Card className="mb-6">
              <h3 className="text-xl font-semibold mb-6 text-center">购电优化结果</h3>
              
              {/* 结果概览 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-gray-500 text-sm mb-1">预计每月电费</div>
                  <div className="text-2xl font-bold text-green-700">
                    ¥{optimizationResult.estimatedCost.toFixed(2)}
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-gray-500 text-sm mb-1">预计每月节省</div>
                  <div className="text-2xl font-bold text-blue-700">
                    ¥{optimizationResult.savings.toFixed(2)}
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <div className="text-gray-500 text-sm mb-1">节省比例</div>
                  <div className="text-2xl font-bold text-purple-700">
                    {optimizationResult.percentageSavings.toFixed(1)}%
                  </div>
                </div>
              </div>
              
              {/* 选择的电价套餐 */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3">您选择的电价套餐</h4>
                <Card className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-medium">{optimizationResult.selectedTariff.name}</h5>
                      <p className="text-gray-600 mt-1">{optimizationResult.selectedTariff.description}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${optimizationResult.suitabilityScore > 80 ? 'bg-green-100 text-green-700' : optimizationResult.suitabilityScore > 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                      适合度：{optimizationResult.suitabilityScore}分
                    </div>
                  </div>
                </Card>
              </div>
              
              {/* 费用明细 */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3">费用明细</h4>
                <Card className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">高峰时段费用</span>
                      <span className="font-medium">¥{optimizationResult.costBreakdown.peakCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">低谷时段费用</span>
                      <span className="font-medium">¥{optimizationResult.costBreakdown.valleyCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">平段时段费用</span>
                      <span className="font-medium">¥{optimizationResult.costBreakdown.flatCost.toFixed(2)}</span>
                    </div>
                    {optimizationResult.costBreakdown.demandCost > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">基本电费（需量）</span>
                        <span className="font-medium">¥{optimizationResult.costBreakdown.demandCost.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between font-bold">
                      <span>总计</span>
                      <span>¥{optimizationResult.costBreakdown.total.toFixed(2)}</span>
                    </div>
                  </div>
                </Card>
              </div>
              
              {/* 建议 */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3">优化建议</h4>
                <Card className="p-4">
                  <p className="text-gray-700">{optimizationResult.recommendation}</p>
                </Card>
              </div>
              
              {/* 用电优化小贴士 */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold mb-3">用电优化小贴士</h4>
                <Card className="p-4">
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>尽量将大功率电器（如洗衣机、热水器）安排在低谷时段使用</li>
                    <li>合理设置空调温度，夏季不低于26℃，冬季不高于20℃</li>
                    <li>使用节能电器，如LED灯、变频空调等</li>
                    <li>定期检查电器设备，及时更换老化设备</li>
                    <li>根据季节变化调整用电习惯，如夏季减少白天用电</li>
                  </ul>
                </Card>
              </div>
              
              {/* 重置按钮 */}
              <div className="flex justify-center">
                <Button 
                  variant="primary"
                  size="large"
                  onClick={resetSimulation}
                >
                  重新计算
                </Button>
              </div>
            </Card>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default UserPowerPurchaseOptimizationSimulator;