import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import Card from '../components/Card';

interface Scenario {
  id: number;
  name: string;
  description: string;
  type: 'change' | 'cancellation';
  requirements: string[];
  process: string[];
  result: string;
}

const InformationChangeAndCancellationSimulator: React.FC = () => {
  // 游戏状态
  const [selectedType, setSelectedType] = useState<'change' | 'cancellation'>('change');
  const [currentScenario, setCurrentScenario] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  
  // 场景数据
  const scenarios: Scenario[] = [
    {
      id: 1,
      name: '企业名称变更',
      description: '模拟企业名称变更流程',
      type: 'change',
      requirements: [
        '提供工商变更证明',
        '填写信息变更申请表',
        '提交变更申请',
        '等待交易机构审核'
      ],
      process: [
        '企业完成工商名称变更',
        '在交易平台提交变更申请',
        '上传工商变更证明文件',
        '交易机构审核变更申请',
        '审核通过，变更生效'
      ],
      result: '企业名称变更成功，新名称已生效'
    },
    {
      id: 2,
      name: '法定代表人变更',
      description: '模拟法定代表人变更流程',
      type: 'change',
      requirements: [
        '提供法定代表人身份证明',
        '提供工商变更证明',
        '填写信息变更申请表',
        '提交变更申请'
      ],
      process: [
        '企业完成法定代表人变更',
        '在交易平台提交变更申请',
        '上传相关证明文件',
        '交易机构审核',
        '变更生效，更新市场主体信息'
      ],
      result: '法定代表人变更成功，新法定代表人已生效'
    },
    {
      id: 3,
      name: '主动申请退出',
      description: '模拟经营主体主动申请退出市场',
      type: 'cancellation',
      requirements: [
        '提前20个工作日申请',
        '处理完存量合同',
        '结清所有费用',
        '提交退出申请表'
      ],
      process: [
        '企业决定退出市场',
        '提前20个工作日提交退出申请',
        '处理存量合同和费用结算',
        '交易机构审核退出申请',
        '完成退出，注销市场资格'
      ],
      result: '企业成功退出市场，市场交易资格已注销'
    },
    {
      id: 4,
      name: '强制退出市场',
      description: '模拟经营主体被强制退出市场',
      type: 'cancellation',
      requirements: [
        '违反市场规则',
        '提供虚假信息',
        '严重违规行为',
        '丧失市场准入条件'
      ],
      process: [
        '企业存在违规行为',
        '交易机构调查核实',
        '作出强制退出决定',
        '企业处理后续事宜',
        '强制退出，注销市场资格'
      ],
      result: '企业因违规被强制退出市场，市场交易资格已注销'
    }
  ];
  
  // 筛选场景
  const filteredScenarios = scenarios.filter(scenario => scenario.type === selectedType);
  
  // 重置游戏
  const handleReset = () => {
    setCurrentScenario(0);
    setIsCompleted(false);
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center mb-4">1-4 信息变更与注销模拟</h2>
      
      {/* 操作类型选择 */}
      <Card>
        <h3 className="text-xl font-semibold mb-4">选择操作类型</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setSelectedType('change');
              setCurrentScenario(0);
              setIsCompleted(false);
            }}
            className={`p-4 border-2 rounded-lg text-center transition-all duration-200 ${selectedType === 'change' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
          >
            <h4 className="font-medium">信息变更</h4>
            <p className="text-sm text-gray-600 mt-1">变更已注册的市场主体信息</p>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setSelectedType('cancellation');
              setCurrentScenario(0);
              setIsCompleted(false);
            }}
            className={`p-4 border-2 rounded-lg text-center transition-all duration-200 ${selectedType === 'cancellation' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
          >
            <h4 className="font-medium">市场退出</h4>
            <p className="text-sm text-gray-600 mt-1">注销市场交易资格，退出市场</p>
          </motion.button>
        </div>
      </Card>
      
      {/* 场景选择 */}
      <Card>
        {!isCompleted ? (
          <div className="space-y-6">
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold">{filteredScenarios[currentScenario].name}</h3>
              <p className="text-gray-600 mt-2">{filteredScenarios[currentScenario].description}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 要求 */}
              <div>
                <h4 className="font-medium mb-2">操作要求：</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  {filteredScenarios[currentScenario].requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
              
              {/* 流程 */}
              <div>
                <h4 className="font-medium mb-2">操作流程：</h4>
                <ol className="list-decimal list-inside text-gray-600 space-y-1">
                  {filteredScenarios[currentScenario].process.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
            
            {/* 操作按钮 */}
            <div className="flex justify-center gap-4">
              <Button 
                variant="primary" 
                onClick={() => {
                  if (currentScenario < filteredScenarios.length - 1) {
                    setCurrentScenario(prev => prev + 1);
                  } else {
                    setIsCompleted(true);
                  }
                }}
              >
                {currentScenario < filteredScenarios.length - 1 ? '下一个场景' : '完成模拟'}
              </Button>
              <Button variant="secondary" onClick={handleReset}>
                重新开始
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <h3 className="text-2xl font-bold mb-2">模拟完成！</h3>
            <p className="text-gray-600 mb-4">您已完成所有{selectedType === 'change' ? '信息变更' : '市场退出'}场景的模拟练习</p>
            
            <div className="p-6 bg-blue-50 rounded-lg mx-auto max-w-lg mb-6">
              <h4 className="font-semibold mb-3">模拟总结：</h4>
              <p className="text-gray-700">{filteredScenarios[currentScenario].result}</p>
            </div>
            
            <Button variant="primary" onClick={handleReset}>
              重新模拟
            </Button>
          </div>
        )}
      </Card>
      
      {/* 注意事项 */}
      <Card>
        <h3 className="text-xl font-semibold mb-4">注意事项</h3>
        <div className="space-y-3">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-800 font-medium text-sm mr-2 mt-0.5">1</div>
            <div>
              <h4 className="font-medium">信息变更</h4>
              <p className="text-sm text-gray-600">重要信息变更需及时向交易机构申请，包括企业名称、法定代表人、机组技术参数等。</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-800 font-medium text-sm mr-2 mt-0.5">2</div>
            <div>
              <h4 className="font-medium">市场退出</h4>
              <p className="text-sm text-gray-600">经营主体主动退出需提前20个工作日申请，处理完存量合同和费用结算。</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-800 font-medium text-sm mr-2 mt-0.5">3</div>
            <div>
              <h4 className="font-medium">强制退出</h4>
              <p className="text-sm text-gray-600">提供虚假信息、严重违规或丧失准入条件的经营主体可能被强制退出市场。</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default InformationChangeAndCancellationSimulator;
