import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import Card from '../components/Card';

interface RoleItem {
  id: number;
  name: string;
  description: string;
  rights: string[];
  obligations: string[];
}

interface MatchItem {
  id: number;
  text: string;
  roleId: number;
  type: 'right' | 'obligation';
}

const RoleRightsMatchingSimulator: React.FC = () => {
  // 游戏状态
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  
  // 市场成员角色数据
  const roles: RoleItem[] = [
    {
      id: 1,
      name: '发电企业',
      description: '通过电力市场销售电力，获取收益',
      rights: [
        '参与电力市场交易',
        '自主确定申报价格和电量',
        '获得公平的市场机会',
        '查询市场信息'
      ],
      obligations: [
        '遵守市场规则',
        '按规定申报交易数据',
        '接受市场监管',
        '保障电力供应安全'
      ]
    },
    {
      id: 2,
      name: '售电公司',
      description: '从电力市场购买电力，转售给终端用户',
      rights: [
        '参与电力市场交易',
        '自主确定购售电价格',
        '获得公平的市场机会',
        '查询市场信息'
      ],
      obligations: [
        '遵守市场规则',
        '按规定申报交易数据',
        '保障用户供电可靠性',
        '接受市场监管'
      ]
    },
    {
      id: 3,
      name: '电力用户',
      description: '直接从电力市场购买电力用于自身消费',
      rights: [
        '选择售电主体',
        '参与电力市场交易',
        '获得公平的市场价格',
        '查询市场信息'
      ],
      obligations: [
        '遵守市场规则',
        '按规定缴纳电费',
        '提供准确的用电预测',
        '接受市场监管'
      ]
    },
    {
      id: 4,
      name: '电网企业',
      description: '负责电力输配和交易平台运营，不参与市场竞争',
      rights: [
        '收取输配电费',
        '管理电力交易平台',
        '实施电力调度',
        '获取市场交易数据'
      ],
      obligations: [
        '保障电网安全稳定运行',
        '提供公平的输配电服务',
        '维护交易平台正常运行',
        '披露市场信息'
      ]
    },
    {
      id: 5,
      name: '交易机构',
      description: '负责组织电力市场交易，管理市场主体',
      rights: [
        '制定交易规则',
        '组织市场交易',
        '管理市场主体注册',
        '出具交易结算依据'
      ],
      obligations: [
        '保证交易公平公正',
        '及时披露市场信息',
        '维护交易秩序',
        '接受市场监管'
      ]
    }
  ];
  
  // 匹配题目数据
  const generateQuestions = () => {
    const questions = [];
    
    // 为每个角色生成匹配题目
    for (let role of roles) {
      // 生成权利匹配题目
      const rightItems: MatchItem[] = [
        ...role.rights.map((right, index) => ({
          id: role.id * 100 + index,
          text: right,
          roleId: role.id,
          type: 'right' as const
        })),
        // 添加干扰项
        ...roles.filter(r => r.id !== role.id)
          .flatMap(r => r.rights.slice(0, 2))
          .map((right, index) => ({
            id: role.id * 200 + index,
            text: right,
            roleId: role.id,
            type: 'right' as const
          }))
      ];
      
      // 生成义务匹配题目
      const obligationItems: MatchItem[] = [
        ...role.obligations.map((obligation, index) => ({
          id: role.id * 300 + index,
          text: obligation,
          roleId: role.id,
          type: 'obligation' as const
        })),
        // 添加干扰项
        ...roles.filter(r => r.id !== role.id)
          .flatMap(r => r.obligations.slice(0, 2))
          .map((obligation, index) => ({
            id: role.id * 400 + index,
            text: obligation,
            roleId: role.id,
            type: 'obligation' as const
          }))
      ];
      
      questions.push({
        id: role.id,
        role: role,
        type: 'right',
        items: rightItems.sort(() => Math.random() - 0.5),
        correctAnswers: role.rights.map((_, index) => role.id * 100 + index)
      });
      
      questions.push({
        id: role.id + 10,
        role: role,
        type: 'obligation',
        items: obligationItems.sort(() => Math.random() - 0.5),
        correctAnswers: role.obligations.map((_, index) => role.id * 300 + index)
      });
    }
    
    return questions;
  };
  
  const [questions, setQuestions] = useState(generateQuestions());
  
  // 开始游戏
  const handleStartGame = () => {
    setGameStarted(true);
    setQuestions(generateQuestions());
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswers([]);
    setIsCompleted(false);
  };
  
  // 选择答案
  const handleSelectAnswer = (itemId: number) => {
    setSelectedAnswers(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };
  
  // 检查答案
  const handleCheckAnswer = () => {
    setIsChecking(true);
    
    const correctAnswers = questions[currentQuestion].correctAnswers;
    const isCorrect = correctAnswers.every(id => selectedAnswers.includes(id)) && 
                     selectedAnswers.every(id => correctAnswers.includes(id));
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswers([]);
        setIsChecking(false);
      } else {
        setIsCompleted(true);
        setIsChecking(false);
      }
    }, 1500);
  };
  
  // 重置游戏
  const handleReset = () => {
    setGameStarted(false);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswers([]);
    setIsCompleted(false);
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center mb-4">2-3 角色权责匹配游戏</h2>
      
      {!gameStarted ? (
        <div className="max-w-2xl mx-auto text-center py-12">
          <h3 className="text-2xl font-semibold mb-4">欢迎参加角色权责匹配游戏！</h3>
          <p className="text-gray-600 mb-8">
            在这个游戏中，你需要为不同的市场成员匹配正确的权利和义务。
            每个角色有不同的权利和义务，选择正确的选项来获得分数。
          </p>
          <Button variant="primary" onClick={handleStartGame} size="large">
            开始游戏
          </Button>
        </div>
      ) : isCompleted ? (
        <div className="max-w-2xl mx-auto text-center py-12">
          <h3 className="text-2xl font-bold mb-2">游戏完成！</h3>
          <p className="text-gray-600 mb-6">
            恭喜你完成了角色权责匹配游戏！
          </p>
          <div className="mb-8">
            <div className="text-4xl font-bold text-blue-600 mb-2">{score}</div>
            <div className="text-gray-600">得分 / {questions.length}</div>
          </div>
          <div className={`inline-block px-6 py-3 rounded-full text-lg font-medium mb-6 ${score === questions.length ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
            {score === questions.length ? '🎉 全部正确！' : '继续加油！'}
          </div>
          <div className="space-y-4">
            <Button variant="primary" onClick={handleStartGame}>
              重新开始
            </Button>
            <Button variant="secondary" onClick={handleReset}>
              退出游戏
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* 游戏进度 */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-xl font-semibold">{questions[currentQuestion].role.name}</h3>
                <p className="text-gray-600">{questions[currentQuestion].role.description}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">
                  题目 {currentQuestion + 1} / {questions.length}
                </div>
                <div className="text-sm text-gray-500">
                  得分：{score}
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="font-medium text-lg">
                请选择{questions[currentQuestion].type === 'right' ? '权利' : '义务'}：
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                （可多选，选择所有正确选项后点击确认）
              </p>
            </div>
            
            {/* 选项列表 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              {questions[currentQuestion].items.map(item => (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectAnswer(item.id)}
                  className={`p-4 border-2 rounded-lg text-left transition-all duration-200 ${selectedAnswers.includes(item.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                  disabled={isChecking}
                >
                  <div className="flex items-start">
                    <div className={`w-5 h-5 rounded-full border-2 mt-1 mr-3 flex-shrink-0 ${selectedAnswers.includes(item.id) ? 'border-blue-500 bg-blue-500 text-white flex items-center justify-center' : 'border-gray-300'}`}>
                      {selectedAnswers.includes(item.id) && '✓'}
                    </div>
                    <div>{item.text}</div>
                  </div>
                </motion.button>
              ))}
            </div>
            
            {/* 检查答案提示 */}
            {isChecking && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-lg text-center font-medium ${selectedAnswers.length === questions[currentQuestion].correctAnswers.length ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
              >
                {selectedAnswers.length === questions[currentQuestion].correctAnswers.length ? '回答正确！' : '回答错误！'}
              </motion.div>
            )}
            
            {/* 操作按钮 */}
            <div className="flex justify-center gap-4 mt-6">
              <Button 
                variant="primary" 
                onClick={handleCheckAnswer}
                disabled={isChecking}
              >
                确认答案
              </Button>
              <Button variant="secondary" onClick={handleReset}>
                退出游戏
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default RoleRightsMatchingSimulator;
