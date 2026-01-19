import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import Card from '../components/Card';

const DeviationCalculator: React.FC = () => {
  // 输入参数
  const [contractQuantity, setContractQuantity] = useState<number>(1000);
  const [actualQuantity, setActualQuantity] = useState<number>(1100);
  const [contractPrice, setContractPrice] = useState<number>(0.35);
  const [spotPrice, setSpotPrice] = useState<number>(0.40);
  
  // 计算结果
  const [deviationQuantity, setDeviationQuantity] = useState<number>(0);
  const [deviationType, setDeviationType] = useState<string>('');
  const [contractCost, setContractCost] = useState<number>(0);
  const [spotCost, setSpotCost] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [deviationCost, setDeviationCost] = useState<number>(0);

  // 计算偏差电费
  const calculateDeviation = () => {
    // 计算偏差电量
    const deviation = actualQuantity - contractQuantity;
    setDeviationQuantity(deviation);
    
    // 确定偏差类型
    if (deviation > 0) {
      setDeviationType('正偏差（多用/多发电）');
    } else if (deviation < 0) {
      setDeviationType('负偏差（少用/少发电）');
    } else {
      setDeviationType('无偏差');
    }
    
    // 计算合同电费
    const contract = contractQuantity * contractPrice;
    setContractCost(contract);
    
    // 计算现货电费
    const spot = Math.abs(deviation) * spotPrice;
    setSpotCost(spot);
    
    // 计算总电费
    const total = contract + (deviation > 0 ? spot : -spot);
    setTotalCost(total);
    
    // 计算偏差电费
    const devCost = deviation * spotPrice;
    setDeviationCost(devCost);
  };

  // 重置计算
  const resetCalculator = () => {
    setContractQuantity(1000);
    setActualQuantity(1100);
    setContractPrice(0.35);
    setSpotPrice(0.40);
    setDeviationQuantity(0);
    setDeviationType('');
    setContractCost(0);
    setSpotCost(0);
    setTotalCost(0);
    setDeviationCost(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">偏差电费计算器</h2>
        <p className="text-gray-600">
          计算偏差电量产生的电费，帮助理解偏差处理规则
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 输入参数 */}
        <Card title="输入参数" className="h-full">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">中长期合同电量 (MWh)</label>
              <input
                type="number"
                value={contractQuantity}
                onChange={(e) => setContractQuantity(parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">实际发电量/用电量 (MWh)</label>
              <input
                type="number"
                value={actualQuantity}
                onChange={(e) => setActualQuantity(parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">中长期合同价格 (元/kWh)</label>
              <input
                type="number"
                step="0.01"
                value={contractPrice}
                onChange={(e) => setContractPrice(parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">现货市场价格 (元/kWh)</label>
              <input
                type="number"
                step="0.01"
                value={spotPrice}
                onChange={(e) => setSpotPrice(parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex gap-3 pt-2">
              <Button variant="primary" onClick={calculateDeviation} className="flex-1">
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
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-500">偏差电量</div>
                <div className="text-lg font-semibold">{deviationQuantity} MWh</div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-500">偏差类型</div>
                <div className="text-lg font-semibold">{deviationType}</div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-500">现货电费</div>
                <div className="text-lg font-semibold">{spotCost.toFixed(2)} 元</div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-500">合同电费</div>
                <div className="text-lg font-semibold">{contractCost.toFixed(2)} 元</div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm font-medium mb-2">计算过程</div>
              <div className="space-y-2 text-sm">
                <div>1. 偏差电量 = 实际电量 - 合同电量</div>
                <div className="pl-4">= {actualQuantity} - {contractQuantity} = {deviationQuantity} MWh</div>
                
                <div>2. 合同电费 = 合同电量 × 合同价格</div>
                <div className="pl-4">= {contractQuantity} × {contractPrice} = {contractCost.toFixed(2)} 元</div>
                
                <div>3. 偏差电费 = 偏差电量 × 现货价格</div>
                <div className="pl-4">= {deviationQuantity} × {spotPrice} = {deviationCost.toFixed(2)} 元</div>
                
                <div>4. 总电费 = 合同电费 + 偏差电费</div>
                <div className="pl-4">= {contractCost.toFixed(2)} + {deviationCost.toFixed(2)} = {totalCost.toFixed(2)} 元</div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="text-sm font-medium mb-2">说明</div>
              <div className="text-sm text-gray-600 space-y-1">
                <div>• 正偏差（多用/多发电）：按现货市场价格结算</div>
                <div>• 负偏差（少用/少发电）：按现货市场价格结算</div>
                <div>• 现货价格高于合同价格时，正偏差对发电企业有利</div>
                <div>• 现货价格低于合同价格时，负偏差对发电企业有利</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
};

export default DeviationCalculator;