import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import Card from '../components/Card';

interface NegotiationState {
  round: number;
  playerOffer: { price: number; quantity: number };
  aiOffer: { price: number; quantity: number };
  aiCounterOffer: { price: number; quantity: number };
  negotiationHistory: Array<{
    round: number;
    player: { price: number; quantity: number };
    ai: { price: number; quantity: number };
  }>;
  result: 'ongoing' | 'success' | 'failure';
  score: number;
}

const BilateralNegotiationSimulator: React.FC = () => {
  // 玩家角色和目标
  const [playerRole, setPlayerRole] = useState<'seller' | 'buyer'>('seller');
  const [targetPrice, setTargetPrice] = useState<number>(0.36); // 玩家期望价格
  const [targetQuantity, setTargetQuantity] = useState<number>(1000); // 期望电量
  const [bottomPrice, setBottomPrice] = useState<number>(0.34); // 底线价格
  
  // 谈判状态
  const [negotiation, setNegotiation] = useState<NegotiationState>({
    round: 1,
    playerOffer: { price: 0.36, quantity: 1000 },
    aiOffer: { price: 0.35, quantity: 800 },
    aiCounterOffer: { price: 0.35, quantity: 800 },
    negotiationHistory: [],
    result: 'ongoing',
    score: 0
  });
  
  // 玩家输入
  const [playerPrice, setPlayerPrice] = useState<number>(0.36);
  const [playerQuantity, setPlayerQuantity] = useState<number>(1000);
  
  // 初始化AI报价
  useEffect(() => {
    // 根据玩家角色初始化AI报价
    if (playerRole === 'seller') {
      setNegotiation(prev => ({
        ...prev,
        aiOffer: { price: 0.35, quantity: 800 },
        aiCounterOffer: { price: 0.35, quantity: 800 }
      }));
      setTargetPrice(0.36);
      setBottomPrice(0.34);
      setPlayerPrice(0.36);
    } else {
      setNegotiation(prev => ({
        ...prev,
        aiOffer: { price: 0.37, quantity: 900 },
        aiCounterOffer: { price: 0.37, quantity: 900 }
      }));
      setTargetPrice(0.35);
      setBottomPrice(0.33);
      setPlayerPrice(0.35);
    }
  }, [playerRole]);
  
  // 生成AI还价策略
  const generateAiCounterOffer = (playerOffer: { price: number; quantity: number }) => {
    const currentAiOffer = negotiation.aiCounterOffer;
    const newAiOffer = { ...currentAiOffer };
    
    // 价格调整逻辑
    if (playerRole === 'seller') {
      // AI是买家，希望价格越低越好
      if (playerOffer.price <= currentAiOffer.price + 0.005) {
        // 玩家降价，AI适当提高报价
        newAiOffer.price = Math.min(
          currentAiOffer.price + 0.005,
          0.365 // AI最高接受价格
        );
      } else {
        // 玩家涨价，AI可能维持原价或小幅提高
        newAiOffer.price = currentAiOffer.price + 0.002;
      }
      
      // 电量调整逻辑
      if (playerOffer.quantity >= currentAiOffer.quantity + 50) {
        // 玩家增加电量，AI适当增加需求
        newAiOffer.quantity = Math.min(
          currentAiOffer.quantity + 50,
          1000 // AI最大需求
        );
      }
    } else {
      // AI是卖家，希望价格越高越好
      if (playerOffer.price >= currentAiOffer.price - 0.005) {
        // 玩家涨价，AI适当降低报价
        newAiOffer.price = Math.max(
          currentAiOffer.price - 0.005,
          0.335 // AI最低接受价格
        );
      } else {
        // 玩家降价，AI可能维持原价或小幅降低
        newAiOffer.price = currentAiOffer.price - 0.002;
      }
      
      // 电量调整逻辑
      if (playerOffer.quantity <= currentAiOffer.quantity - 50) {
        // 玩家减少需求，AI适当减少供应
        newAiOffer.quantity = Math.max(
          currentAiOffer.quantity - 50,
          800 // AI最小供应
        );
      }
    }
    
    return newAiOffer;
  };
  
  // 提交还价
  const handleCounterOffer = () => {
    if (negotiation.result !== 'ongoing') return;
    
    const playerOffer = { price: playerPrice, quantity: playerQuantity };
    const aiCounterOffer = generateAiCounterOffer(playerOffer);
    
    const newRound = negotiation.round + 1;
    const newHistory = [...negotiation.negotiationHistory, {
      round: negotiation.round,
      player: playerOffer,
      ai: negotiation.aiCounterOffer
    }];
    
    // 检查谈判是否成功
    let result: 'ongoing' | 'success' | 'failure' = 'ongoing';
    let score = negotiation.score;
    
    if (playerRole === 'seller') {
      // 卖家角度：价格 >= 期望价格且电量 >= 期望电量
      if (aiCounterOffer.price >= targetPrice && aiCounterOffer.quantity >= targetQuantity) {
        result = 'success';
        score += 50 + 30; // 基础分 + 超额完成分
        if (negotiation.round <= 3) score += 20; // 快速成交奖励
      } 
      // 价格 >= 底线价格且电量 >= 目标电量的80%
      else if (aiCounterOffer.price >= bottomPrice && aiCounterOffer.quantity >= targetQuantity * 0.8) {
        result = 'success';
        score += 50;
        if (negotiation.round <= 3) score += 20;
      }
    } else {
      // 买家角度：价格 <= 期望价格且电量 >= 期望电量
      if (aiCounterOffer.price <= targetPrice && aiCounterOffer.quantity >= targetQuantity) {
        result = 'success';
        score += 50 + 30;
        if (negotiation.round <= 3) score += 20;
      } 
      // 价格 <= 底线价格且电量 >= 目标电量的80%
      else if (aiCounterOffer.price <= bottomPrice && aiCounterOffer.quantity >= targetQuantity * 0.8) {
        result = 'success';
        score += 50;
        if (negotiation.round <= 3) score += 20;
      }
    }
    
    // 检查谈判是否破裂（超过5轮）
    if (newRound > 5 && result === 'ongoing') {
      result = 'failure';
      score = 0;
    }
    
    setNegotiation(prev => ({
      ...prev,
      round: newRound,
      playerOffer,
      aiCounterOffer,
      negotiationHistory: newHistory,
      result,
      score
    }));
  };
  
  // 接受报价
  const handleAcceptOffer = () => {
    if (negotiation.result !== 'ongoing') return;
    
    let score = 0;
    
    if (playerRole === 'seller') {
      // 卖家接受AI报价
      if (negotiation.aiCounterOffer.price >= targetPrice && negotiation.aiCounterOffer.quantity >= targetQuantity) {
        score = 50 + 30;
      } else if (negotiation.aiCounterOffer.price >= bottomPrice && negotiation.aiCounterOffer.quantity >= targetQuantity * 0.8) {
        score = 50;
      }
    } else {
      // 买家接受AI报价
      if (negotiation.aiCounterOffer.price <= targetPrice && negotiation.aiCounterOffer.quantity >= targetQuantity) {
        score = 50 + 30;
      } else if (negotiation.aiCounterOffer.price <= bottomPrice && negotiation.aiCounterOffer.quantity >= targetQuantity * 0.8) {
        score = 50;
      }
    }
    
    if (negotiation.round <= 3) score += 20;
    
    setNegotiation(prev => ({
      ...prev,
      result: 'success',
      score
    }));
  };
  
  // 拒绝报价
  const handleRejectOffer = () => {
    if (negotiation.result !== 'ongoing') return;
    
    setNegotiation(prev => ({
      ...prev,
      result: 'failure',
      score: 0
    }));
  };
  
  // 重置谈判
  const resetNegotiation = () => {
    const initialState: NegotiationState = {
      round: 1,
      playerOffer: { price: targetPrice, quantity: targetQuantity },
      aiOffer: playerRole === 'seller' ? { price: 0.35, quantity: 800 } : { price: 0.37, quantity: 900 },
      aiCounterOffer: playerRole === 'seller' ? { price: 0.35, quantity: 800 } : { price: 0.37, quantity: 900 },
      negotiationHistory: [],
      result: 'ongoing',
      score: 0
    };
    
    setNegotiation(initialState);
    setPlayerPrice(targetPrice);
    setPlayerQuantity(targetQuantity);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">双边协商谈判模拟器</h2>
        <p className="text-gray-600">
          与AI对手进行电力交易谈判，达成最优交易条件
        </p>
      </div>
      
      {/* 角色选择 */}
      <div className="flex gap-4 justify-center mb-6">
        <Button
          variant={playerRole === 'seller' ? 'primary' : 'secondary'}
          onClick={() => {
            setPlayerRole('seller');
            setTargetPrice(0.36);
            setBottomPrice(0.34);
            setTargetQuantity(1000);
            resetNegotiation();
          }}
        >
          发电企业（卖家）
        </Button>
        <Button
          variant={playerRole === 'buyer' ? 'primary' : 'secondary'}
          onClick={() => {
            setPlayerRole('buyer');
            setTargetPrice(0.35);
            setBottomPrice(0.33);
            setTargetQuantity(1000);
            resetNegotiation();
          }}
        >
          售电公司（买家）
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 谈判目标和角色信息 */}
        <Card title="谈判目标" className="lg:col-span-1">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">你的角色：</h4>
              <p className="text-sm text-gray-600">
                {playerRole === 'seller' ? '300MW燃煤电厂交易经理' : '某售电公司采购经理'}
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">谈判目标：</h4>
              <div className="space-y-1 text-sm">
                <p>• 期望价格：{playerRole === 'seller' ? '≥' : '≤'} {targetPrice.toFixed(3)} 元/kWh</p>
                <p>• 期望电量：{targetQuantity} MWh</p>
                <p>• 底线价格：{playerRole === 'seller' ? '≥' : '≤'} {bottomPrice.toFixed(3)} 元/kWh</p>
              </div>
            </div>
            
            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="font-medium text-blue-700 mb-2">💡 谈判提示</h4>
              <ul className="text-sm text-blue-600 space-y-1">
                <li>• 对方偏好稳定供应，适当调整策略</li>
                <li>• 最多5轮谈判，超时视为失败</li>
                <li>• 快速达成协议有额外奖励</li>
                <li>• 价格和电量都很重要</li>
              </ul>
            </div>
          </div>
        </Card>
        
        {/* 谈判桌 */}
        <Card title={`谈判桌 - 第 ${negotiation.round} 轮`} className="lg:col-span-2">
          <div className="space-y-6">
            {/* 对手报价 */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-3">对手报价：</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">价格</p>
                  <p className="text-xl font-bold">{negotiation.aiCounterOffer.price.toFixed(3)} 元/kWh</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">电量</p>
                  <p className="text-xl font-bold">{negotiation.aiCounterOffer.quantity} MWh</p>
                </div>
              </div>
              
              {/* 响应按钮 */}
              {negotiation.result === 'ongoing' && (
                <div className="flex gap-3 mt-4">
                  <Button variant="primary" onClick={handleAcceptOffer}>
                    接受
                  </Button>
                  <Button variant="secondary" onClick={handleCounterOffer}>
                    还价
                  </Button>
                  <Button variant="danger" onClick={handleRejectOffer}>
                    拒绝
                  </Button>
                </div>
              )}
            </div>
            
            {/* 还价区域 */}
            {negotiation.result === 'ongoing' && (
              <div>
                <h4 className="font-medium mb-3">你的还价：</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">价格 (元/kWh)</label>
                    <input
                      type="number"
                      step="0.001"
                      min="0.30"
                      max="0.40"
                      value={playerPrice}
                      onChange={(e) => setPlayerPrice(parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">电量 (MWh)</label>
                    <input
                      type="number"
                      step="50"
                      min="500"
                      max="1500"
                      value={playerQuantity}
                      onChange={(e) => setPlayerQuantity(parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* 谈判结果 */}
            {negotiation.result !== 'ongoing' && (
              <div className={`p-4 rounded-lg ${negotiation.result === 'success' ? 'bg-green-50' : 'bg-red-50'}`}>
                <h4 className={`font-medium mb-2 ${negotiation.result === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                  {negotiation.result === 'success' ? '🎉 谈判成功！' : '❌ 谈判失败'}
                </h4>
                <p className="text-sm mb-3">
                  {negotiation.result === 'success' 
                    ? '恭喜你达成了交易！' 
                    : '很遗憾，未能达成一致。'}
                </p>
                <div className="mb-4">
                  <p className="font-medium">最终评分：</p>
                  <p className="text-xl font-bold">{negotiation.score} 分</p>
                </div>
                <Button variant="primary" onClick={resetNegotiation}>
                  重新开始
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
      
      {/* 谈判历史 */}
      {negotiation.negotiationHistory.length > 0 && (
        <Card title="谈判历史">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left font-medium">轮次</th>
                  <th className="px-4 py-2 text-left font-medium">你的报价</th>
                  <th className="px-4 py-2 text-left font-medium">对手报价</th>
                </tr>
              </thead>
              <tbody>
                {negotiation.negotiationHistory.map((item) => (
                  <tr key={item.round} className="border-b">
                    <td className="px-4 py-3">第 {item.round} 轮</td>
                    <td className="px-4 py-3">
                      {item.player.price.toFixed(3)} 元/kWh × {item.player.quantity} MWh
                    </td>
                    <td className="px-4 py-3">
                      {item.ai.price.toFixed(3)} 元/kWh × {item.ai.quantity} MWh
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </motion.div>
  );
};

export default BilateralNegotiationSimulator;