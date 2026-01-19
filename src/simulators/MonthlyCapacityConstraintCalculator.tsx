import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import Card from '../components/Card';

interface PowerPlantType {
  value: string;
  label: string;
  capacityFactor: number;
  description: string;
}

const MonthlyCapacityConstraintCalculator: React.FC = () => {
  // 计算器状态
  const [powerPlantType, setPowerPlantType] = useState('coal');
  const [installedCapacity, setInstalledCapacity] = useState('100');
  const [alreadySignedContracts, setAlreadySignedContracts] = useState<{
    annual: string;
    monthly: string;
    shortTerm: string;
  }>({
    annual: '5000',
    monthly: '400',
    shortTerm: '50'
  });
  const [calculatedResult, setCalculatedResult] = useState<{
    totalAvailable: number;
    alreadySigned: number;
    remainingTradable: number;
    breakdown: {
      monthlyGeneration: number;
      adjustmentFactor: number;
      annualContract: number;
      monthlyContract: number;
      shortTermContract: number;
    };
  } | null>(null);
  
  // 发电厂类型数据
  const powerPlantTypes: PowerPlantType[] = [
    {
      value: 'coal',
      label: '燃煤发电厂',
      capacityFactor: 0.75,
      description: '燃煤电厂月度容量利用率约75%'
    },
    {
      value: 'gas',
      label: '燃气发电厂',
      capacityFactor: 0.5,
      description: '燃气电厂月度容量利用率约50%'
    },
    {
      value: 'hydro',
      label: '水电厂',
      capacityFactor: 0.6,
      description: '水电厂月度容量利用率约60%'
    },
    {
      value: 'wind',
      label: '风电场',
      capacityFactor: 0.35,
      description: '风电场月度容量利用率约35%'
    },
    {
      value: 'solar',
      label: '光伏电站',
      capacityFactor: 0.25,
      description: '光伏电站月度容量利用率约25%'
    }
  ];
  
  // 获取当前发电厂类型
  const currentPlantType = powerPlantTypes.find(p => p.value === powerPlantType) || powerPlantTypes[0];
  
  // 计算月度电量约束
  const calculateCapacity = () => {
    const capacity = parseFloat(installedCapacity) || 0;
    const annualContract = parseFloat(alreadySignedContracts.annual) || 0;
    const monthlyContract = parseFloat(alreadySignedContracts.monthly) || 0;
    const shortTermContract = parseFloat(alreadySignedContracts.shortTerm) || 0;
    
    // 计算月度发电量（万千瓦时）
    const monthlyGeneration = capacity * currentPlantType.capacityFactor * 24 * 30 / 10000;
    
    // 计算已签合同电量总和
    const totalSigned = annualContract + monthlyContract + shortTermContract;
    
    // 计算剩余可交易电量
    const remainingTradable = Math.max(0, monthlyGeneration - totalSigned);
    
    setCalculatedResult({
      totalAvailable: Math.round(monthlyGeneration),
      alreadySigned: Math.round(totalSigned),
      remainingTradable: Math.round(remainingTradable),
      breakdown: {
        monthlyGeneration: Math.round(monthlyGeneration),
        adjustmentFactor: currentPlantType.capacityFactor,
        annualContract: Math.round(annualContract),
        monthlyContract: Math.round(monthlyContract),
        shortTermContract: Math.round(shortTermContract)
      }
    });
  };
  
  // 重置计算器
  const resetCalculator = () => {
    setPowerPlantType('coal');
    setInstalledCapacity('100');
    setAlreadySignedContracts({
      annual: '5000',
      monthly: '400',
      shortTerm: '50'
    });
    setCalculatedResult(null);
  };
  
  // 更新已签合同电量
  const updateSignedContract = (type: 'annual' | 'monthly' | 'shortTerm', value: string) => {
    setAlreadySignedContracts(prev => ({
      ...prev,
      [type]: value
    }));
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center mb-4">4-4 月度电量约束计算器</h2>
      
      <Card className="mb-6">
        <h3 className="text-lg font-semibold mb-4">计算器说明</h3>
        <p className="text-gray-600 mb-4">
          本计算器用于计算发电厂月度可交易电量约束，考虑已签合同电量对可交易电量的影响。
          月度可交易电量 = 月度发电量 - 已签合同电量总和
        </p>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 输入区域 */}
        <Card>
          <h3 className="text-lg font-semibold mb-6">输入参数</h3>
          
          {/* 发电厂类型 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              发电厂类型
            </label>
            <select
              value={powerPlantType}
              onChange={(e) => setPowerPlantType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              {powerPlantTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label} (容量利用率: {type.capacityFactor * 100}%)
                </option>
              ))}
            </select>
            <p className="mt-2 text-sm text-gray-500">
              {currentPlantType.description}
            </p>
          </div>
          
          {/* 装机容量 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              装机容量 (MW)
            </label>
            <input
              type="number"
              value={installedCapacity}
              onChange={(e) => setInstalledCapacity(e.target.value)}
              min="10"
              max="10000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <p className="mt-2 text-sm text-gray-500">
              输入发电厂的实际装机容量
            </p>
          </div>
          
          {/* 已签合同电量 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              已签合同电量 (万千瓦时)
            </label>
            
            <div className="space-y-4">
              {/* 年度合同 */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">年度合同电量</span>
                  <span className="text-sm text-gray-500">年度双边协商等长期合同</span>
                </div>
                <input
                  type="number"
                  value={alreadySignedContracts.annual}
                  onChange={(e) => updateSignedContract('annual', e.target.value)}
                  min="0"
                  step="100"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              
              {/* 月度合同 */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">月度合同电量</span>
                  <span className="text-sm text-gray-500">月度集中竞价等中期合同</span>
                </div>
                <input
                  type="number"
                  value={alreadySignedContracts.monthly}
                  onChange={(e) => updateSignedContract('monthly', e.target.value)}
                  min="0"
                  step="10"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              
              {/* 短期合同 */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">短期合同电量</span>
                  <span className="text-sm text-gray-500">短期交易等临时合同</span>
                </div>
                <input
                  type="number"
                  value={alreadySignedContracts.shortTerm}
                  onChange={(e) => updateSignedContract('shortTerm', e.target.value)}
                  min="0"
                  step="10"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>
          
          {/* 操作按钮 */}
          <div className="flex gap-4">
            <Button variant="primary" onClick={calculateCapacity} fullWidth>
              计算可交易电量
            </Button>
            <Button variant="secondary" onClick={resetCalculator} fullWidth>
              重置
            </Button>
          </div>
        </Card>
        
        {/* 结果显示区域 */}
        <Card>
          <h3 className="text-lg font-semibold mb-6">计算结果</h3>
          
          {calculatedResult ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* 主要结果 */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-sm text-gray-500 mb-1">月度可用电量</div>
                  <div className="text-2xl font-bold text-blue-600">{calculatedResult.totalAvailable} 万千瓦时</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg text-center">
                  <div className="text-sm text-gray-500 mb-1">已签合同电量</div>
                  <div className="text-2xl font-bold text-orange-600">{calculatedResult.alreadySigned} 万千瓦时</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-sm text-gray-500 mb-1">剩余可交易电量</div>
                  <div className="text-2xl font-bold text-green-600">{calculatedResult.remainingTradable} 万千瓦时</div>
                </div>
              </div>
              
              {/* 计算过程 */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-700 mb-3">计算过程</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">装机容量</span>
                    <span>{installedCapacity} MW</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">容量利用率</span>
                    <span>{(calculatedResult.breakdown.adjustmentFactor * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">月度理论发电量</span>
                    <span>{calculatedResult.breakdown.monthlyGeneration} 万千瓦时</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-600">已签合同电量</span>
                    </div>
                    <div className="flex justify-between items-center ml-4 text-gray-600">
                      <span>· 年度合同</span>
                      <span>{calculatedResult.breakdown.annualContract} 万千瓦时</span>
                    </div>
                    <div className="flex justify-between items-center ml-4 text-gray-600">
                      <span>· 月度合同</span>
                      <span>{calculatedResult.breakdown.monthlyContract} 万千瓦时</span>
                    </div>
                    <div className="flex justify-between items-center ml-4 text-gray-600">
                      <span>· 短期合同</span>
                      <span>{calculatedResult.breakdown.shortTermContract} 万千瓦时</span>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2 font-medium">
                    <div className="flex justify-between items-center">
                      <span>剩余可交易电量</span>
                      <span className="text-green-600">{calculatedResult.remainingTradable} 万千瓦时</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 电量分配可视化 */}
              <div className="space-y-3">
                <h4 className="font-medium text-blue-700">电量分配可视化</h4>
                <div className="relative h-16 bg-gray-200 rounded-lg overflow-hidden">
                  {/* 总电量背景 */}
                  <div className="absolute inset-0 bg-blue-100"></div>
                  
                  {/* 已签合同电量 */}
                  <div 
                    className="absolute top-0 left-0 bottom-0 bg-orange-500 opacity-70"
                    style={{ width: `${(calculatedResult.alreadySigned / calculatedResult.totalAvailable) * 100}%` }}
                  ></div>
                  
                  {/* 剩余可交易电量 */}
                  <div 
                    className="absolute top-0 bottom-0 bg-green-500 opacity-70"
                    style={{
                      left: `${(calculatedResult.alreadySigned / calculatedResult.totalAvailable) * 100}%`,
                      width: `${(calculatedResult.remainingTradable / calculatedResult.totalAvailable) * 100}%`
                    }}
                  ></div>
                  
                  {/* 刻度标签 */}
                  <div className="absolute bottom-0 left-0 right-0 flex justify-between items-end px-2 pb-1 text-xs text-gray-500">
                    <span>0</span>
                    <span>{Math.round(calculatedResult.totalAvailable / 2)}</span>
                    <span>{calculatedResult.totalAvailable}</span>
                  </div>
                  
                  {/* 图例 */}
                  <div className="absolute top-2 left-0 right-0 flex justify-center gap-6 text-xs font-medium">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span>已签合同</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>可交易电量</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 结果分析 */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-700 mb-2">结果分析</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>当前月度可用电量为 {calculatedResult.totalAvailable} 万千瓦时</li>
                  <li>已签合同占用 {calculatedResult.alreadySigned} 万千瓦时</li>
                  <li>剩余可交易电量为 {calculatedResult.remainingTradable} 万千瓦时</li>
                  <li>
                    {calculatedResult.remainingTradable > 0 
                      ? '您还有充足的电量可以参与市场交易' 
                      : '您本月已无剩余电量可交易，请合理安排合同签订'}
                  </li>
                </ul>
              </div>
              
              {/* 规则说明 */}
              <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">计算规则说明：</h4>
                <p>
                  月度可交易电量 = 月度发电量 - 已签合同电量总和
                  其中：月度发电量 = 装机容量 × 容量利用率 × 720小时 / 10000
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <div className="text-xl mb-2">请输入参数并点击计算按钮</div>
              <div className="text-sm">系统将根据输入计算月度可交易电量约束</div>
            </div>
          )}
        </Card>
      </div>
      
      {/* 电量约束规则说明 */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">月度电量约束规则</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-3">
            <h4 className="font-medium text-blue-700">约束计算原则</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>基于发电厂实际装机容量计算</li>
              <li>考虑不同类型电厂的容量利用率</li>
              <li>已签合同电量全部计入约束</li>
              <li>可交易电量为剩余可用电量</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-medium text-blue-700">合同类型影响</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>年度合同：长期约束，影响全年可交易电量</li>
              <li>月度合同：中期约束，影响当月可交易电量</li>
              <li>短期合同：临时约束，灵活调整</li>
              <li>不同合同类型调整系数不同</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MonthlyCapacityConstraintCalculator;