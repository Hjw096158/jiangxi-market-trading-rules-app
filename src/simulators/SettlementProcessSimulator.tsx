import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import Card from '../components/Card';

interface SettlementStep {
  id: string;
  title: string;
  description: string;
  detailedDescription: string;
  icon: string;
  color: string;
  sequence: number;
  involvedParties: string[];
}

interface SettlementStage {
  id: string;
  name: string;
  description: string;
  steps: SettlementStep[];
}

const SettlementProcessSimulator: React.FC = () => {
  // 模拟器状态
  const [activeStep, setActiveStep] = useState<string>('step-1');
  const [showInteractiveMode, setShowInteractiveMode] = useState(false);
  const [currentInteractiveStep, setCurrentInteractiveStep] = useState(0);
  
  // 结算阶段数据
  const settlementStages: SettlementStage[] = [
    {
      id: 'data-collection',
      name: '数据采集',
      description: '收集结算所需的各项数据',
      steps: [
        {
          id: 'step-1',
          title: '电量数据采集',
          description: '采集实际发电量、用电量等基础数据',
          detailedDescription: '电网企业采集各市场主体的实际发电量、用电量、偏差电量等基础数据，包括计划电量与实际电量的对比数据。',
          icon: '📊',
          color: 'bg-blue-500',
          sequence: 1,
          involvedParties: ['电网企业', '发电企业', '电力用户']
        },
        {
          id: 'step-2',
          title: '交易数据整理',
          description: '整理交易合同与成交结果数据',
          detailedDescription: '交易机构整理各交易品种的成交结果、合同数据，包括交易电量、交易价格、结算参考点等信息。',
          icon: '📋',
          color: 'bg-green-500',
          sequence: 2,
          involvedParties: ['交易机构']
        },
        {
          id: 'step-3',
          title: '辅助服务数据收集',
          description: '收集辅助服务相关数据',
          detailedDescription: '调度机构收集调频、备用等辅助服务的调用数据、考核数据，作为辅助服务费用结算的依据。',
          icon: '⚙️',
          color: 'bg-purple-500',
          sequence: 3,
          involvedParties: ['调度机构', '辅助服务提供者']
        }
      ]
    },
    {
      id: 'calculation',
      name: '费用计算',
      description: '计算各项电费与服务费',
      steps: [
        {
          id: 'step-4',
          title: '电能量电费计算',
          description: '计算市场化电能量电费',
          detailedDescription: '根据成交结果和实际电量，计算各市场主体的电能量电费，包括市场化交易电费和偏差电费。',
          icon: '💰',
          color: 'bg-yellow-500',
          sequence: 4,
          involvedParties: ['结算机构']
        },
        {
          id: 'step-5',
          title: '输配电费计算',
          description: '计算输配电费与损耗',
          detailedDescription: '根据输配电价政策和实际用电量，计算各市场主体应承担的输配电费和损耗费用。',
          icon: '⚡',
          color: 'bg-orange-500',
          sequence: 5,
          involvedParties: ['电网企业', '结算机构']
        },
        {
          id: 'step-6',
          title: '辅助服务费用计算',
          description: '计算辅助服务费用',
          detailedDescription: '根据辅助服务调用情况和考核结果，计算各市场主体应获得或应支付的辅助服务费用。',
          icon: '🔋',
          color: 'bg-red-500',
          sequence: 6,
          involvedParties: ['调度机构', '结算机构']
        },
        {
          id: 'step-7',
          title: '政府性基金计算',
          description: '计算政府性基金及附加',
          detailedDescription: '根据国家政策，计算各市场主体应缴纳的政府性基金及附加，如可再生能源发展基金、大中型水库移民后期扶持基金等。',
          icon: '🏛️',
          color: 'bg-indigo-500',
          sequence: 7,
          involvedParties: ['结算机构']
        }
      ]
    },
    {
      id: 'settlement',
      name: '电费结算',
      description: '完成电费的结算与支付',
      steps: [
        {
          id: 'step-8',
          title: '结算单生成',
          description: '生成电费结算单',
          detailedDescription: '结算机构根据各项计算结果，生成详细的电费结算单，包括各项费用的明细和汇总。',
          icon: '📄',
          color: 'bg-teal-500',
          sequence: 8,
          involvedParties: ['结算机构']
        },
        {
          id: 'step-9',
          title: '结算单确认',
          description: '市场主体确认结算单',
          detailedDescription: '结算机构向各市场主体推送结算单，市场主体核对无误后确认，如有异议可提出申诉。',
          icon: '✅',
          color: 'bg-rose-500',
          sequence: 9,
          involvedParties: ['结算机构', '所有市场主体']
        },
        {
          id: 'step-10',
          title: '资金清算',
          description: '完成资金的清算与划转',
          detailedDescription: '结算机构根据确认后的结算单，通过资金清算系统完成各项费用的资金划转，实现电费的最终结算。',
          icon: '💸',
          color: 'bg-amber-500',
          sequence: 10,
          involvedParties: ['结算机构', '银行', '所有市场主体']
        },
        {
          id: 'step-11',
          title: '账单发布',
          description: '发布最终电费账单',
          detailedDescription: '结算完成后，向各市场主体发布最终的电费账单，作为财务处理和审计的依据。',
          icon: '📢',
          color: 'bg-sky-500',
          sequence: 11,
          involvedParties: ['结算机构']
        }
      ]
    }
  ];
  
  // 结算单样例数据
  interface SettlementSample {
    id: string;
    name: string;
    description: string;
    sampleType: string;
    period: string;
    keyInfo: Record<string, string>;
    sections: Array<{
      title: string;
      data: Array<{
        item: string;
        value: string;
        note?: string;
      }>;
    }>;
  }
  
  // 结算单样例数据
  const settlementSamples: SettlementSample[] = [
    {
      id: 'sample-1',
      name: '燃煤发电企业月度结算单',
      description: '燃煤发电企业月度结算单样例',
      sampleType: '燃煤发电企业',
      period: '2025年1月1日至2025年1月31日',
      keyInfo: {
        '结算单编号': 'JX-COAL-2025-01-001',
        '企业名称': '江西某煤电有限公司',
        '机组编号': 'JX-COAL-01',
        '出具日期': '2025年2月8日'
      },
      sections: [
        {
          title: '基本信息',
          data: [
            { item: '装机容量', value: '600 MW' },
            { item: '结算月天数', value: '31天' },
            { item: '月度省内上网电量', value: '352,800 MWh' }
          ]
        },
        {
          title: '市场化交易电量',
          data: [
            { item: '年度双边协商', value: '200,000 MWh' },
            { item: '月度集中竞价', value: '100,000 MWh' },
            { item: '日前现货市场', value: '52,800 MWh' }
          ]
        },
        {
          title: '电费结算明细',
          data: [
            { item: '市场化交易电费', value: '17,640,000 元' },
            { item: '辅助服务费用', value: '882,000 元' },
            { item: '偏差电费', value: '-176,400 元' },
            { item: '总电费', value: '18,345,600 元' }
          ]
        }
      ]
    },
    {
      id: 'sample-2',
      name: '新能源企业月度结算单（光伏）',
      description: '新能源企业月度结算单样例',
      sampleType: '新能源企业',
      period: '2025年1月1日至2025年1月31日',
      keyInfo: {
        '结算单编号': 'JX-PV-2025-01-001',
        '企业名称': '江西某光伏有限公司',
        '场站编号': 'JX-PV-01',
        '出具日期': '2025年2月8日'
      },
      sections: [
        {
          title: '基本信息',
          data: [
            { item: '装机容量', value: '100 MW' },
            { item: '结算月天数', value: '31天' },
            { item: '月度上网电量', value: '186,000 MWh' }
          ]
        },
        {
          title: '发电量构成',
          data: [
            { item: '市场化交易电量', value: '150,000 MWh' },
            { item: '保障性收购电量', value: '36,000 MWh' }
          ]
        },
        {
          title: '电费结算明细',
          data: [
            { item: '市场化交易电费', value: '7,500,000 元' },
            { item: '保障性收购电费', value: '1,800,000 元' },
            { item: '新能源补贴', value: '2,790,000 元' },
            { item: '总电费', value: '12,090,000 元' }
          ]
        }
      ]
    },
    {
      id: 'sample-3',
      name: '售电公司月度结算单',
      description: '售电公司月度结算单样例',
      sampleType: '售电公司',
      period: '2025年1月1日至2025年1月31日',
      keyInfo: {
        '结算单编号': 'JX-RETAIL-2025-01-001',
        '公司名称': '江西某售电有限公司',
        '出具日期': '2025年2月8日'
      },
      sections: [
        {
          title: '基本信息',
          data: [
            { item: '代理用户数量', value: '50 户' },
            { item: '结算月天数', value: '31天' },
            { item: '总代理用电量', value: '500,000 MWh' }
          ]
        },
        {
          title: '购电成本',
          data: [
            { item: '批发市场购电成本', value: '22,500,000 元' },
            { item: '输配电费', value: '5,000,000 元' },
            { item: '政府性基金及附加', value: '1,000,000 元' }
          ]
        },
        {
          title: '售电收入',
          data: [
            { item: '零售用户电费收入', value: '29,000,000 元' },
            { item: '利润总额', value: '500,000 元' }
          ]
        }
      ]
    }
  ];
  
  // 交互式步骤
  const interactiveSteps = [
    {
      id: 'interactive-1',
      title: '数据采集',
      description: '收集电量、交易和辅助服务数据',
      action: '点击按钮开始数据采集流程',
      result: '成功采集所有结算所需数据'
    },
    {
      id: 'interactive-2',
      title: '费用计算',
      description: '计算各项电费与服务费',
      action: '选择计算项目并执行计算',
      result: '完成所有费用计算'
    },
    {
      id: 'interactive-3',
      title: '结算单生成',
      description: '生成电费结算单',
      action: '生成并预览结算单',
      result: '成功生成电费结算单'
    },
    {
      id: 'interactive-4',
      title: '结算确认',
      description: '确认并完成电费结算',
      action: '确认结算单并执行资金清算',
      result: '电费结算完成'
    }
  ];
  
  // 结算单相关状态
  const [showSettlementSamples, setShowSettlementSamples] = useState(false);
  const [selectedSample, setSelectedSample] = useState<SettlementSample | null>(null);
  
  // 获取所有步骤，按顺序排序
  const allSteps = settlementStages.flatMap(stage => stage.steps).sort((a, b) => a.sequence - b.sequence);
  
  // 获取当前步骤
  const currentStep = allSteps.find(step => step.id === activeStep) || allSteps[0];
  
  // 完成当前交互步骤
  const completeInteractiveStep = () => {
    if (currentInteractiveStep < interactiveSteps.length - 1) {
      setTimeout(() => {
        setCurrentInteractiveStep(prev => prev + 1);
      }, 1000);
    }
  };
  
  // 重置交互模式
  const resetInteractiveMode = () => {
    setCurrentInteractiveStep(0);
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center mb-4">6-1 结算流程模拟器</h2>
      
      {/* 模拟器说明 */}
      <Card className="mb-6">
        <h3 className="text-lg font-semibold mb-4">模拟器说明</h3>
        <p className="text-gray-600 mb-4">
          本模拟器用于展示电力市场交易的电费结算流程，包括数据采集、费用计算和电费结算三个主要阶段。
          您可以通过点击流程步骤查看详细信息，或切换到交互式模式亲身体验结算流程。
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
          <Button 
            variant="secondary"
            onClick={() => setShowSettlementSamples(true)}
          >
            查看结算单样例
          </Button>
        </div>
      </Card>
      
      {/* 结算单样例模态框 */}
      {showSettlementSamples && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">江西电力市场结算单样例集</h3>
                <Button 
                  variant="secondary"
                  onClick={() => {
                    setShowSettlementSamples(false);
                    setSelectedSample(null);
                  }}
                >
                  关闭
                </Button>
              </div>
              
              {!selectedSample ? (
                /* 结算单样例列表 */
                <div className="space-y-4">
                  <p className="text-gray-600 mb-4">
                    江西电力市场采用"日清月结"的结算模式，以下是不同类型市场主体的结算单样例：
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {settlementSamples.map((sample) => (
                      <motion.div
                        key={sample.id}
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                        className="cursor-pointer"
                        onClick={() => setSelectedSample(sample)}
                      >
                        <Card className="h-full p-4">
                          <h4 className="font-semibold mb-2">{sample.name}</h4>
                          <div className="text-sm text-gray-500 mb-3">{sample.description}</div>
                          <div className="space-y-2">
                            {Object.entries(sample.keyInfo).map(([key, value]) => (
                              <div key={key} className="flex justify-between text-sm">
                                <span className="text-gray-600">{key}：</span>
                                <span className="font-medium">{value}</span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-3">
                            <Button variant="primary" size="small" fullWidth>
                              查看详情
                            </Button>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : (
                /* 结算单样例详情 */
                <div className="space-y-6">
                  <div>
                    <Button 
                      variant="secondary"
                      onClick={() => setSelectedSample(null)}
                      className="mb-4"
                    >
                      返回列表
                    </Button>
                    
                    <div className="border-b border-gray-200 pb-4">
                      <h4 className="text-xl font-semibold mb-2">{selectedSample.name}</h4>
                      <div className="text-sm text-gray-500 mb-3">{selectedSample.description}</div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        {Object.entries(selectedSample.keyInfo).map(([key, value]) => (
                          <div key={key}>
                            <div className="text-gray-500">{key}：</div>
                            <div className="font-medium">{value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {selectedSample.sections.map((section, index) => (
                      <div key={index}>
                        <h5 className="text-lg font-semibold mb-3">{section.title}</h5>
                        <div className="overflow-x-auto">
                          <table className="min-w-full bg-white border border-gray-200">
                            <thead>
                              <tr className="bg-gray-50">
                                <th className="border border-gray-200 px-4 py-2 text-left">项目</th>
                                <th className="border border-gray-200 px-4 py-2 text-right">数值</th>
                              </tr>
                            </thead>
                            <tbody>
                              {section.data.map((item, idx) => (
                                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                  <td className="border border-gray-200 px-4 py-2">{item.item}</td>
                                  <td className="border border-gray-200 px-4 py-2 text-right">{item.value}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                    
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <h5 className="font-medium mb-2">结算单说明</h5>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                        <li>江西电力市场采用"日清月结"的结算模式</li>
                        <li>每月第8个工作日前发布月度正式结算依据</li>
                        <li>每月第10个工作日前电网企业发行电费账单</li>
                        <li>结算单包含电量、电价、电费等详细信息</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* 流程展示模式 */}
      {!showInteractiveMode && (
        <div className="space-y-8">
          {/* 结算流程总览 */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-center">结算流程总览</h3>
            
            {/* 流程阶段展示 */}
            <div className="relative">
              {/* 连接线 */}
              <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-200 transform -translate-x-1/2"></div>
              
              {/* 阶段卡片 */}
              <div className="space-y-16">
                {settlementStages.map((stage) => (
                  <div key={stage.id} className="relative">
                    {/* 阶段标题 */}
                    <div className="flex items-center justify-center mb-8">
                      <div className="bg-white px-6 py-3 rounded-full shadow-md">
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
                                <div className="text-xs text-gray-500 mb-3">
                                  涉及主体：{step.involvedParties.join('、')}
                                </div>
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
                  <p className="text-gray-600 mb-4">{currentStep.description}</p>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h5 className="font-medium text-sm text-gray-700 mb-2">涉及主体</h5>
                    <div className="flex flex-wrap gap-2">
                      {currentStep.involvedParties.map((party, index) => (
                        <span key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">
                          {party}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h5 className="font-medium text-blue-700 mb-3">详细说明</h5>
                  <p className="text-gray-700 mb-6">{currentStep.detailedDescription}</p>
                  
                  {/* 导航按钮 */}
                  <div className="flex justify-between">
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
            <h3 className="text-xl font-semibold mb-4 text-center">交互式结算流程体验</h3>
            <p className="text-gray-600 text-center mb-6">
              请按照提示完成以下结算流程步骤，体验完整的电费结算过程
            </p>
            
            {/* 进度条 */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm text-gray-500">
                  步骤 {currentInteractiveStep + 1} / {interactiveSteps.length}
                </div>
                <div className="text-sm text-gray-500">
                  完成度: {Math.round(((currentInteractiveStep + 1) / interactiveSteps.length) * 100)}%
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-green-500 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${((currentInteractiveStep + 1) / interactiveSteps.length) * 100}%` }}
                ></div>
              </div>
            </div>
            
            {/* 步骤指示器 */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {interactiveSteps.map((step, index) => (
                <div 
                  key={step.id}
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium ${index <= currentInteractiveStep ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  {index <= currentInteractiveStep ? '✓' : index + 1}
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
                <p className="text-gray-600 text-center mb-6">{interactiveSteps[currentInteractiveStep].description}</p>
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
                
                {/* 操作按钮 */}
                <div className="flex justify-center mt-6">
                  <Button 
                    variant="primary"
                    size="large"
                    onClick={completeInteractiveStep}
                    className="min-w-[200px]"
                    disabled={currentInteractiveStep === interactiveSteps.length - 1}
                  >
                    执行此操作
                  </Button>
                </div>
              </Card>
            </motion.div>
            
            {/* 完成提示 */}
            {currentInteractiveStep === interactiveSteps.length - 1 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mt-8 bg-green-50 p-6 rounded-lg text-center"
              >
                <h4 className="text-xl font-semibold text-green-700 mb-2">🎉 恭喜您完成了结算流程体验！</h4>
                <p className="text-gray-600 mb-6">
                  通过这个交互式体验，您已经了解了电费结算的完整流程，包括数据采集、费用计算、结算单生成和电费结算等关键环节。
                </p>
                <Button 
                  variant="primary"
                  size="large"
                  onClick={resetInteractiveMode}
                  className="min-w-[200px]"
                >
                  重新体验
                </Button>
              </motion.div>
            )}
            
            {/* 重置按钮 */}
            <div className="flex justify-center mt-4">
              <Button 
                variant="secondary"
                onClick={resetInteractiveMode}
                className="min-w-[200px]"
              >
                重置流程
              </Button>
            </div>
          </Card>
        </div>
      )}
      
      {/* 结算流程说明 */}
      <Card className="mb-6">
        <h3 className="text-lg font-semibold mb-4">结算流程说明</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-medium text-blue-700">流程特点</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>结算流程分为数据采集、费用计算和电费结算三个阶段</li>
              <li>涉及电网企业、交易机构、结算机构等多个主体</li>
              <li>结算周期通常为月度，部分交易品种可能有不同的结算周期</li>
              <li>结算数据具有权威性和不可篡改性</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-medium text-blue-700">注意事项</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>市场主体应及时核对结算数据，如有异议需在规定时间内提出</li>
              <li>结算完成后，资金将在规定时间内划转</li>
              <li>结算单是财务处理和审计的重要依据，需妥善保管</li>
              <li>不同交易品种的结算规则可能存在差异</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SettlementProcessSimulator;