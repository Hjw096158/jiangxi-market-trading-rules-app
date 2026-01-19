import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import Card from '../components/Card';

interface ProcessStep {
  id: number;
  name: string;
  description: string;
  requirements: string[];
  isCompleted: boolean;
  canProceed: boolean;
}

const RegistrationProcessSimulator: React.FC = () => {
  // 游戏状态
  const [currentStep, setCurrentStep] = useState(0);
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>([
    {
      id: 1,
      name: '提交注册申请',
      description: '向电力交易机构提交市场注册申请',
      requirements: [
        '填写完整的注册申请表',
        '上传相关资质文件',
        '确认申请信息无误'
      ],
      isCompleted: false,
      canProceed: false
    },
    {
      id: 2,
      name: '签署市场承诺',
      description: '签署市场行为承诺书',
      requirements: [
        '阅读并理解市场规则',
        '承诺遵守市场规则',
        '提交电子签名'
      ],
      isCompleted: false,
      canProceed: false
    },
    {
      id: 3,
      name: '交易机构审查',
      description: '电力交易机构进行资格审查',
      requirements: [
        '审查注册材料完整性',
        '验证资质文件真实性',
        '评估是否符合准入条件'
      ],
      isCompleted: false,
      canProceed: false
    },
    {
      id: 4,
      name: '售电公司公示',
      description: '售电公司需进行10个工作日公示',
      requirements: [
        '发布公示信息',
        '接受社会监督',
        '处理公示期间异议'
      ],
      isCompleted: false,
      canProceed: false
    },
    {
      id: 5,
      name: '注册生效',
      description: '完成注册，获取市场交易资格',
      requirements: [
        '公示期无异议',
        '审查通过',
        '注册信息生效'
      ],
      isCompleted: false,
      canProceed: false
    }
  ]);
  
  // 申请类型
  const [applicationType, setApplicationType] = useState<'seller' | 'buyer' | 'new'>('buyer');
  
  // 完成当前步骤
  const handleCompleteStep = () => {
    const updatedSteps = [...processSteps];
    updatedSteps[currentStep].isCompleted = true;
    updatedSteps[currentStep].canProceed = true;
    
    // 如果是第2步（签署承诺）且是售电公司，需要开启第4步（公示）
    if (currentStep === 1 && applicationType === 'buyer') {
      updatedSteps[3].canProceed = true;
    }
    
    setProcessSteps(updatedSteps);
  };
  
  // 进入下一步
  const handleNextStep = () => {
    if (currentStep < processSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  // 重置流程
  const handleReset = () => {
    setCurrentStep(0);
    setProcessSteps([
      {
        id: 1,
        name: '提交注册申请',
        description: '向电力交易机构提交市场注册申请',
        requirements: [
          '填写完整的注册申请表',
          '上传相关资质文件',
          '确认申请信息无误'
        ],
        isCompleted: false,
        canProceed: false
      },
      {
        id: 2,
        name: '签署市场承诺',
        description: '签署市场行为承诺书',
        requirements: [
          '阅读并理解市场规则',
          '承诺遵守市场规则',
          '提交电子签名'
        ],
        isCompleted: false,
        canProceed: false
      },
      {
        id: 3,
        name: '交易机构审查',
        description: '电力交易机构进行资格审查',
        requirements: [
          '审查注册材料完整性',
          '验证资质文件真实性',
          '评估是否符合准入条件'
        ],
        isCompleted: false,
        canProceed: false
      },
      {
        id: 4,
        name: '售电公司公示',
        description: '售电公司需进行10个工作日公示',
        requirements: [
          '发布公示信息',
          '接受社会监督',
          '处理公示期间异议'
        ],
        isCompleted: false,
        canProceed: false
      },
      {
        id: 5,
        name: '注册生效',
        description: '完成注册，获取市场交易资格',
        requirements: [
          '公示期无异议',
          '审查通过',
          '注册信息生效'
        ],
        isCompleted: false,
        canProceed: false
      }
    ]);
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center mb-4">1-3 注册流程闯关器</h2>
      
      {/* 申请类型选择 */}
      <Card>
        <h3 className="text-xl font-semibold mb-4">选择申请类型</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setApplicationType('seller')}
            className={`p-4 border-2 rounded-lg text-center transition-all duration-200 ${applicationType === 'seller' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
          >
            <h4 className="font-medium">发电企业</h4>
            <p className="text-sm text-gray-600 mt-1">申请成为售电侧市场主体</p>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setApplicationType('buyer')}
            className={`p-4 border-2 rounded-lg text-center transition-all duration-200 ${applicationType === 'buyer' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
          >
            <h4 className="font-medium">售电公司</h4>
            <p className="text-sm text-gray-600 mt-1">申请成为购电侧市场主体</p>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setApplicationType('new')}
            className={`p-4 border-2 rounded-lg text-center transition-all duration-200 ${applicationType === 'new' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
          >
            <h4 className="font-medium">新型主体</h4>
            <p className="text-sm text-gray-600 mt-1">申请成为新型经营主体</p>
          </motion.button>
        </div>
      </Card>
      
      {/* 流程步骤 */}
      <Card>
        <h3 className="text-xl font-semibold mb-6">注册流程</h3>
        
        {/* 流程进度条 */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-between">
            {processSteps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`z-10 flex items-center justify-center w-10 h-10 rounded-full ${step.isCompleted ? 'bg-green-500 text-white' : index <= currentStep ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
                  {step.isCompleted ? '✓' : step.id}
                </div>
                <div className="mt-2 text-sm font-medium">{step.name}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* 当前步骤详情 */}
        <div className="space-y-6">
          <div className="text-center mb-4">
            <h4 className="text-xl font-semibold">{processSteps[currentStep].name}</h4>
            <p className="text-gray-600 mt-2">{processSteps[currentStep].description}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h5 className="font-medium mb-2">步骤要求：</h5>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              {processSteps[currentStep].requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>
          
          {/* 特殊说明 */}
          {currentStep === 3 && applicationType !== 'buyer' && (
            <div className="p-4 bg-yellow-100 text-yellow-800 rounded-lg">
              <h5 className="font-medium mb-2">注意：</h5>
              <p>只有售电公司需要进行10个工作日的公示，其他类型经营主体无需公示。</p>
            </div>
          )}
          
          {/* 操作按钮 */}
          <div className="flex justify-center gap-4">
            {!processSteps[currentStep].isCompleted ? (
              <Button variant="primary" onClick={handleCompleteStep}>
                完成此步骤
              </Button>
            ) : (
              <Button variant="primary" onClick={handleNextStep} disabled={currentStep === processSteps.length - 1}>
                进入下一步
              </Button>
            )}
            {currentStep === processSteps.length - 1 && processSteps[currentStep].isCompleted && (
              <Button variant="secondary" onClick={handleReset}>
                重新开始
              </Button>
            )}
          </div>
          
          {/* 流程完成提示 */}
          {currentStep === processSteps.length - 1 && processSteps[currentStep].isCompleted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-6 bg-green-100 text-green-800 rounded-lg text-center"
            >
              <h4 className="text-2xl font-bold mb-2">🎉 注册流程完成！</h4>
              <p className="mb-4">恭喜您成功完成市场注册流程，获取了市场交易资格。</p>
              <p className="text-sm">现在您可以开始参与江西电力市场交易了！</p>
            </motion.div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default RegistrationProcessSimulator;
