import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import Card from '../components/Card';

interface CostItem {
  id: string;
  name: string;
  description: string;
  rate: number;
  unit: string;
  calculationMethod: string;
  applicableTo: string[];
}

interface CostCategory {
  id: string;
  name: string;
  description: string;
  items: CostItem[];
}

const CostAllocationCalculator: React.FC = () => {
  // 模拟器状态
  const [consumption, setConsumption] = useState<number>(10000);
  const [voltageLevel, setVoltageLevel] = useState<string>('10kV');
  const [calculationResults, setCalculationResults] = useState<Record<string, number>>({});
  const [showDetailedResults, setShowDetailedResults] = useState(false);
  
  // 费用类别数据
  const costCategories: CostCategory[] = [
    {
      id: 'transmission-distribution',
      name: '输配电费',
      description: '包括输电费用和配电费用，根据电压等级和用电量计算',
      items: [
        {
          id: 'transmission-fee',
          name: '输电费用',
          description: '电网企业为用户提供输电服务的费用',
          rate: 0.05,
          unit: '元/kWh',
          calculationMethod: '用电量 × 输电费率',
          applicableTo: ['发电企业', '售电公司', '电力用户']
        },
        {
          id: 'distribution-fee',
          name: '配电费用',
          description: '电网企业为用户提供配电服务的费用',
          rate: 0.15,
          unit: '元/kWh',
          calculationMethod: '用电量 × 配电费率（根据电压等级调整）',
          applicableTo: ['售电公司', '电力用户']
        },
        {
          id: 'transmission-loss',
          name: '输电损耗',
          description: '电力在传输过程中的损耗费用',
          rate: 0.02,
          unit: '元/kWh',
          calculationMethod: '用电量 × 损耗费率',
          applicableTo: ['发电企业', '售电公司', '电力用户']
        },
        {
          id: 'distribution-loss',
          name: '配电损耗',
          description: '电力在配电过程中的损耗费用',
          rate: 0.03,
          unit: '元/kWh',
          calculationMethod: '用电量 × 损耗费率（根据电压等级调整）',
          applicableTo: ['售电公司', '电力用户']
        }
      ]
    },
    {
      id: 'system-operation',
      name: '系统运行费',
      description: '保证电力系统安全稳定运行的费用',
      items: [
        {
          id: 'system-operations',
          name: '系统运行费',
          description: '电力系统日常运行维护费用',
          rate: 0.01,
          unit: '元/kWh',
          calculationMethod: '用电量 × 系统运行费率',
          applicableTo: ['发电企业', '售电公司', '电力用户']
        },
        {
          id: 'demand-response',
          name: '需求响应费用',
          description: '用户参与需求响应的补偿费用',
          rate: 0.005,
          unit: '元/kWh',
          calculationMethod: '参与响应的电量 × 需求响应费率',
          applicableTo: ['电力用户']
        },
        {
          id: 'reliability-service',
          name: '可靠性服务费用',
          description: '保证电力系统可靠性的服务费用',
          rate: 0.008,
          unit: '元/kWh',
          calculationMethod: '用电量 × 可靠性服务费率',
          applicableTo: ['发电企业', '售电公司', '电力用户']
        }
      ]
    },
    {
      id: 'government-funds',
      name: '政府性基金及附加',
      description: '根据国家政策规定征收的基金和附加费用',
      items: [
        {
          id: 'renewable-energy',
          name: '可再生能源发展基金',
          description: '支持可再生能源发展的政府性基金',
          rate: 0.019,
          unit: '元/kWh',
          calculationMethod: '用电量 × 可再生能源发展基金费率',
          applicableTo: ['所有市场主体']
        },
        {
          id: 'resettlement-fund',
          name: '大中型水库移民后期扶持基金',
          description: '用于大中型水库移民后期扶持的基金',
          rate: 0.0062,
          unit: '元/kWh',
          calculationMethod: '用电量 × 移民后期扶持基金费率',
          applicableTo: ['所有市场主体']
        },
        {
          id: 'small-hydropower',
          name: '小水电上网价格调整基金',
          description: '用于小水电上网价格调整的基金',
          rate: 0.0005,
          unit: '元/kWh',
          calculationMethod: '用电量 × 小水电上网价格调整基金费率',
          applicableTo: ['所有市场主体']
        },
        {
          id: 'power-grid-construction',
          name: '地方电力建设基金',
          description: '用于地方电力建设的基金',
          rate: 0.002,
          unit: '元/kWh',
          calculationMethod: '用电量 × 地方电力建设基金费率',
          applicableTo: ['所有市场主体']
        }
      ]
    }
  ];
  
  // 根据电压等级调整费率
  const getAdjustedRate = (baseRate: number, category: string) => {
    const voltageAdjustment: Record<string, Record<string, number>> = {
      'transmission-fee': {
        '10kV': 1.0,
        '35kV': 0.9,
        '110kV': 0.8,
        '220kV': 0.7
      },
      'distribution-fee': {
        '10kV': 1.0,
        '35kV': 0.85,
        '110kV': 0.75,
        '220kV': 0.65
      },
      'transmission-loss': {
        '10kV': 1.0,
        '35kV': 0.95,
        '110kV': 0.9,
        '220kV': 0.85
      },
      'distribution-loss': {
        '10kV': 1.0,
        '35kV': 0.9,
        '110kV': 0.8,
        '220kV': 0.7
      }
    };
    
    return voltageAdjustment[category] ? voltageAdjustment[category][voltageLevel] * baseRate : baseRate;
  };
  
  // 计算费用
  const calculateCosts = () => {
    const results: Record<string, number> = {};
    let totalCost = 0;
    
    costCategories.forEach(category => {
      category.items.forEach(item => {
        const adjustedRate = getAdjustedRate(item.rate, item.id);
        const cost = consumption * adjustedRate;
        results[item.id] = parseFloat(cost.toFixed(2));
        totalCost += cost;
      });
    });
    
    results['total'] = parseFloat(totalCost.toFixed(2));
    setCalculationResults(results);
    setShowDetailedResults(true);
  };
  
  // 重置计算器
  const resetCalculator = () => {
    setConsumption(10000);
    setVoltageLevel('10kV');
    setCalculationResults({});
    setShowDetailedResults(false);
  };
  
  // 计算各类别的费用总和
  const getCategoryTotal = (categoryId: string) => {
    const category = costCategories.find(c => c.id === categoryId);
    if (!category) return 0;
    
    return category.items.reduce((sum, item) => {
      return sum + (calculationResults[item.id] || 0);
    }, 0);
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center mb-4">6-3 费用分摊计算器</h2>
      
      {/* 模拟器说明 */}
      <Card className="mb-6">
        <h3 className="text-lg font-semibold mb-4">模拟器说明</h3>
        <p className="text-gray-600 mb-4">
          本模拟器用于计算电力市场中的各类费用分摊，包括输配电费、系统运行费和政府性基金及附加。
          您可以输入用电量和电压等级，系统将自动计算各项费用的分摊结果。
        </p>
      </Card>
      
      {/* 输入区域 */}
      <Card className="mb-6">
        <h3 className="text-lg font-semibold mb-4">费用计算参数</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              用电量 (kWh)
            </label>
            <input
              type="number"
              min="0"
              step="100"
              value={consumption}
              onChange={(e) => setConsumption(parseFloat(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="请输入用电量"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              电压等级
            </label>
            <select
              value={voltageLevel}
              onChange={(e) => setVoltageLevel(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="10kV">10kV</option>
              <option value="35kV">35kV</option>
              <option value="110kV">110kV</option>
              <option value="220kV">220kV</option>
            </select>
          </div>
        </div>
        
        {/* 计算按钮 */}
        <div className="flex justify-center gap-4 mt-6">
          <Button 
            variant="primary"
            size="large"
            onClick={calculateCosts}
            className="min-w-[200px]"
          >
            开始计算
          </Button>
          <Button 
            variant="secondary"
            size="large"
            onClick={resetCalculator}
            className="min-w-[200px]"
          >
            重置
          </Button>
        </div>
      </Card>
      
      {/* 计算结果 */}
      {Object.keys(calculationResults).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* 总费用概览 */}
          <Card>
            <h3 className="text-lg font-semibold mb-4">计算结果概览</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-sm text-blue-700 mb-1">输配电费</div>
                <div className="text-2xl font-bold text-blue-900">
                  ¥{getCategoryTotal('transmission-distribution').toFixed(2)}
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-sm text-green-700 mb-1">系统运行费</div>
                <div className="text-2xl font-bold text-green-900">
                  ¥{getCategoryTotal('system-operation').toFixed(2)}
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="text-sm text-purple-700 mb-1">政府性基金</div>
                <div className="text-2xl font-bold text-purple-900">
                  ¥{getCategoryTotal('government-funds').toFixed(2)}
                </div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <div className="text-sm text-yellow-700 mb-1">总费用</div>
                <div className="text-2xl font-bold text-yellow-900">
                  ¥{calculationResults.total.toFixed(2)}
                </div>
              </div>
            </div>
            
            {/* 显示/隐藏详细结果按钮 */}
            <div className="flex justify-center mt-6">
              <Button 
                variant="primary"
                onClick={() => setShowDetailedResults(!showDetailedResults)}
              >
                {showDetailedResults ? '隐藏详细结果' : '查看详细结果'}
              </Button>
            </div>
          </Card>
          
          {/* 详细费用计算结果 */}
          {showDetailedResults && (
            <Card>
              <h3 className="text-lg font-semibold mb-4">详细费用计算结果</h3>
              
              {costCategories.map(category => (
                <div key={category.id} className="mb-8">
                  <h4 className="text-md font-semibold text-gray-800 mb-4">
                    {category.name} - {category.description}
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                          <th className="px-6 py-3">费用项目</th>
                          <th className="px-6 py-3">费率</th>
                          <th className="px-6 py-3">计算方法</th>
                          <th className="px-6 py-3">适用对象</th>
                          <th className="px-6 py-3">计算结果 (元)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {category.items.map(item => (
                          <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium">{item.name}</td>
                            <td className="px-6 py-4">{item.rate} {item.unit}</td>
                            <td className="px-6 py-4">{item.calculationMethod}</td>
                            <td className="px-6 py-4">{item.applicableTo.join('、')}</td>
                            <td className="px-6 py-4 font-medium">¥{calculationResults[item.id].toFixed(2)}</td>
                          </tr>
                        ))}
                        <tr className="bg-gray-50 font-semibold">
                          <td className="px-6 py-4" colSpan={4}>类别合计</td>
                          <td className="px-6 py-4">¥{getCategoryTotal(category.id).toFixed(2)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
              
              {/* 总费用合计 */}
              <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <div className="text-lg font-semibold">总费用合计</div>
                  <div className="text-2xl font-bold text-yellow-900">
                    ¥{calculationResults.total.toFixed(2)}
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  基于用电量: {consumption} kWh，电压等级: {voltageLevel} 计算
                </div>
              </div>
            </Card>
          )}
          
          {/* 费用分摊说明 */}
          <Card>
            <h3 className="text-lg font-semibold mb-4">费用分摊说明</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-blue-700">输配电费特点</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>根据电压等级实行差别化费率</li> 
                  <li>电压等级越高，费率越低</li>
                  <li>包含输电损耗和配电损耗</li>
                  <li>按实际用电量计算</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-green-700">系统运行费特点</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>用于保证电力系统安全稳定运行</li>
                  <li>包括系统运行、需求响应和可靠性服务</li>
                  <li>按实际用电量或参与响应的电量计算</li>
                  <li>费率相对较低</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-purple-700">政府性基金特点</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>根据国家政策规定征收</li>
                  <li>费率由政府统一制定</li>
                  <li>用于特定的公共事业和基础设施建设</li>
                  <li>所有市场主体均需缴纳</li>
                </ul>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default CostAllocationCalculator;