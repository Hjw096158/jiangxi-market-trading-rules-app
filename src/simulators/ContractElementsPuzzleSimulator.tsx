import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/Button';
import Card from '../components/Card';

interface PuzzleElement {
  id: number;
  text: string;
  correctPosition: string;
}

interface Position {
  id: string;
  name: string;
  description: string;
}

interface DraggedElement {
  id: number;
  text: string;
}

const ContractElementsPuzzleSimulator: React.FC = () => {
  const [elements] = useState<PuzzleElement[]>([
    { id: 1, text: '合同双方', correctPosition: 'position-1' },
    { id: 2, text: '交易电量', correctPosition: 'position-2' },
    { id: 3, text: '交易价格', correctPosition: 'position-3' },
    { id: 4, text: '交易时段', correctPosition: 'position-4' },
    { id: 5, text: '结算方式', correctPosition: 'position-5' },
    { id: 6, text: '违约责任', correctPosition: 'position-6' },
    { id: 7, text: '争议解决', correctPosition: 'position-7' },
    { id: 8, text: '合同期限', correctPosition: 'position-8' },
  ]);

  const [positions] = useState<Position[]>([
    { id: 'position-1', name: '合同双方', description: '交易的买方和卖方' },
    { id: 'position-2', name: '交易电量', description: '约定的交易电量规模' },
    { id: 'position-3', name: '交易价格', description: '约定的交易价格水平' },
    { id: 'position-4', name: '交易时段', description: '交易的时间范围' },
    { id: 'position-5', name: '结算方式', description: '电量和电费的结算方法' },
    { id: 'position-6', name: '违约责任', description: '违反合同的责任承担' },
    { id: 'position-7', name: '争议解决', description: '争议的处理方式' },
    { id: 'position-8', name: '合同期限', description: '合同的有效期限' },
  ]);

  const [shuffledElements, setShuffledElements] = useState<PuzzleElement[]>([]);
  const [placedElements, setPlacedElements] = useState<Record<string, PuzzleElement | null>>({});
  const [draggedElement, setDraggedElement] = useState<DraggedElement | null>(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);

  // 初始化游戏
  useEffect(() => {
    // 打乱元素顺序
    const shuffled = [...elements].sort(() => Math.random() - 0.5);
    setShuffledElements(shuffled);
    
    // 初始化放置位置为空
    const initialPlaced: Record<string, PuzzleElement | null> = {};
    positions.forEach(pos => {
      initialPlaced[pos.id] = null;
    });
    setPlacedElements(initialPlaced);
  }, []);

  // 开始拖拽
  const handleDragStart = (element: PuzzleElement) => {
    setDraggedElement({ id: element.id, text: element.text });
  };

  // 结束拖拽
  const handleDragEnd = () => {
    setDraggedElement(null);
  };

  // 拖拽进入目标区域
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // 放置元素
  const handleDrop = (positionId: string) => {
    if (!draggedElement) return;
    
    const element = elements.find(el => el.id === draggedElement.id);
    if (!element) return;
    
    setAttempts(prev => prev + 1);
    
    // 检查是否已经放置了元素
    const currentElement = placedElements[positionId];
    if (currentElement) {
      // 如果已经有元素，将其放回可拖拽区域
      setShuffledElements(prev => [...prev, currentElement]);
    }
    
    // 检查是否放置在正确位置
    const isCorrect = element.correctPosition === positionId;
    
    if (isCorrect) {
      setScore(prev => prev + 15);
    }
    
    // 更新放置位置
    setPlacedElements(prev => ({
      ...prev,
      [positionId]: element
    }));
    
    // 从可拖拽区域移除元素
    setShuffledElements(prev => prev.filter(el => el.id !== draggedElement.id));
  };

  // 移除已放置的元素
  const removeElement = (positionId: string) => {
    const element = placedElements[positionId];
    if (element) {
      // 将元素放回可拖拽区域
      setShuffledElements(prev => [...prev, element]);
      
      // 清空放置位置
      setPlacedElements(prev => ({
        ...prev,
        [positionId]: null
      }));
    }
  };

  // 检查游戏是否完成
  useEffect(() => {
    const allCorrect = Object.entries(placedElements).every(([positionId, element]) => {
      if (!element) return false;
      return element.correctPosition === positionId;
    });
    
    const allPlaced = Object.values(placedElements).every(element => element !== null);
    
    if (allPlaced && allCorrect) {
      setGameCompleted(true);
    }
  }, [placedElements]);

  // 重置游戏
  const resetGame = () => {
    // 打乱元素顺序
    const shuffled = [...elements].sort(() => Math.random() - 0.5);
    setShuffledElements(shuffled);
    
    // 清空放置位置
    const initialPlaced: Record<string, PuzzleElement | null> = {};
    positions.forEach(pos => {
      initialPlaced[pos.id] = null;
    });
    setPlacedElements(initialPlaced);
    
    setScore(0);
    setAttempts(0);
    setGameCompleted(false);
  };

  // 判断元素是否放置在正确位置
  const isElementCorrect = (positionId: string, element: PuzzleElement | null) => {
    if (!element) return false;
    return element.correctPosition === positionId;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-blue-800 mb-2">合同要素拼图游戏</h1>
        <p className="text-gray-600">将下方的合同要素拖拽到上方正确的位置上</p>
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
            已放置: <span className="text-blue-600">{Object.values(placedElements).filter(el => el !== null).length}/{elements.length}</span>
          </div>
        </div>
        <Button onClick={resetGame} variant="secondary">
          重新开始
        </Button>
      </div>

      {/* 拼图区域 */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold text-center text-blue-700 mb-6">合同要素位置</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {positions.map(position => (
            <motion.div
              key={position.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: positions.indexOf(position) * 0.1 }}
              className="relative"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(position.id)}
            >
              <Card 
                className={`p-6 h-32 border-2 transition-all duration-300 ${
                  placedElements[position.id] 
                    ? isElementCorrect(position.id, placedElements[position.id])
                      ? 'border-green-500 bg-green-50' 
                      : 'border-red-500 bg-red-50'
                    : 'border-dashed border-gray-300 bg-gray-50 hover:border-blue-400'
                }`}
              >
                <div className="h-full flex flex-col">
                  <h3 className="text-sm font-semibold text-blue-600 mb-1">{position.name}</h3>
                  <p className="text-xs text-gray-500 mb-3">{position.description}</p>
                  
                  <AnimatePresence>
                    {placedElements[position.id] && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-auto"
                      >
                        <div className="flex items-center justify-between">
                          <div className={`font-medium text-sm ${
                            isElementCorrect(position.id, placedElements[position.id])
                              ? 'text-green-700' 
                              : 'text-red-700'
                          }`}>
                            {placedElements[position.id]?.text}
                          </div>
                          <button
                            onClick={() => removeElement(position.id)}
                            className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            ✕
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 可拖拽元素区域 */}
      <div>
        <h2 className="text-xl font-semibold text-center text-blue-700 mb-6">合同要素</h2>
        <div className="flex flex-wrap gap-4 justify-center">
          <AnimatePresence>
            {shuffledElements.map((element) => (
              <motion.div
                key={element.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                draggable
                onDragStart={() => handleDragStart(element)}
                onDragEnd={handleDragEnd}
                className="cursor-grab active:cursor-grabbing"
              >
                <Card 
                  className="p-4 min-w-[120px] text-center"
                >
                  <div className="font-medium">{element.text}</div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
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
                <p className="text-lg">正确率: <span className="font-semibold">{(elements.length / attempts * 100).toFixed(1)}%</span></p>
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

export default ContractElementsPuzzleSimulator;