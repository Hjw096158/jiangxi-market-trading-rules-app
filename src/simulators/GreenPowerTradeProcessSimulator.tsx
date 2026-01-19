import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import Card from '../components/Card';

interface ProcessStep {
  id: string;
  title: string;
  description: string;
  detailedDescription: string;
  icon: string;
  color: string;
  sequence: number;
}

interface TransactionStage {
  id: string;
  name: string;
  description: string;
  steps: ProcessStep[];
}

interface InteractiveStep {
  id: string;
  title: string;
  action: string;
  result: string;
  completed: boolean;
}

const GreenPowerTradeProcessSimulator: React.FC = () => {
  // 模拟器状态
  const [activeStep, setActiveStep] = useState<string>('step-1');
  const [showInteractiveMode, setShowInteractiveMode] = useState(false);
  const [currentInteractiveStep, setCurrentInteractiveStep] = useState(0);
  const [interactiveSteps, setInteractiveSteps] = useState<InteractiveStep[]>([
    {
      id: 'interactive-1',
      title: '注册成为绿电交易主体',
      action: '提交注册申请并通过审核',
      result: '成功成为绿电交易主体',
      completed: false
    },
    {
      id: 'interactive-2',
      title: '发布绿电交易需求',
      action: '填写交易电量、价格等信息',
      result: '交易需求发布成功',
      completed: false
    },
    {
      id: 'interactive-3',
      title: '匹配交易对手',
      action: '系统自动匹配或手动选择交易对手',
      result: '找到合适的交易对手',
      completed: false
    },
    {
      id: 'interactive-4',
      title: '签订绿电交易合同',
      action: '确认合同条款并签署',
      result: '绿电交易合同签订完成',
      completed: false
    },
    {
      id: 'interactive-5',
      title: '完成电力交割',
      action: '按照合同约定完成电力供应',
      result: '电力交割成功',
      completed: false
    },
    {
      id: 'interactive-6',
      title: '获取绿证',
      action: '系统自动核发绿证',
      result: '成功获取相应数量的绿证',
      completed: false
    },
    {
      id: 'interactive-7',
      title: '完成交易结算',
      action: '支付交易款项并完成结算',
      result: '交易结算完成',
      completed: false
    }
  ]);
  
  // 交易阶段数据
  const transactionStages: TransactionStage[] = [
    {
      id: 'preparation',
      name: '交易前准备',
      description: '绿电交易前的必要准备工作',
      steps: [
        {
          id: 'step-1',
          title: '主体注册',
          description: '成为合格的绿电交易主体',
          detailedDescription: '市场主体需向交易机构提交注册申请，包括企业基本信息、资质证明、信用记录等，通过审核后成为合格的绿电交易主体。',
          icon: '📝',
          color: 'bg-blue-500',
          sequence: 1
        },
        {
          id: 'step-2',
          title: '账户开立',
          description: '开立交易和结算账户',
          detailedDescription: '在交易平台开立交易账户，在结算机构开立结算账户，用于交易申报和资金结算。',
          icon: '💼',
          color: 'bg-green-500',
          sequence: 2
        },
        {
          id: 'step-3',
          title: '交易权限申请',
          description: '申请相应的交易权限',
          detailedDescription: '根据自身需求申请绿电交易权限，包括交易品种、交易规模等。',
          icon: '🔑',
          color: 'bg-purple-500',
          sequence: 3
        }
      ]
    },
    {
      id: 'transaction',
      name: '交易执行',
      description: '绿电交易的核心执行流程',
      steps: [
        {
          id: 'step-4',
          title: '交易申报',
          description: '提交绿电交易申报',
          detailedDescription: '市场主体通过交易平台提交绿电交易申报，包括交易电量、价格、交易时段、绿电属性要求等信息。',
          icon: '📊',
          color: 'bg-yellow-500',
          sequence: 4
        },
        {
          id: 'step-5',
          title: '交易匹配',
          description: '系统自动匹配交易',
          detailedDescription: '交易系统根据申报信息进行自动匹配，形成成交结果。匹配原则包括价格优先、时间优先等。',
          icon: '🔄',
          color: 'bg-orange-500',
          sequence: 5
        },
        {
          id: 'step-6',
          title: '合同确认',
          description: '确认交易合同',
          detailedDescription: '交易双方确认成交结果，系统生成电子合同，双方签署确认。',
          icon: '📄',
          color: 'bg-red-500',
          sequence: 6
        }
      ]
    },
    {
      id: 'delivery',
      name: '交割与结算',
      description: '绿电的物理交割和金融结算',
      steps: [
        {
          id: 'step-7',
          title: '电力交割',
          description: '完成电力物理交割',
          detailedDescription: '按照合同约定，卖方通过电网完成电力的物理交割，买方接收电力。',
          icon: '⚡',
          color: 'bg-indigo-500',
          sequence: 7
        },
        {
          id: 'step-8',
          title: '绿证核发',
          description: '核发相应的绿证',
          detailedDescription: '交易机构根据实际交割的绿电量，向买方核发相应数量的绿色电力证书。',
          icon: '🌱',
          color: 'bg-teal-500',
          sequence: 8
        },
        {
          id: 'step-9',
          title: '交易结算',
          description: '完成交易款项结算',
          detailedDescription: '结算机构根据成交结果和实际交割情况，完成交易款项的结算，包括电力费用和绿色溢价部分。',
          icon: '💰',
          color: 'bg-rose-500',
          sequence: 9
        }
      ]
    },
    {
      id: 'post',
      name: '交易后管理',
      description: '绿电交易完成后的相关管理工作',
      steps: [
        {
          id: 'step-10',
          title: '绿证使用',
          description: '使用或注销绿证',
          detailedDescription: '买方可以使用绿证用于碳减排证明，或按照规定流程注销绿证，避免重复使用。',
          icon: '✅',
          color: 'bg-amber-500',
          sequence: 10
        },
        {
          id: 'step-11',
          title: '信息披露',
          description: '披露交易相关信息',
          detailedDescription: '交易机构和市场主体按照规定披露绿电交易相关信息，包括交易电量、价格、绿证核发情况等。',
          icon: '📢',
          color: 'bg-sky-500',
          sequence: 11
        },
        {
          id: 'step-12',
          title: '档案管理',
          description: '归档交易相关资料',
          detailedDescription: '交易双方和相关机构归档交易合同、交割记录、绿证信息等相关资料，保存期限按照规定执行。',
          icon: '📁',
          color: 'bg-emerald-500',
          sequence: 12
        }
      ]
    }
  ];
  
  // 获取所有步骤，按顺序排序
  const allSteps = transactionStages.flatMap(stage => stage.steps).sort((a, b) => a.sequence - b.sequence);
  
  // 获取当前步骤
  const currentStep = allSteps.find(step => step.id === activeStep) || allSteps[0];
  
  // 完成当前交互步骤
  const completeInteractiveStep = () => {
    if (currentInteractiveStep < interactiveSteps.length) {
      const updatedSteps = [...interactiveSteps];
      updatedSteps[currentInteractiveStep].completed = true;
      setInteractiveSteps(updatedSteps);
      
      if (currentInteractiveStep < interactiveSteps.length - 1) {
        setTimeout(() => {
          setCurrentInteractiveStep(prev => prev + 1);
        }, 1000);
      }
    }
  };
  
  // 重置交互模式
  const resetInteractiveMode = () => {
    setInteractiveSteps(interactiveSteps.map(step => ({ ...step, completed: false })));
    setCurrentInteractiveStep(0);
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center mb-4">5-2 绿电交易流程模拟器</h2>
      
      {/* 模拟器说明 */}
      <Card className="mb-6">
        <h3 className="text-lg font-semibold mb-4">模拟器说明</h3>
        <p className="text-gray-600 mb-4">
          本模拟器用于展示绿电交易的完整流程，包括交易前准备、交易执行、交割与结算以及交易后管理四个主要阶段。
          您可以通过点击流程步骤查看详细信息，或切换到交互式模式亲身体验绿电交易流程。
        </p>
        
        {/* 模式切换按钮 */}
        <div className="flex justify-center gap-4 mb-4">
          <Button 
            variant={!showInteractiveMode ? 'primary' : 'secondary'}
            onClick={() => setShowInteractiveMode(false)}
          >
            流程展示模式
          </Button>
          <Button 
            variant={showInteractiveMode ? 'primary' : 'secondary'}
            onClick={() => setShowInteractiveMode(true)}
          >
            交互式体验模式
          </Button>
        </div>
      </Card>
      
      {/* 流程展示模式 */}
      {!showInteractiveMode && (
        <div className="space-y-8">
          {/* 流程阶段展示 */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-center">绿电交易流程总览</h3>
            
            {/* 流程步骤 */}
            <div className="relative">
              {/* 连接线 */}
              <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-200 transform -translate-x-1/2"></div>
              
              {/* 流程步骤卡片 */}
              <div className="space-y-12">
                {transactionStages.map((stage) => (
                  <div key={stage.id} className="relative">
                    {/* 阶段标题 */}
                    <div className="flex items-center justify-center mb-6">
                      <div className="bg-white px-6 py-2 rounded-full shadow-md">
                        <h4 className="text-lg font-semibold text-blue-700">{stage.name}</h4>
                      </div>
                    </div>
                    
                    {/* 阶段步骤 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {stage.steps.map((step) => (
                        <motion.div
                          key={step.id}
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                          onClick={() => setActiveStep(step.id)}
                          className={`cursor-pointer relative ${activeStep === step.id ? 'ring-2 ring-blue-500' : ''}`}
                        >
                          <Card className="h-full p-6">
                            <div className="flex items-start gap-4">
                              <div className={`w-12 h-12 rounded-full ${step.color} flex items-center justify-center text-white text-xl font-bold`}>
                                {step.icon}
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                  <h5 className="text-lg font-semibold">{step.title}</h5>
                                  <div className="text-sm text-gray-500">步骤 {step.sequence}</div>
                                </div>
                                <p className="text-gray-600 mb-3">{step.description}</p>
                                <Button variant="primary" size="small">
                                  查看详情
                                </Button>
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* 步骤详情 */}
          <div>
            <Card>
              <h3 className="text-lg font-semibold mb-4">步骤详情</h3>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <div className={`w-24 h-24 rounded-full ${currentStep.color} flex items-center justify-center text-white text-3xl font-bold mb-4`}>
                    {currentStep.icon}
                  </div>
                  <h4 className="text-xl font-semibold mb-2">{currentStep.title}</h4>
                  <p className="text-sm text-gray-500 mb-4">步骤 {currentStep.sequence}</p>
                  <p className="text-gray-600">{currentStep.description}</p>
                </div>
                <div className="md:w-2/3">
                  <h5 className="font-medium text-blue-700 mb-3">详细说明</h5>
                  <p className="text-gray-700 mb-4">{currentStep.detailedDescription}</p>
                  
                  {/* 导航按钮 */}
                  <div className="flex justify-between mt-6">
                    <Button 
                      variant="secondary"
                      onClick={() => {
                        const currentIndex = allSteps.findIndex(step => step.id === activeStep);
                        if (currentIndex > 0) {
                          setActiveStep(allSteps[currentIndex - 1].id);
                        }
                      }}
                      disabled={activeStep === allSteps[0].id}
                    >
                      上一步
                    </Button>
                    <Button 
                      variant="primary"
                      onClick={() => {
                        const currentIndex = allSteps.findIndex(step => step.id === activeStep);
                        if (currentIndex < allSteps.length - 1) {
                          setActiveStep(allSteps[currentIndex + 1].id);
                        }
                      }}
                      disabled={activeStep === allSteps[allSteps.length - 1].id}
                    >
                      下一步
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
      
      {/* 交互式体验模式 */}
      {showInteractiveMode && (
        <div className="space-y-8">
          <Card className="mb-6">
            <h3 className="text-xl font-semibold mb-4 text-center">交互式绿电交易体验</h3>
            <p className="text-gray-600 text-center mb-6">
              请按照提示完成以下绿电交易步骤，体验完整的绿电交易流程
            </p>
            
            {/* 进度条 */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm text-gray-500">
                  步骤 {currentInteractiveStep + 1} / {interactiveSteps.length}
                </div>
                <div className="text-sm text-gray-500">
                  完成度: {Math.round(((currentInteractiveStep) / interactiveSteps.length) * 100)}%
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-green-500 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${((currentInteractiveStep) / interactiveSteps.length) * 100}%` }}
                ></div>
              </div>
            </div>
            
            {/* 步骤指示器 */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {interactiveSteps.map((step, index) => (
                <div 
                  key={step.id}
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium ${step.completed ? 'bg-green-500 text-white' : index === currentInteractiveStep ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  {step.completed ? '✓' : index + 1}
                </div>
              ))}
            </div>
            
            {/* 当前交互步骤 */}
            <motion.div
              key={currentInteractiveStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <Card className="p-6">
                <h4 className="text-lg font-semibold mb-4 text-center">{interactiveSteps[currentInteractiveStep].title}</h4>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-medium text-blue-700 mb-2">操作要求</h5>
                    <p className="text-gray-700">{interactiveSteps[currentInteractiveStep].action}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-medium text-blue-700 mb-2">预期结果</h5>
                    <p className="text-gray-700">{interactiveSteps[currentInteractiveStep].result}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
            
            {/* 操作按钮 */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {currentInteractiveStep < interactiveSteps.length && (
                <Button 
                  variant="primary"
                  size="large"
                  onClick={completeInteractiveStep}
                  className="min-w-[200px]"
                >
                  {interactiveSteps[currentInteractiveStep].completed ? '下一步' : '完成此步骤'}
                </Button>
              )}
              
              {currentInteractiveStep === interactiveSteps.length && (
                <Button 
                  variant="primary"
                  size="large"
                  onClick={resetInteractiveMode}
                  className="min-w-[200px]"
                >
                  重新体验
                </Button>
              )}
              
              <Button 
                variant="secondary"
                onClick={resetInteractiveMode}
                className="min-w-[200px]"
              >
                重置流程
              </Button>
            </div>
            
            {/* 完成提示 */}
            {currentInteractiveStep === interactiveSteps.length && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mt-8 bg-green-50 p-6 rounded-lg text-center"
              >
                <h4 className="text-xl font-semibold text-green-700 mb-2">🎉 恭喜您完成了绿电交易流程体验！</h4>
                <p className="text-gray-600">
                  通过这个交互式体验，您已经了解了绿电交易的完整流程，包括注册成为交易主体、发布交易需求、匹配交易对手、签订合同、完成交割和获取绿证等关键步骤。
                </p>
              </motion.div>
            )}
          </Card>
        </div>
      )}
      
      {/* 流程说明卡片 */}
      <Card className="mb-6">
        <h3 className="text-lg font-semibold mb-4">绿电交易流程说明</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-medium text-blue-700">流程特点</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>与普通电力交易流程类似，但增加了绿证管理环节</li>
              <li>强调绿色属性的溯源和唯一性</li>
              <li>需要额外的绿证核发和管理流程</li>
              <li>交易信息披露要求更严格</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-medium text-blue-700">注意事项</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>绿电交易需确保绿色属性的真实性</li>
              <li>绿证使用后需及时注销，避免重复使用</li>
              <li>交易合同需明确绿证的归属和转移方式</li>
              <li>需按照规定披露绿电交易相关信息</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default GreenPowerTradeProcessSimulator;