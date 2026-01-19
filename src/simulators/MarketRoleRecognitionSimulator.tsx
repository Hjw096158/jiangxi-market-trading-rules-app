import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import Card from '../components/Card';

interface RoleItem {
  id: string;
  name: string;
  description: string;
  type: 'seller' | 'buyer' | 'operator' | 'new';
}

const MarketRoleRecognitionSimulator: React.FC = () => {
  // 游戏状态
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  
  // 角色数据
  const roles: RoleItem[] = [
    {
      id: 'seller-1',
      name: '发电企业',
      description: '通过电力市场销售电力，获取收益',
      type: 'seller'
    },
    {
      id: 'buyer-1',
      name: '售电公司',
      description: '从电力市场购买电力，转售给终端用户',
      type: 'buyer'
    },
    {
      id: 'buyer-2',
      name: '电力用户',
      description: '直接从电力市场购买电力用于自身消费',
      type: 'buyer'
    },
    {
      id: 'new-1',
      name: '新型经营主体',
      description: '包括储能、虚拟电厂、负荷聚合商等',
      type: 'new'
    },
    {
      id: 'operator-1',
      name: '电网企业',
      description: '负责电力输配和交易平台运营，不参与市场竞争',
      type: 'operator'
    }
  ];
  
  // 题目数据
  const questions = [
    {
      question: '以下哪类主体不属于经营主体？',
      options: ['发电企业', '售电公司', '电网企业', '电力用户'],
      correctAnswer: 2
    },
    {
      question: '以下哪类主体属于新型经营主体？',
      options: ['发电企业', '售电公司', '虚拟电厂', '电网企业'],
      correctAnswer: 2
    },
    {
      question: '以下哪类主体只能作为买方参与市场？',
      options: ['发电企业', '售电公司', '电力用户', '储能企业'],
      correctAnswer: 2
    }
  ];
  
  // 处理答案
  const handleAnswer = (selected: number) => {
    if (selected === questions[currentQuestion].correctAnswer) {
      setScore(prev => prev + 1);
    }
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };
  
  // 重置游戏
  const handleReset = () => {
    setCurrentQuestion(0);
    setScore(0);
    setIsCompleted(false);
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center mb-4">1-1 市场角色认知闯关</h2>
      
      {/* 角色介绍卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {roles.map(role => (
          <motion.div
            key={role.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="h-full">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">{role.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{role.description}</p>
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${role.type === 'seller' ? 'bg-green-100 text-green-800' : role.type === 'buyer' ? 'bg-blue-100 text-blue-800' : role.type === 'operator' ? 'bg-gray-100 text-gray-800' : 'bg-purple-100 text-purple-800'}`}>
                  {role.type === 'seller' ? '售电侧' : role.type === 'buyer' ? '购电侧' : role.type === 'operator' ? '运营方' : '新型主体'}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
      
      {/* 题目练习 */}
      <Card>
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold mb-2">角色认知练习</h3>
          <p className="text-gray-600">请识别以下描述对应的市场角色</p>
        </div>
        
        {!isCompleted ? (
          <div className="space-y-6">
            <div className="text-center mb-4">
              <div className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-2">
                第 {currentQuestion + 1} / {questions.length} 题
              </div>
              <h4 className="text-lg font-medium">{questions[currentQuestion].question}</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {questions[currentQuestion].options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(index)}
                  className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-all duration-200"
                >
                  {option}
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <h3 className="text-2xl font-bold mb-2">练习完成！</h3>
            <p className="text-gray-600 mb-4">您的得分：{score} / {questions.length}</p>
            <div className={`inline-block px-6 py-3 rounded-full text-lg font-medium mb-6 ${score === questions.length ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
              {score === questions.length ? '🎉 全部正确！' : '继续加油！'}
            </div>
            <Button variant="primary" onClick={handleReset}>
              重新练习
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default MarketRoleRecognitionSimulator;
