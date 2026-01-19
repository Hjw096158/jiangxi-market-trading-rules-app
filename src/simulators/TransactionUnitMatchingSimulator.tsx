import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/Button';
import Card from '../components/Card';

interface MatchPair {
  id: number;
  left: string;
  right: string;
}

interface SelectedCard {
  side: 'left' | 'right';
  id: number;
  value: string;
}

const TransactionUnitMatchingSimulator: React.FC = () => {
  const [pairs] = useState<MatchPair[]>([
    { id: 1, left: '火力发电厂', right: '火电交易单元' },
    { id: 2, left: '风力发电厂', right: '风电交易单元' },
    { id: 3, left: '光伏发电站', right: '光伏交易单元' },
    { id: 4, left: '水电厂', right: '水电交易单元' },
    { id: 5, left: '大工业用户', right: '大工业交易单元' },
    { id: 6, left: '一般工商业用户', right: '一般工商业交易单元' },
  ]);

  const [shuffledLeft, setShuffledLeft] = useState<string[]>([]);
  const [shuffledRight, setShuffledRight] = useState<string[]>([]);
  const [selectedCards, setSelectedCards] = useState<SelectedCard[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<Set<number>>(new Set());
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);

  // 初始化游戏，打乱卡片顺序
  useEffect(() => {
    const leftCards = [...pairs.map(pair => pair.left)];
    const rightCards = [...pairs.map(pair => pair.right)];
    
    // Fisher-Yates洗牌算法
    const shuffleArray = (array: string[]) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };
    
    setShuffledLeft(shuffleArray(leftCards));
    setShuffledRight(shuffleArray(rightCards));
  }, []);

  // 选择卡片
  const handleCardSelect = (side: 'left' | 'right', index: number, value: string) => {
    if (gameCompleted) return;
    
    const existingIndex = selectedCards.findIndex(card => card.side === side);
    let newSelectedCards;
    
    if (existingIndex >= 0) {
      // 替换同一侧已选择的卡片
      newSelectedCards = [...selectedCards];
      newSelectedCards[existingIndex] = { side, id: index, value };
    } else {
      // 添加新选择的卡片
      newSelectedCards = [...selectedCards, { side, id: index, value }];
    }
    
    setSelectedCards(newSelectedCards);
    
    // 如果两侧都已选择卡片，检查是否匹配
    if (newSelectedCards.length === 2) {
      checkMatch(newSelectedCards);
    }
  };

  // 检查匹配
  const checkMatch = (cards: SelectedCard[]) => {
    const [card1, card2] = cards;
    setAttempts(prev => prev + 1);
    
    // 找到对应的配对
    const isMatch = pairs.some(pair => 
      (pair.left === card1.value && pair.right === card2.value) ||
      (pair.left === card2.value && pair.right === card1.value)
    );
    
    if (isMatch) {
      // 匹配成功
      setScore(prev => prev + 10);
      
      // 找到匹配的id
      const matchedPair = pairs.find(pair => 
        (pair.left === card1.value && pair.right === card2.value) ||
        (pair.left === card2.value && pair.right === card1.value)
      );
      
      if (matchedPair) {
        setMatchedPairs(prev => new Set(prev).add(matchedPair.id));
      }
      
      // 清空选择
      setSelectedCards([]);
    } else {
      // 匹配失败，延迟后清空选择
      setTimeout(() => {
        setSelectedCards([]);
      }, 1000);
    }
  };

  // 检查游戏是否完成
  useEffect(() => {
    if (matchedPairs.size === pairs.length) {
      setGameCompleted(true);
    }
  }, [matchedPairs, pairs.length]);

  // 重置游戏
  const resetGame = () => {
    setSelectedCards([]);
    setMatchedPairs(new Set());
    setScore(0);
    setAttempts(0);
    setGameCompleted(false);
    
    // 重新洗牌
    const leftCards = [...pairs.map(pair => pair.left)];
    const rightCards = [...pairs.map(pair => pair.right)];
    
    const shuffleArray = (array: string[]) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };
    
    setShuffledLeft(shuffleArray(leftCards));
    setShuffledRight(shuffleArray(rightCards));
  };

  // 判断卡片是否已匹配
  const isCardMatched = (side: 'left' | 'right', value: string) => {
    return pairs.some(pair => 
      matchedPairs.has(pair.id) && 
      (side === 'left' ? pair.left === value : pair.right === value)
    );
  };

  // 判断卡片是否已选择
  const isCardSelected = (side: 'left' | 'right', index: number) => {
    return selectedCards.some(card => card.side === side && card.id === index);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-blue-800 mb-2">交易单元配对游戏</h1>
        <p className="text-gray-600">将左侧的市场主体与右侧的交易单元进行正确配对</p>
      </motion.div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-6">
          <div className="text-lg font-semibold">
            得分: <span className="text-green-600">{score}</span>
          </div>
          <div className="text-lg font-semibold">
            尝试次数: <span className="text-orange-600">{attempts}</span>
          </div>
          <div className="text-lg font-semibold">
            已匹配: <span className="text-blue-600">{matchedPairs.size}/{pairs.length}</span>
          </div>
        </div>
        <Button onClick={resetGame} variant="secondary">
          重新开始
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* 左侧卡片 */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-center text-blue-700 mb-4">市场主体</h2>
          {shuffledLeft.map((item, index) => (
            <motion.div
              key={`left-${index}`}
              whileHover={!isCardMatched('left', item) ? { scale: 1.02 } : {}}
              whileTap={!isCardMatched('left', item) ? { scale: 0.98 } : {}}
              onClick={() => !isCardMatched('left', item) && handleCardSelect('left', index, item)}
              className={`cursor-pointer transition-all duration-200 ${isCardMatched('left', item) ? 'opacity-70' : ''}`}
            >
              <Card 
                className={`p-6 h-full ${isCardSelected('left', index) ? 'border-2 border-yellow-500' : ''} ${isCardMatched('left', item) ? 'bg-green-50 border-green-300' : ''}`}
              >
                <div className="text-center text-lg font-medium">{item}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* 右侧卡片 */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-center text-blue-700 mb-4">交易单元</h2>
          {shuffledRight.map((item, index) => (
            <motion.div
              key={`right-${index}`}
              whileHover={!isCardMatched('right', item) ? { scale: 1.02 } : {}}
              whileTap={!isCardMatched('right', item) ? { scale: 0.98 } : {}}
              onClick={() => !isCardMatched('right', item) && handleCardSelect('right', index, item)}
              className={`cursor-pointer transition-all duration-200 ${isCardMatched('right', item) ? 'opacity-70' : ''}`}
            >
              <Card 
                className={`p-6 h-full ${isCardSelected('right', index) ? 'border-2 border-yellow-500' : ''} ${isCardMatched('right', item) ? 'bg-green-50 border-green-300' : ''}`}
              >
                <div className="text-center text-lg font-medium">{item}</div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 匹配线 */}
      <div className="relative -mt-40 mb-40">
        <AnimatePresence>
          {pairs.map(pair => {
            if (matchedPairs.has(pair.id)) {
              const leftIndex = shuffledLeft.indexOf(pair.left);
              const rightIndex = shuffledRight.indexOf(pair.right);
              
              return (
                <motion.div
                  key={`line-${pair.id}`}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="absolute w-full h-full"
                >
                  <svg width="100%" height="100%" className="absolute inset-0">
                    <defs>
                      <marker
                        id="arrowhead"
                        markerWidth="10"
                        markerHeight="10"
                        refX="9"
                        refY="3"
                        orient="auto"
                      >
                        <polygon points="0 0, 10 3, 0 6" fill="#10b981" />
                      </marker>
                    </defs>
                    <line
                      x1="50%"
                      y1={`${20 + leftIndex * 100}px`}
                      x2="50%"
                      y2={`${20 + rightIndex * 100}px`}
                      stroke="#10b981"
                      strokeWidth="3"
                      markerEnd="url(#arrowhead)"
                      strokeDasharray="1000"
                      strokeDashoffset="0"
                    />
                  </svg>
                </motion.div>
              );
            }
            return null;
          })}
        </AnimatePresence>
      </div>

      {/* 游戏完成提示 */}
      <AnimatePresence>
        {gameCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
              <h2 className="text-2xl font-bold text-green-600 mb-4">🎉 游戏完成！</h2>
              <div className="mb-6">
                <p className="text-lg mb-2">最终得分: <span className="font-semibold">{score}</span></p>
                <p className="text-lg mb-2">总尝试次数: <span className="font-semibold">{attempts}</span></p>
                <p className="text-lg">正确率: <span className="font-semibold">{(pairs.length / attempts * 100).toFixed(1)}%</span></p>
              </div>
              <Button onClick={resetGame} variant="primary" size="large">
                再玩一次
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TransactionUnitMatchingSimulator;