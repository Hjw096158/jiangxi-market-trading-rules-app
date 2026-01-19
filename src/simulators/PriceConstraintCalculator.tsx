import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import Card from '../components/Card';

interface TransactionType {
  value: string;
  label: string;
  basePrice: number;
  upperLimitRatio: number;
  lowerLimitRatio: number;
  description: string;
}

interface TimePeriodFactor {
  value: string;
  label: string;
  factor: number;
}

const PriceConstraintCalculator: React.FC = () => {
  // 计算器状态
  const [transactionType, setTransactionType] = useState('annual_bilateral');
  const [timePeriod, setTimePeriod] = useState('peak');
  const [basePrice, setBasePrice] = useState('400');
  const [calculatedPrices, setCalculatedPrices] = useState<{
    upperLimit: number;
    lowerLimit: number;
    adjustedUpperLimit: number;
    adjustedLowerLimit: number;
  } | null>(null);
  
  // 交易类型数据
  const transactionTypes: TransactionType[] = [
    {
      value: 'annual_bilateral',
      label: '年度双边协商交易',
      basePrice: 400,
      upperLimitRatio: 1.2,
      lowerLimitRatio: 0.8,
      description: '年度双边协商交易价格上下限为基准价的±20%'
    },
    {
      value: 'monthly_centralized',
      label: '月度集中竞价交易',
      basePrice: 400,
      upperLimitRatio: 1.3,
      lowerLimitRatio: 0.7,
      description: '月度集中竞价交易价格上下限为基准价的±30%'
    },
    {
      value: 'day_ahead',
      label: '日前市场交易',
      basePrice: 400,
      upperLimitRatio: 1.5,
      lowerLimitRatio: 0.5,
      description: '日前市场交易价格上下限为基准价的±50%'
    },
    {
      value: 'real_time',
      label: '实时平衡交易',
      basePrice: 400,
      upperLimitRatio: 2.0,
      lowerLimitRatio: 0.0,
      description: '实时平衡交易价格上限为基准价的200%，下限为0'
    },
    {
      value: 'green_power',
      label: '绿色电力交易',
      basePrice: 450,
      upperLimitRatio: 1.4,
      lowerLimitRatio: 1.0,
      description: '绿色电力交易价格上限为基准价的140%，下限为基准价'
    },
  ];
  
  // 时段调整系数
  const timePeriodFactors: TimePeriodFactor[] = [
    { value: 'peak', label: '峰段', factor: 1.2 },
    { value: 'flat', label: '平段', factor: 1.0 },
    { value: 'valley', label: '谷段', factor: 0.8 },
    { value: 'sharp_peak', label: '尖峰段', factor: 1.3 },
    { value: 'deep_valley', label: '深谷段', factor: 0.7 },
  ];
  
  // 获取当前交易类型
  const currentType = transactionTypes.find(t => t.value === transactionType) || transactionTypes[0];
  
  // 获取当前时段系数
  const currentTimeFactor = timePeriodFactors.find(f => f.value === timePeriod) || timePeriodFactors[1];
  
  // 计算价格约束
  const calculatePrices = () => {
    const base = parseFloat(basePrice) || currentType.basePrice;
    
    // 计算基础上下限
    const upperLimit = base * currentType.upperLimitRatio;
    const lowerLimit = base * currentType.lowerLimitRatio;
    
    // 计算时段调整后的上下限
    const adjustedUpperLimit = Math.round(upperLimit * currentTimeFactor.factor);
    const adjustedLowerLimit = Math.round(lowerLimit * currentTimeFactor.factor);
    
    setCalculatedPrices({
      upperLimit: Math.round(upperLimit),
      lowerLimit: Math.round(lowerLimit),
      adjustedUpperLimit,
      adjustedLowerLimit
    });
  };
  
  // 重置计算器
  const resetCalculator = () => {
    setTransactionType('annual_bilateral');
    setTimePeriod('peak');
    setBasePrice('400');
    setCalculatedPrices(null);
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center mb-4">4-2 价格约束计算器</h2>
      
      <Card className="mb-6">
        <h3 className="text-lg font-semibold mb-4">计算器说明</h3>
        <p className="text-gray-600 mb-4">
          本计算器用于计算不同交易类型在不同时段下的价格上下限约束。
          价格上下限根据基准价和调整系数计算得出，不同交易类型和时段有不同的约束规则。
        </p>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 输入区域 */}
        <Card>
          <h3 className="text-lg font-semibold mb-6">输入参数</h3>
          
          {/* 交易类型选择 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              交易类型
            </label>
            <select
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              {transactionTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <p className="mt-2 text-sm text-gray-500">
              {currentType.description}
            </p>
          </div>
          
          {/* 时段选择 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              时段类型
            </label>
            <select
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              {timePeriodFactors.map((factor) => (
                <option key={factor.value} value={factor.value}>
                  {factor.label} (系数: {factor.factor})
                </option>
              ))}
            </select>
          </div>
          
          {/* 基准价输入 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              基准价 (元/MWh)
            </label>
            <input
              type="number"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              min="100"
              max="1000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <p className="mt-2 text-sm text-gray-500">
              当前交易类型默认基准价: {currentType.basePrice} 元/MWh
            </p>
          </div>
          
          {/* 操作按钮 */}
          <div className="flex gap-4">
            <Button variant="primary" onClick={calculatePrices} fullWidth>
              计算价格约束
            </Button>
            <Button variant="secondary" onClick={resetCalculator} fullWidth>
              重置
            </Button>
          </div>
        </Card>
        
        {/* 结果显示区域 */}
        <Card>
          <h3 className="text-lg font-semibold mb-6">计算结果</h3>
          
          {calculatedPrices ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* 基础价格约束 */}
              <div className="space-y-3">
                <h4 className="font-medium text-blue-700">基础价格约束</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">价格上限</div>
                    <div className="text-2xl font-bold text-blue-600">{calculatedPrices.upperLimit} 元/MWh</div>
                    <div className="text-xs text-gray-500 mt-1">
                      基准价 × {currentType.upperLimitRatio}
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">价格下限</div>
                    <div className="text-2xl font-bold text-green-600">{calculatedPrices.lowerLimit} 元/MWh</div>
                    <div className="text-xs text-gray-500 mt-1">
                      基准价 × {currentType.lowerLimitRatio}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 时段调整后的价格约束 */}
              <div className="space-y-3">
                <h4 className="font-medium text-blue-700">{currentTimeFactor.label} 调整后价格约束</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">调整后价格上限</div>
                    <div className="text-2xl font-bold text-orange-600">{calculatedPrices.adjustedUpperLimit} 元/MWh</div>
                    <div className="text-xs text-gray-500 mt-1">
                      基础上限 × {currentTimeFactor.factor}
                    </div>
                  </div>
                  <div className="bg-teal-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">调整后价格下限</div>
                    <div className="text-2xl font-bold text-teal-600">{calculatedPrices.adjustedLowerLimit} 元/MWh</div>
                    <div className="text-xs text-gray-500 mt-1">
                      基础下限 × {currentTimeFactor.factor}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 价格范围可视化 */}
              <div className="space-y-3">
                <h4 className="font-medium text-blue-700">价格范围可视化</h4>
                <div className="relative h-12 bg-gray-200 rounded-lg">
                  {/* 基础范围 */}
                  <div 
                    className="absolute top-2 bottom-2 left-0 right-0 bg-blue-100 rounded-md"
                    style={{
                      left: `${(calculatedPrices.lowerLimit / (calculatedPrices.upperLimit * 1.5)) * 100}%`,
                      right: `${(calculatedPrices.upperLimit / (calculatedPrices.upperLimit * 1.5)) * 50}%`
                    }}
                  ></div>
                  {/* 调整后范围 */}
                  <div 
                    className="absolute top-4 bottom-4 bg-green-500 rounded-md opacity-70"
                    style={{
                      left: `${(calculatedPrices.adjustedLowerLimit / (calculatedPrices.upperLimit * 1.5)) * 100}%`,
                      right: `${(calculatedPrices.adjustedUpperLimit / (calculatedPrices.upperLimit * 1.5)) * 50}%`
                    }}
                  ></div>
                  {/* 价格标记 */}
                  <div className="absolute -bottom-6 left-0 text-xs text-gray-500">
                    0
                  </div>
                  <div className="absolute -bottom-6 right-0 text-xs text-gray-500">
                    {Math.round(calculatedPrices.upperLimit * 1.5)}
                  </div>
                </div>
              </div>
              
              {/* 计算说明 */}
              <div className="bg-gray-50 p-4 rounded-lg text-sm">
                <h4 className="font-medium mb-2">计算说明：</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>基准价: {basePrice} 元/MWh</li>
                  <li>交易类型: {currentType.label}</li>
                  <li>价格上下限比例: ±{Math.round((currentType.upperLimitRatio - 1) * 100)}%</li>
                  <li>时段: {currentTimeFactor.label} (系数: {currentTimeFactor.factor})</li>
                  <li>调整后价格范围: {calculatedPrices.adjustedLowerLimit} - {calculatedPrices.adjustedUpperLimit} 元/MWh</li>
                </ul>
              </div>
            </motion.div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <div className="text-xl mb-2">请输入参数并点击计算按钮</div>
              <div className="text-sm">系统将根据交易规则计算价格约束</div>
            </div>
          )}
        </Card>
      </div>
      
      {/* 价格约束规则说明 */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">价格约束规则说明</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-3">
            <h4 className="font-medium text-blue-700">不同交易类型的价格限制</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>年度双边协商: ±20%</li>
              <li>月度集中竞价: ±30%</li>
              <li>日前市场: ±50%</li>
              <li>实时平衡: 0% - 200%</li>
              <li>绿色电力: 0% - 40%</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-medium text-blue-700">价格调整机制</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>价格上下限根据基准价动态调整</li>
              <li>不同时段有不同的调整系数</li>
              <li>特殊时期可临时调整价格范围</li>
              <li>新能源交易有特殊价格政策</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PriceConstraintCalculator;