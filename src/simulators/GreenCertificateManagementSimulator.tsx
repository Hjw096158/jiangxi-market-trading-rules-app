import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import Card from '../components/Card';

interface GreenCertificate {
  id: string;
  certificateNumber: string;
  generator: string;
  capacity: number;
  issueDate: string;
  expiryDate: string;
  status: 'issued' | 'used' | 'cancelled' | 'expired';
  renewableType: string;
  projectName: string;
}

interface CertificateStep {
  id: string;
  title: string;
  description: string;
  action: string;
  result: string;
  icon: string;
  color: string;
}

const GreenCertificateManagementSimulator: React.FC = () => {
  // 模拟器状态
  const [activeStep, setActiveStep] = useState<string>('step-1');
  const [showInteractiveMode, setShowInteractiveMode] = useState(false);
  const [currentInteractiveStep, setCurrentInteractiveStep] = useState(0);
  const [certificates, setCertificates] = useState<GreenCertificate[]>([
    {
      id: 'cert-1',
      certificateNumber: 'GC20240001',
      generator: '江西风力发电有限公司',
      capacity: 100,
      issueDate: '2024-01-15',
      expiryDate: '2025-01-14',
      status: 'issued',
      renewableType: '风力发电',
      projectName: '江西鄱阳湖风力发电场'
    },
    {
      id: 'cert-2',
      certificateNumber: 'GC20240002',
      generator: '江西太阳能发电有限公司',
      capacity: 50,
      issueDate: '2024-02-20',
      expiryDate: '2025-02-19',
      status: 'issued',
      renewableType: '太阳能发电',
      projectName: '江西上饶太阳能发电站'
    },
    {
      id: 'cert-3',
      certificateNumber: 'GC20230015',
      generator: '江西水力发电有限公司',
      capacity: 200,
      issueDate: '2023-06-10',
      expiryDate: '2024-06-09',
      status: 'expired',
      renewableType: '水力发电',
      projectName: '江西赣江水电站'
    }
  ]);
  
  // 绿证管理流程步骤
  const certificateSteps: CertificateStep[] = [
    {
      id: 'step-1',
      title: '绿证申领',
      description: '申请绿色电力证书',
      action: '提交绿证申请，包括项目信息、发电量证明等',
      result: '获得绿证电子证书',
      icon: '📋',
      color: 'bg-blue-500'
    },
    {
      id: 'step-2',
      title: '绿证使用',
      description: '使用绿证进行减排证明',
      action: '选择绿证用于碳减排或可再生能源消纳证明',
      result: '绿证状态变为已使用',
      icon: '✅',
      color: 'bg-green-500'
    },
    {
      id: 'step-3',
      title: '绿证转让',
      description: '将绿证转让给其他主体',
      action: '填写转让信息并确认转让',
      result: '绿证所有权转移',
      icon: '🔄',
      color: 'bg-purple-500'
    },
    {
      id: 'step-4',
      title: '绿证注销',
      description: '注销不再需要的绿证',
      action: '提交绿证注销申请',
      result: '绿证状态变为已注销',
      icon: '❌',
      color: 'bg-red-500'
    },
    {
      id: 'step-5',
      title: '过期处理',
      description: '处理过期绿证',
      action: '查看过期绿证并进行相应处理',
      result: '绿证状态更新为已过期',
      icon: '⏰',
      color: 'bg-gray-500'
    }
  ];
  
  // 交互式步骤
  const interactiveSteps = [
    {
      id: 'interactive-1',
      title: '绿证申领',
      description: '为已完成的绿电项目申请绿证',
      action: '提交绿证申请',
      result: '成功获得绿证'
    },
    {
      id: 'interactive-2',
      title: '绿证使用',
      description: '使用绿证证明可再生能源消纳',
      action: '选择要使用的绿证',
      result: '绿证状态更新为已使用'
    },
    {
      id: 'interactive-3',
      title: '绿证注销',
      description: '注销不再需要的绿证',
      action: '提交绿证注销申请',
      result: '绿证状态更新为已注销'
    }
  ];
  
  // 申领新绿证
  const issueNewCertificate = () => {
    const newCert: GreenCertificate = {
      id: `cert-${Date.now()}`,
      certificateNumber: `GC${new Date().getFullYear()}${String(certificates.length + 1).padStart(4, '0')}`,
      generator: '江西新能源发电有限公司',
      capacity: Math.floor(Math.random() * 100) + 50,
      issueDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      status: 'issued',
      renewableType: Math.random() > 0.5 ? '风力发电' : '太阳能发电',
      projectName: '江西新能源发电项目'
    };
    setCertificates([...certificates, newCert]);
  };
  
  // 使用绿证
  const useCertificate = (certId: string) => {
    setCertificates(certificates.map(cert => 
      cert.id === certId ? { ...cert, status: 'used' as const } : cert
    ));
  };
  
  // 注销绿证
  const cancelCertificate = (certId: string) => {
    setCertificates(certificates.map(cert => 
      cert.id === certId ? { ...cert, status: 'cancelled' as const } : cert
    ));
  };
  
  // 完成当前交互步骤
  const completeInteractiveStep = () => {
    if (currentInteractiveStep < interactiveSteps.length) {
      if (currentInteractiveStep === 0) {
        issueNewCertificate();
      } else if (currentInteractiveStep === 1 && certificates.some(cert => cert.status === 'issued')) {
        const issuedCert = certificates.find(cert => cert.status === 'issued');
        if (issuedCert) {
          useCertificate(issuedCert.id);
        }
      } else if (currentInteractiveStep === 2 && certificates.some(cert => cert.status === 'issued')) {
        const issuedCert = certificates.find(cert => cert.status === 'issued');
        if (issuedCert) {
          cancelCertificate(issuedCert.id);
        }
      }
      
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
      <h2 className="text-2xl font-bold text-center mb-4">5-3 绿证管理模拟器</h2>
      
      {/* 模拟器说明 */}
      <Card className="mb-6">
        <h3 className="text-lg font-semibold mb-4">模拟器说明</h3>
        <p className="text-gray-600 mb-4">
          本模拟器用于展示和体验绿色电力证书（绿证）的完整管理流程，包括绿证的申领、使用、转让、注销和过期处理等环节。
          您可以通过点击流程步骤查看详细信息，或切换到交互式模式亲身体验绿证管理流程。
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
          {/* 绿证管理流程 */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-center">绿证管理流程</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {certificateSteps.map((step) => (
                <motion.div
                  key={step.id}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setActiveStep(step.id)}
                  className={`cursor-pointer ${activeStep === step.id ? 'ring-2 ring-blue-500' : ''}`}
                >
                  <Card className="h-full p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className={`w-16 h-16 rounded-full ${step.color} flex items-center justify-center text-white text-2xl mb-4`}>
                        {step.icon}
                      </div>
                      <h4 className="text-lg font-semibold mb-2">{step.title}</h4>
                      <p className="text-gray-600 text-sm mb-4">{step.description}</p>
                      <Button variant="primary" size="small">
                        查看详情
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* 绿证列表 */}
          <div>
            <Card>
              <h3 className="text-lg font-semibold mb-4">绿证列表</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th className="px-6 py-3">证书编号</th>
                      <th className="px-6 py-3">发电企业</th>
                      <th className="px-6 py-3">装机容量(MW)</th>
                      <th className="px-6 py-3"> renewableType</th>
                      <th className="px-6 py-3">颁发日期</th>
                      <th className="px-6 py-3">有效期至</th>
                      <th className="px-6 py-3">状态</th>
                      <th className="px-6 py-3">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {certificates.map((cert) => (
                      <tr key={cert.id} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">{cert.certificateNumber}</td>
                        <td className="px-6 py-4">{cert.generator}</td>
                        <td className="px-6 py-4">{cert.capacity}</td>
                        <td className="px-6 py-4">{cert.renewableType}</td>
                        <td className="px-6 py-4">{cert.issueDate}</td>
                        <td className="px-6 py-4">{cert.expiryDate}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${cert.status === 'issued' ? 'bg-green-100 text-green-800' : cert.status === 'used' ? 'bg-blue-100 text-blue-800' : cert.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {cert.status === 'issued' ? '已颁发' : cert.status === 'used' ? '已使用' : cert.status === 'cancelled' ? '已注销' : '已过期'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            {cert.status === 'issued' && (
                              <>
                                <Button variant="primary" size="small" onClick={() => useCertificate(cert.id)}>
                                  使用
                                </Button>
                                <Button variant="danger" size="small" onClick={() => cancelCertificate(cert.id)}>
                                  注销
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4">
                <Button variant="primary" onClick={issueNewCertificate}>
                  申领新绿证
                </Button>
              </div>
            </Card>
          </div>
          
          {/* 步骤详情 */}
          <div>
            <Card>
              <h3 className="text-lg font-semibold mb-4">步骤详情</h3>
              {(() => {
                const currentStep = certificateSteps.find(step => step.id === activeStep);
                if (currentStep) {
                  return (
                    <div className="space-y-4">
                      <h4 className="text-xl font-semibold">{currentStep.title}</h4>
                      <p className="text-gray-600">{currentStep.description}</p>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h5 className="font-medium text-blue-700 mb-2">操作说明</h5>
                        <p>{currentStep.action}</p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h5 className="font-medium text-blue-700 mb-2">预期结果</h5>
                        <p>{currentStep.result}</p>
                      </div>
                    </div>
                  );
                }
                return null;
              })()}
            </Card>
          </div>
        </div>
      )}
      
      {/* 交互式体验模式 */}
      {showInteractiveMode && (
        <div className="space-y-8">
          <Card className="mb-6">
            <h3 className="text-xl font-semibold mb-4 text-center">交互式绿证管理体验</h3>
            <p className="text-gray-600 text-center mb-6">
              请按照提示完成以下绿证管理步骤，体验完整的绿证生命周期
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
            
            {/* 当前交互步骤 */}
            {currentInteractiveStep < interactiveSteps.length ? (
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
                    >
                      执行此操作
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mt-8 bg-green-50 p-6 rounded-lg text-center"
              >
                <h4 className="text-xl font-semibold text-green-700 mb-2">🎉 恭喜您完成了绿证管理流程体验！</h4>
                <p className="text-gray-600 mb-6">
                  通过这个交互式体验，您已经了解了绿证的完整生命周期，包括申领、使用和注销等关键环节。
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
      
      {/* 绿证管理说明 */}
      <Card className="mb-6">
        <h3 className="text-lg font-semibold mb-4">绿证管理说明</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-medium text-blue-700">绿证特点</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>绿证是可再生能源发电量的法定凭证</li>
              <li>每张绿证对应1兆瓦时可再生能源发电量</li>
              <li>绿证具有唯一编号和有效期</li>
              <li>绿证可用于证明可再生能源消纳责任</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-medium text-blue-700">管理要点</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>绿证应在有效期内使用</li>
              <li>使用后的绿证不能重复使用</li>
              <li>过期绿证自动失效</li>
              <li>绿证注销后无法恢复</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default GreenCertificateManagementSimulator;