import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import Card from '../components/Card';

interface TestScenario {
  id: number;
  name: string;
  description: string;
  requirements: string[];
  companyInfo: {
    name: string;
    type: string;
    capacity?: number;
    voltageLevel?: number;
    annualConsumption?: number;
    asset?: number;
  };
  isEligible: boolean;
  reason: string;
}

const RegistrationQualificationTestSimulator: React.FC = () => {
  // 游戏状态
  const [currentScenario, setCurrentScenario] = useState(0);
  const [userAnswer, setUserAnswer] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  
  // 自测场景
  const scenarios: TestScenario[] = [
    {
      id: 1,
      name: '发电企业注册',
      description: '测试发电企业是否符合市场准入条件',
      requirements: [
        '单台机组容量6兆瓦及以上',
        '取得电力业务许可证',
        '完成市场注册',
        '签订并网协议',
        '完成涉网安全性评价'
      ],
      companyInfo: {
        name: '阳光发电有限公司',
        type: '燃煤发电',
        capacity: 100
      },
      isEligible: true,
      reason: '公司单台机组容量100MW，满足6MW及以上的要求，且已取得相关资质'
    },
    {
      id: 2,
      name: '售电公司注册',
      description: '测试售电公司是否符合市场准入条件',
      requirements: [
        '资产总额不低于2000万元人民币',
        '具有与售电规模相适应的专职人员',
        '具备必要的信息系统',
        '具备电力交易平台账户'
      ],
      companyInfo: {
        name: '绿色售电有限公司',
        type: '售电公司',
        asset: 1500
      },
      isEligible: false,
      reason: '公司资产总额1500万元，低于2000万元的准入门槛'
    },
    {
      id: 3,
      name: '批发用户注册',
      description: '测试批发用户是否符合市场准入条件',
      requirements: [
        '接入电压等级110千伏及以上',
        '年用电量不低于5000万千瓦时'
      ],
      companyInfo: {
        name: '星光工业有限公司',
        type: '工业用户',
        voltageLevel: 110,
        annualConsumption: 4800
      },
      isEligible: false,
      reason: '公司年用电量4800万千瓦时，低于5000万千瓦时的准入门槛'
    },
    {
      id: 4,
      name: '新型主体注册',
      description: '测试新型经营主体是否符合市场准入条件',
      requirements: [
        '具备独立计量装置',
        '准入条件和交易规则参照类似经营主体执行',
        '可以同时作为发电侧和用电侧参与市场'
      ],
      companyInfo: {
        name: '智能储能有限公司',
        type: '储能企业'
      },
      isEligible: true,
      reason: '公司具备独立计量装置，符合新型经营主体的准入条件'
    }
  ];
  
  // 处理用户答案
  const handleAnswer = (answer: boolean) => {
    setUserAnswer(answer);
    
    if (answer === scenarios[currentScenario].isEligible) {
      setScore(prev => prev + 1);
    }
    
    // 延迟进入下一题
    setTimeout(() => {
      if (currentScenario < scenarios.length - 1) {
        setCurrentScenario(prev => prev + 1);
        setUserAnswer(null);
      } else {
        setIsCompleted(true);
      }
    }, 1500);
  };
  
  // 重置游戏
  const handleReset = () => {
    setCurrentScenario(0);
    setUserAnswer(null);
    setScore(0);
    setIsCompleted(false);
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center mb-4">1-2 注册资格自测系统</h2>
      
      {/* 准入条件说明 */}
      <Card>
        <h3 className="text-xl font-semibold mb-4">市场准入条件说明</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2">发电企业：</h4>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>单台机组容量6兆瓦及以上</li>
              <li>取得电力业务许可证</li>
              <li>完成市场注册</li>
              <li>签订并网协议</li>
              <li>完成涉网安全性评价</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">售电公司：</h4>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>资产总额不低于2000万元人民币</li>
              <li>具有与售电规模相适应的专职人员</li>
              <li>具备必要的信息系统</li>
              <li>具备电力交易平台账户</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">批发用户：</h4>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>接入电压等级110千伏及以上</li>
              <li>年用电量不低于5000万千瓦时</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">新型经营主体：</h4>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>包括储能、虚拟电厂、负荷聚合商等</li>
              <li>具备独立计量装置</li>
              <li>准入条件参照类似经营主体</li>
            </ul>
          </div>
        </div>
      </Card>
      
      {/* 自测场景 */}
      <Card>
        {!isCompleted ? (
          <div className="space-y-6">
            <div className="text-center mb-4">
              <div className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-2">
                场景 {currentScenario + 1} / {scenarios.length}
              </div>
              <h3 className="text-xl font-semibold">{scenarios[currentScenario].name}</h3>
              <p className="text-gray-600 mt-2">{scenarios[currentScenario].description}</p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">公司信息：</h4>
              <div className="space-y-1">
                <p><strong>公司名称：</strong>{scenarios[currentScenario].companyInfo.name}</p>
                <p><strong>公司类型：</strong>{scenarios[currentScenario].companyInfo.type}</p>
                {scenarios[currentScenario].companyInfo.capacity && (
                  <p><strong>机组容量：</strong>{scenarios[currentScenario].companyInfo.capacity} MW</p>
                )}
                {scenarios[currentScenario].companyInfo.voltageLevel && (
                  <p><strong>接入电压等级：</strong>{scenarios[currentScenario].companyInfo.voltageLevel} kV</p>
                )}
                {scenarios[currentScenario].companyInfo.annualConsumption && (
                  <p><strong>年用电量：</strong>{scenarios[currentScenario].companyInfo.annualConsumption} 万千瓦时</p>
                )}
                {scenarios[currentScenario].companyInfo.asset && (
                  <p><strong>资产总额：</strong>{scenarios[currentScenario].companyInfo.asset} 万元</p>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">准入条件：</h4>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                {scenarios[currentScenario].requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswer(true)}
                className="p-4 bg-green-100 text-green-800 rounded-lg font-medium hover:bg-green-200 transition-all duration-200"
                disabled={userAnswer !== null}
              >
                符合条件
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswer(false)}
                className="p-4 bg-red-100 text-red-800 rounded-lg font-medium hover:bg-red-200 transition-all duration-200"
                disabled={userAnswer !== null}
              >
                不符合条件
              </motion.button>
            </div>
            
            {userAnswer !== null && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`p-4 rounded-lg ${userAnswer === scenarios[currentScenario].isEligible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
              >
                <h4 className="font-medium mb-2">
                  {userAnswer === scenarios[currentScenario].isEligible ? '回答正确！' : '回答错误！'}
                </h4>
                <p><strong>正确结论：</strong>{scenarios[currentScenario].isEligible ? '符合条件' : '不符合条件'}</p>
                <p><strong>原因：</strong>{scenarios[currentScenario].reason}</p>
              </motion.div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <h3 className="text-2xl font-bold mb-2">自测完成！</h3>
            <p className="text-gray-600 mb-4">您的得分：{score} / {scenarios.length}</p>
            <div className={`inline-block px-6 py-3 rounded-full text-lg font-medium mb-6 ${score === scenarios.length ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
              {score === scenarios.length ? '🎉 全部正确！' : '继续加油！'}
            </div>
            <Button variant="primary" onClick={handleReset}>
              重新自测
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default RegistrationQualificationTestSimulator;
