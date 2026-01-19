import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import Card from '../components/Card';

const AnnualCapacityCalculator: React.FC = () => {
  // 机组类型：coal（燃煤）或 newEnergy（新能源）
  const [unitType, setUnitType] = useState<'coal' | 'newEnergy'>('coal');
  
  // 燃煤机组参数
  const [coalCapacity, setCoalCapacity] = useState<number>(300); // MW
  const [coalOperatingHours, setCoalOperatingHours] = useState<number>(5500); // h
  const [coalPowerRate, setCoalPowerRate] = useState<number>(5); // %
  const [coalK1, setCoalK1] = useState<number>(1.0);
  
  // 新能源机组参数
  const [newEnergyCapacity, setNewEnergyCapacity] = useState<number>(100); // MW
  const [mechanismPowerRatio, setMechanismPowerRatio] = useState<number>(30); // %
  const [maxUtilizationHours, setMaxUtilizationHours] = useState<number>(1500); // h
  
  // 计算结果
  const [annualCapacity, setAnnualCapacity] = useState<number>(0);
  const [calculationSteps, setCalculationSteps] = useState<string[]>([]);
  const [recommendedContract, setRecommendedContract] = useState<string>('');

  // 计算年度电量约束
  const calculateAnnualCapacity = () => {
    let capacity = 0;
    const steps: string[] = [];
    
    if (unitType === 'coal') {
      // 燃煤机组计算
      // 1. 可用发电能力 = 机组容量 × 年运行小时
      const availableCapacity = coalCapacity * coalOperatingHours;
      steps.push(`1. 可用发电能力 = ${coalCapacity}MW × ${coalOperatingHours}h = ${availableCapacity.toLocaleString()} MWh`);
      
      // 2. 扣除厂用电 = 可用发电能力 × (1 - 厂用电率)
      const netCapacity = availableCapacity * (1 - coalPowerRate / 100);
      steps.push(`2. 扣除厂用电 = ${availableCapacity.toLocaleString()} × (1-${coalPowerRate}%) = ${netCapacity.toLocaleString()} MWh`);
      
      // 3. 年度净合同上限 = 扣除厂用电后的容量 × K1系数
      capacity = netCapacity * coalK1;
      steps.push(`3. 年度净合同上限 = ${netCapacity.toLocaleString()} × ${coalK1} = ${capacity.toLocaleString()} MWh`);
      
      // 推荐签约比例
      const minContract = capacity * 0.7;
      const maxContract = capacity * 0.85;
      setRecommendedContract(`建议签约比例：70%-85%，推荐签约电量：${minContract.toLocaleString()} - ${maxContract.toLocaleString()} MWh`);
    } else {
      // 新能源机组计算
      // 1. 额定装机容量 × (1 - 机制电量比例)
      const availableCapacity = newEnergyCapacity * (1 - mechanismPowerRatio / 100);
      steps.push(`1. 可用装机容量 = ${newEnergyCapacity}MW × (1-${mechanismPowerRatio}%) = ${availableCapacity.toLocaleString()} MW`);
      
      // 2. 年度净合同上限 = 可用装机容量 × 最大发电可利用小时数
      capacity = availableCapacity * maxUtilizationHours;
      steps.push(`2. 年度净合同上限 = ${availableCapacity.toLocaleString()}MW × ${maxUtilizationHours}h = ${capacity.toLocaleString()} MWh`);
      
      // 推荐签约比例
      const minContract = capacity * 0.6;
      const maxContract = capacity * 0.8;
      setRecommendedContract(`建议签约比例：60%-80%，推荐签约电量：${minContract.toLocaleString()} - ${maxContract.toLocaleString()} MWh`);
    }
    
    setAnnualCapacity(capacity);
    setCalculationSteps(steps);
  };

  // 重置计算
  const resetCalculator = () => {
    setCoalCapacity(300);
    setCoalOperatingHours(5500);
    setCoalPowerRate(5);
    setCoalK1(1.0);
    setNewEnergyCapacity(100);
    setMechanismPowerRatio(30);
    setMaxUtilizationHours(1500);
    setAnnualCapacity(0);
    setCalculationSteps([]);
    setRecommendedContract('');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">年度电量约束计算器</h2>
        <p className="text-gray-600">
          计算燃煤和新能源发电企业的年度交易净合同上限
        </p>
      </div>

      {/* 机组类型选择 */}
      <div className="flex gap-4 justify-center mb-6">
        <Button
          variant={unitType === 'coal' ? 'primary' : 'secondary'}
          onClick={() => setUnitType('coal')}
        >
          燃煤机组
        </Button>
        <Button
          variant={unitType === 'newEnergy' ? 'primary' : 'secondary'}
          onClick={() => setUnitType('newEnergy')}
        >
          新能源机组
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 输入参数 */}
        <Card title="输入参数" className="h-full">
          <div className="space-y-4">
            {unitType === 'coal' ? (
              // 燃煤机组参数
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">机组容量 (MW)</label>
                  <input
                    type="number"
                    value={coalCapacity}
                    onChange={(e) => setCoalCapacity(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">年运行小时 (h)</label>
                  <input
                    type="number"
                    value={coalOperatingHours}
                    onChange={(e) => setCoalOperatingHours(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">厂用电率 (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={coalPowerRate}
                    onChange={(e) => setCoalPowerRate(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">K1系数 (暂定)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={coalK1}
                    onChange={(e) => setCoalK1(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            ) : (
              // 新能源机组参数
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">额定装机容量 (MW)</label>
                  <input
                    type="number"
                    value={newEnergyCapacity}
                    onChange={(e) => setNewEnergyCapacity(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">机制电量比例 (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={mechanismPowerRatio}
                    onChange={(e) => setMechanismPowerRatio(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">最大发电可利用小时数 (h)</label>
                  <input
                    type="number"
                    value={maxUtilizationHours}
                    onChange={(e) => setMaxUtilizationHours(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}
            
            <div className="flex gap-3 pt-2">
              <Button variant="primary" onClick={calculateAnnualCapacity} className="flex-1">
                计算
              </Button>
              <Button variant="secondary" onClick={resetCalculator} className="flex-1">
                重置
              </Button>
            </div>
          </div>
        </Card>

        {/* 计算结果 */}
        <Card title="计算结果" className="h-full">
          <div className="space-y-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-500">年度净合同上限</div>
              <div className="text-2xl font-bold">{annualCapacity.toLocaleString()} MWh</div>
            </div>
            
            {recommendedContract && (
              <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                <div className="text-sm font-medium text-green-700">推荐签约建议</div>
                <div className="text-sm text-green-600">{recommendedContract}</div>
              </div>
            )}
            
            {calculationSteps.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium mb-2">计算过程</div>
                <div className="space-y-2 text-sm">
                  {calculationSteps.map((step, index) => (
                    <div key={index}>{step}</div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="text-sm font-medium mb-2">公式说明</div>
              <div className="text-sm text-gray-600 space-y-1">
                {unitType === 'coal' ? (
                  <>
                    <div>• 燃煤机组公式：</div>
                    <div className="pl-4">年度净合同上限 = 机组容量 × 年运行小时 × (1 - 厂用电率) × K1系数</div>
                  </>
                ) : (
                  <>
                    <div>• 新能源机组公式：</div>
                    <div className="pl-4">年度净合同上限 = 额定装机容量 × (1 - 机制电量比例) × 最大发电可利用小时数</div>
                  </>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
};

export default AnnualCapacityCalculator;