import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import Card from '../components/Card';

interface TimePeriod {
  id: number;
  time: string;
  type: 'peak' | 'valley' | 'flat' | 'sharp_peak' | 'deep_valley';
  typeName: string;
  description: string;
}

interface Question {
  id: number;
  time: string;
  options: string[];
  correctAnswer: string;
}

const TimePeriodRecognitionGame: React.FC = () => {
  // 游戏状态
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  // 时段数据
  const timePeriods: TimePeriod[] = [
    { id: 1, time: '00:00-01:00', type: 'deep_valley', typeName: '深谷段', description: '深夜用电低谷期' },
    { id: 2, time: '01:00-02:00', type: 'deep_valley', typeName: '深谷段', description: '深夜用电低谷期' },
    { id: 3, time: '02:00-03:00', type: 'deep_valley', typeName: '深谷段', description: '深夜用电低谷期' },
    { id: 4, time: '03:00-04:00', type: 'deep_valley', typeName: '深谷段', description: '深夜用电低谷期' },
    { id: 5, time: '04:00-05:00', type: 'valley', typeName: '谷段', description: '凌晨用电低谷期' },
    { id: 6, time: '05:00-06:00', type: 'valley', typeName: '谷段', description: '凌晨用电低谷期' },
    { id: 7, time: '06:00-07:00', type: 'valley', typeName: '谷段', description: '清晨用电低谷期' },
    { id: 8, time: '07:00-08:00', type: 'flat', typeName: '平段', description: '早间用电平期' },
    { id: 9, time: '08:00-09:00', type: 'peak', typeName: '峰段', description: '上午用电高峰期' },
    { id: 10, time: '09:00-10:00', type: 'peak', typeName: '峰段', description: '上午用电高峰期' },
    { id: 11, time: '10:00-11:00', type: 'peak', typeName: '峰段', description: '上午用电高峰期' },
    { id: 12, time: '11:00-12:00', type: 'sharp_peak', typeName: '尖峰段', description: '午间用电尖峰期' },
    { id: 13, time: '12:00-13:00', type: 'sharp_peak', typeName: '尖峰段', description: '午间用电尖峰期' },
    { id: 14, time: '13:00-14:00', type: 'peak', typeName: '峰段', description: '下午用电高峰期' },
    { id: 15, time: '14:00-15:00', type: 'peak', typeName: '峰段', description: '下午用电高峰期' },
    { id: 16, time: '15:00-16:00', type: 'peak', typeName: '峰段', description: '下午用电高峰期' },
    { id: 17, time: '16:00-17:00', type: 'sharp_peak', typeName: '尖峰段', description: '傍晚用电尖峰期' },
    { id: 18, time: '17:00-18:00', type: 'sharp_peak', typeName: '尖峰段', description: '傍晚用电尖峰期' },
    { id: 19, time: '18:00-19:00', type: 'peak', typeName: '峰段', description: '晚间用电高峰期' },
    { id: 20, time: '19:00-20:00', type: 'peak', typeName: '峰段', description: '晚间用电高峰期' },
    { id: 21, time: '20:00-21:00', type: 'peak', typeName: '峰段', description: '晚间用电高峰期' },
    { id: 22, time: '21:00-22:00', type: 'flat', typeName: '平段', description: '夜间用电平期' },
    { id: 23, time: '22:00-23:00', type: 'valley', typeName: '谷段', description: '夜间用电低谷期' },
    { id: 24, time: '23:00-24:00', type: 'deep_valley', typeName: '深谷段', description: '深夜用电低谷期' },
    // 第二天时段（共48个时段，此处简化为24个，实际应按规则细化）
  ];
  
  // 时段类型选项
  const periodTypes = [
    { value: 'peak', label: '峰段' },
    { value: 'valley', label: '谷段' },
    { value: 'flat', label: '平段' },
    { value: 'sharp_peak', label: '尖峰段' },
    { value: 'deep_valley', label: '深谷段' },
  ];
  
  // 生成题目
  const generateQuestions = (): Question[] => {
    const questions: Question[] = [];
    
    // 生成48个时段的识别题目
    timePeriods.forEach((period, index) => {
      // 生成选项
      const options = [...new Set([
        period.typeName,
        ...periodTypes.filter(t => t.label !== period.typeName)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map(t => t.label)
      ])].sort(() => Math.random() - 0.5);
      
      questions.push({
        id: index + 1,
        time: period.time,
        options: options,
        correctAnswer: period.typeName
      });
    });
    
    return questions.sort(() => Math.random() - 0.5).slice(0, 10); // 随机选择10道题目
  };
  
  const [questions, setQuestions] = useState<Question[]>([]);
  
  // 开始游戏
  const handleStartGame = () => {
    setQuestions(generateQuestions());
    setGameStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsCompleted(false);
    setIsChecking(false);
  };
  
  // 选择答案
  const handleSelectAnswer = (answer: string) => {
    if (isChecking) return;
    setSelectedAnswer(answer);
  };
  
  // 检查答案
  const handleCheckAnswer = () => {
    if (!selectedAnswer) return;
    
    setIsChecking(true);
    
    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(prev => prev + 10);
    }
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setIsChecking(false);
      } else {
        setIsCompleted(true);
        setIsChecking(false);
      }
    }, 1500);
  };
  
  // 重置游戏
  const handleResetGame = () => {
    setGameStarted(false);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsCompleted(false);
    setIsChecking(false);
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center mb-4">4-1 时段识别游戏</h2>
      
      {!gameStarted ? (
        <div className="max-w-2xl mx-auto text-center py-12">
          <h3 className="text-2xl font-semibold mb-4">欢迎参加时段识别游戏！</h3>
          <p className="text-gray-600 mb-8">
            在这个游戏中，你需要识别不同时间段所属的用电类型（峰段、谷段、平段、尖峰段、深谷段）。
            电力市场将一天分为48个时段，合理区分时段类型对交易决策至关重要。
          </p>
          <Button variant="primary" onClick={handleStartGame} size="large">
            开始游戏
          </Button>
        </div>
      ) : isCompleted ? (
        <div className="max-w-2xl mx-auto text-center py-12">
          <h3 className="text-2xl font-bold mb-2">游戏完成！</h3>
          <p className="text-gray-600 mb-6">
            恭喜你完成了时段识别游戏！
          </p>
          <div className="mb-8">
            <div className="text-4xl font-bold text-blue-600 mb-2">{score}</div>
            <div className="text-gray-600">得分 / {questions.length * 10}</div>
          </div>
          <div className={`inline-block px-6 py-3 rounded-full text-lg font-medium mb-6 ${score === questions.length * 10 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
            {score === questions.length * 10 ? '🎉 全部正确！' : '继续加油！'}
          </div>
          <div className="space-y-4">
            <Button variant="primary" onClick={handleStartGame}>
              重新开始
            </Button>
            <Button variant="secondary" onClick={handleResetGame}>
              退出游戏
            </Button>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
          {/* 游戏进度 */}
          <Card className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-gray-500">
                题目 {currentQuestion + 1} / {questions.length}
              </div>
              <div className="text-sm text-gray-500">
                得分：{score}
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </Card>
          
          {/* 当前题目 */}
          <Card className="mb-6">
            <h3 className="text-xl font-semibold mb-6 text-center">
              {questions[currentQuestion].time} 属于哪个时段类型？
            </h3>
            
            {/* 选项列表 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {questions[currentQuestion].options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={!isChecking ? { scale: 1.02 } : {}}
                  whileTap={!isChecking ? { scale: 0.98 } : {}}
                  onClick={() => handleSelectAnswer(option)}
                  className={`p-4 rounded-lg text-left transition-all duration-200 ${selectedAnswer === option ? 'border-2 border-yellow-500 bg-yellow-50' : 'border border-gray-200 bg-white hover:bg-gray-50'} ${isChecking ? (option === questions[currentQuestion].correctAnswer ? 'border-2 border-green-500 bg-green-50' : option === selectedAnswer ? 'border-2 border-red-500 bg-red-50' : 'opacity-70') : ''}`}
                  disabled={isChecking}
                >
                  <div className="text-lg font-medium">{option}</div>
                </motion.button>
              ))}
            </div>
            
            {/* 检查答案按钮 */}
            <div className="flex justify-center">
              <Button 
                variant="primary" 
                onClick={handleCheckAnswer}
                disabled={!selectedAnswer || isChecking}
                size="large"
              >
                {isChecking ? '检查中...' : '确认答案'}
              </Button>
            </div>
            
            {/* 答案解析 */}
            {isChecking && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-6 p-4 bg-blue-50 rounded-lg"
              >
                <h4 className="font-medium text-blue-800 mb-2">解析：</h4>
                <p className="text-gray-700">
                  {questions[currentQuestion].time} 属于 <strong>{questions[currentQuestion].correctAnswer}</strong>。
                  {selectedAnswer === questions[currentQuestion].correctAnswer ? ' 回答正确！' : ' 回答错误，继续加油！'}
                </p>
              </motion.div>
            )}
          </Card>
          
          {/* 时段类型说明 */}
          <Card className="mb-6">
            <h3 className="text-lg font-semibold mb-4">时段类型说明：</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              {periodTypes.map((type, index) => (
                <div key={index} className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${index === 0 ? 'bg-red-500' : index === 1 ? 'bg-green-500' : index === 2 ? 'bg-yellow-500' : index === 3 ? 'bg-orange-500' : 'bg-blue-500'}`}></div>
                  <div>
                    <span className="font-medium">{type.label}：</span>
                    <span className="text-gray-600">
                      {type.value === 'peak' ? '用电高峰期，价格较高' : 
                       type.value === 'valley' ? '用电低谷期，价格较低' : 
                       type.value === 'flat' ? '用电平期，价格适中' : 
                       type.value === 'sharp_peak' ? '用电尖峰期，价格最高' : 
                       '用电深谷期，价格最低'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          
          {/* 游戏控制 */}
          <div className="flex justify-center space-x-4">
            <Button variant="secondary" onClick={handleResetGame}>
              退出游戏
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimePeriodRecognitionGame;