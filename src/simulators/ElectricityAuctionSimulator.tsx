import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import Card from '../components/Card';

interface AuctionOffer {
  id: string;
  type: 'buy' | 'sell';
  price: number;
  quantity: number;
  remainingQuantity: number;
  startTime: number;
  duration: number;
  status: 'active' | 'completed' | 'expired';
  bidder: string;
}

interface Transaction {
  id: string;
  buyerId: string;
  sellerId: string;
  price: number;
  quantity: number;
  time: number;
}

interface PlayerState {
  balance: number;
  inventory: number;
}

const ElectricityAuctionSimulator: React.FC = () => {
  // 模式选择
  const [mode, setMode] = useState<'single' | 'double'>('single');
  
  // 玩家状态
  const [player, setPlayer] = useState<PlayerState>({
    balance: 100000, // 初始资金
    inventory: 0     // 持电量
  });
  
  // 拍卖行报价
  const [auctionOffers, setAuctionOffers] = useState<AuctionOffer[]>([]);
  
  // 交易记录
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  // 新增报价
  const [newOffer, setNewOffer] = useState<{
    type: 'buy' | 'sell';
    price: number;
    quantity: number;
    duration: number;
  }>({
    type: 'sell',
    price: 0.35,
    quantity: 100,
    duration: 30
  });
  
  // 计时器
  const [time, setTime] = useState<number>(0);
  
  // 定时更新报价状态
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prev => prev + 1);
      
      // 更新报价状态
      setAuctionOffers(prev => prev.map(offer => {
        const elapsed = Math.floor((Date.now() - offer.startTime) / 1000);
        if (elapsed >= offer.duration) {
          return { ...offer, status: 'expired' };
        }
        return offer;
      }));
      
      // 生成随机AI报价
      if (Math.random() < 0.05) {
        generateAiOffer();
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // 生成AI报价
  const generateAiOffer = () => {
    const types: ('buy' | 'sell')[] = ['buy', 'sell'];
    const type = types[Math.floor(Math.random() * types.length)];
    const basePrice = 0.35;
    const priceVariation = (Math.random() - 0.5) * 0.1;
    
    const newAiOffer: AuctionOffer = {
      id: `ai-${Date.now()}`,
      type,
      price: Math.round((basePrice + priceVariation) * 1000) / 1000,
      quantity: Math.floor(Math.random() * 200) + 50,
      remainingQuantity: Math.floor(Math.random() * 200) + 50,
      startTime: Date.now(),
      duration: Math.floor(Math.random() * 30) + 30,
      status: 'active',
      bidder: `AI-${Math.floor(Math.random() * 100)}`
    };
    
    setAuctionOffers(prev => [...prev, newAiOffer]);
  };
  
  // 添加新报价
  const handleAddOffer = () => {
    const newAuctionOffer: AuctionOffer = {
      id: `player-${Date.now()}`,
      type: newOffer.type,
      price: newOffer.price,
      quantity: newOffer.quantity,
      remainingQuantity: newOffer.quantity,
      startTime: Date.now(),
      duration: newOffer.duration,
      status: 'active',
      bidder: 'Player'
    };
    
    setAuctionOffers(prev => [...prev, newAuctionOffer]);
    
    // 重置表单
    setNewOffer(prev => ({
      ...prev,
      quantity: 100
    }));
  };
  
  // 摘牌操作
  const handleAcceptOffer = (offer: AuctionOffer) => {
    if (offer.status !== 'active' || offer.remainingQuantity <= 0) return;
    
    // 确定交易数量（全部或部分）
    const transactionQuantity = Math.min(offer.remainingQuantity, 100);
    const totalPrice = offer.price * transactionQuantity;
    
    // 检查玩家资金/库存
    if (offer.type === 'buy') {
      // 玩家作为卖家，需要有足够的库存
      if (player.inventory < transactionQuantity) {
        alert('库存不足！');
        return;
      }
    } else {
      // 玩家作为买家，需要有足够的资金
      if (player.balance < totalPrice) {
        alert('资金不足！');
        return;
      }
    }
    
    // 更新报价剩余数量
    const updatedOffers = auctionOffers.map(o => {
      if (o.id === offer.id) {
        const newRemaining = o.remainingQuantity - transactionQuantity;
        return {
          ...o,
          remainingQuantity: newRemaining,
          status: newRemaining <= 0 ? 'completed' as const : 'active' as const
        };
      }
      return o;
    });
    
    // 更新玩家状态
    let updatedPlayer = { ...player };
    if (offer.type === 'buy') {
      // 玩家卖出电力
      updatedPlayer.inventory -= transactionQuantity;
      updatedPlayer.balance += totalPrice;
    } else {
      // 玩家买入电力
      updatedPlayer.inventory += transactionQuantity;
      updatedPlayer.balance -= totalPrice;
    }
    
    // 记录交易
    const newTransaction: Transaction = {
      id: `tx-${Date.now()}`,
      buyerId: offer.type === 'buy' ? offer.bidder : 'Player',
      sellerId: offer.type === 'sell' ? offer.bidder : 'Player',
      price: offer.price,
      quantity: transactionQuantity,
      time: Date.now()
    };
    
    setAuctionOffers(updatedOffers);
    setPlayer(updatedPlayer);
    setTransactions(prev => [newTransaction, ...prev]);
  };
  
  // 重置游戏
  const resetGame = () => {
    setAuctionOffers([]);
    setTransactions([]);
    setPlayer({
      balance: 100000,
      inventory: 0
    });
    setTime(0);
  };
  
  // 获取活跃报价
  const activeOffers = auctionOffers.filter(offer => offer.status === 'active');
  
  // 获取卖出报价（按价格从低到高排序）
  const sellOffers = activeOffers
    .filter(offer => offer.type === 'sell')
    .sort((a, b) => a.price - b.price);
  
  // 获取买入报价（按价格从高到低排序）
  const buyOffers = activeOffers
    .filter(offer => offer.type === 'buy')
    .sort((a, b) => b.price - a.price);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">电力拍卖行模拟器</h2>
        <p className="text-gray-600">
          体验挂牌交易机制，可选择单向挂牌或双向挂牌模式
        </p>
      </div>
      
      {/* 模式选择 */}
      <div className="flex gap-4 justify-center mb-6">
        <Button
          variant={mode === 'single' ? 'primary' : 'secondary'}
          onClick={() => setMode('single')}
        >
          单向挂牌
        </Button>
        <Button
          variant={mode === 'double' ? 'primary' : 'secondary'}
          onClick={() => setMode('double')}
        >
          双向挂牌
        </Button>
      </div>
      
      {/* 玩家状态 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card title="玩家状态" className="bg-blue-50">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500">资金</div>
              <div className="text-xl font-bold">¥{player.balance.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">持电量</div>
              <div className="text-xl font-bold">{player.inventory} MWh</div>
            </div>
          </div>
        </Card>
        <Card title="当前时间" className="bg-green-50">
          <div className="text-center">
            <div className="text-sm text-gray-500">模拟时间</div>
            <div className="text-2xl font-bold">{time} 秒</div>
          </div>
        </Card>
        <Card title="活跃报价" className="bg-yellow-50">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500">买入报价</div>
              <div className="text-xl font-bold">{buyOffers.length} 条</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">卖出报价</div>
              <div className="text-xl font-bold">{sellOffers.length} 条</div>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 卖出报价区 */}
        <Card title="卖出报价（价格从低到高）" className="h-full">
          <div className="space-y-4">
            <div className="max-h-80 overflow-y-auto space-y-3">
              {sellOffers.length > 0 ? (
                sellOffers.map(offer => {
                  const elapsed = Math.floor((Date.now() - offer.startTime) / 1000);
                  const remainingTime = Math.max(0, offer.duration - elapsed);
                  
                  return (
                    <motion.div 
                      key={offer.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-red-50 p-3 rounded-lg border border-red-200"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="text-sm font-medium">
                            {offer.bidder} 的卖出报价
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {offer.id.substring(0, 8)}...
                          </div>
                        </div>
                        <div className="text-xs font-medium px-2 py-1 rounded-full bg-red-100 text-red-800">
                          剩余 {remainingTime}s
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                        <div>
                          <div className="text-gray-500">价格</div>
                          <div className="font-bold text-red-700">
                            {offer.price.toFixed(3)} 元/kWh
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500">电量</div>
                          <div className="font-bold">
                            {offer.remainingQuantity} / {offer.quantity} MWh
                          </div>
                        </div>
                        <div className="flex items-end">
                          <Button 
                            variant="primary" 
                            size="small" 
                            onClick={() => handleAcceptOffer(offer)}
                            disabled={offer.remainingQuantity <= 0}
                          >
                            立即购买
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="text-center py-4 text-gray-500">
                  暂无卖出报价
                </div>
              )}
            </div>
          </div>
        </Card>
        
        {/* 买入报价区 */}
        <Card title="买入报价（价格从高到低）" className="h-full">
          <div className="space-y-4">
            <div className="max-h-80 overflow-y-auto space-y-3">
              {buyOffers.length > 0 ? (
                buyOffers.map(offer => {
                  const elapsed = Math.floor((Date.now() - offer.startTime) / 1000);
                  const remainingTime = Math.max(0, offer.duration - elapsed);
                  
                  return (
                    <motion.div 
                      key={offer.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-blue-50 p-3 rounded-lg border border-blue-200"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="text-sm font-medium">
                            {offer.bidder} 的买入报价
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {offer.id.substring(0, 8)}...
                          </div>
                        </div>
                        <div className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                          剩余 {remainingTime}s
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                        <div>
                          <div className="text-gray-500">价格</div>
                          <div className="font-bold text-blue-700">
                            {offer.price.toFixed(3)} 元/kWh
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500">电量</div>
                          <div className="font-bold">
                            {offer.remainingQuantity} / {offer.quantity} MWh
                          </div>
                        </div>
                        <div className="flex items-end">
                          <Button 
                            variant="primary" 
                            size="small" 
                            onClick={() => handleAcceptOffer(offer)}
                            disabled={offer.remainingQuantity <= 0}
                          >
                            立即卖出
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="text-center py-4 text-gray-500">
                  暂无买入报价
                </div>
              )}
            </div>
          </div>
        </Card>
        
        {/* 我的报价区 */}
        <Card title="我的报价" className="h-full">
          <div className="space-y-4">
            {/* 玩家状态 */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm font-medium mb-2">我的状态</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="text-gray-500">可用资金</div>
                  <div className="font-bold">¥{player.balance.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-gray-500">可用电量</div>
                  <div className="font-bold">{player.inventory} MWh</div>
                </div>
              </div>
            </div>
            
            {/* 添加报价 */}
            <div>
              <h4 className="font-medium mb-3">发布新报价</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">报价类型</label>
                  <select
                    value={newOffer.type}
                    onChange={(e) => setNewOffer({ ...newOffer, type: e.target.value as 'buy' | 'sell' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="sell">卖出</option>
                    <option value="buy">买入</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">价格 (元/kWh)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.2"
                    max="0.5"
                    value={newOffer.price}
                    onChange={(e) => setNewOffer({ ...newOffer, price: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">电量 (MWh)</label>
                  <input
                    type="number"
                    step="50"
                    min="50"
                    max="500"
                    value={newOffer.quantity}
                    onChange={(e) => setNewOffer({ ...newOffer, quantity: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">持续时间 (秒)</label>
                  <input
                    type="number"
                    step="10"
                    min="10"
                    max="120"
                    value={newOffer.duration}
                    onChange={(e) => setNewOffer({ ...newOffer, duration: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <Button variant="primary" onClick={handleAddOffer}>
                  发布报价
                </Button>
              </div>
            </div>
            
            {/* 操作按钮 */}
            <div className="flex gap-3">
              <Button variant="secondary" onClick={resetGame} className="flex-1">
                重置游戏
              </Button>
            </div>
          </div>
        </Card>
      </div>
      
      {/* 交易记录 */}
      <Card title="交易记录" className="h-full">
        <div className="space-y-4">
          <div className="max-h-60 overflow-y-auto space-y-3">
            {transactions.length > 0 ? (
              transactions.map((transaction, index) => (
                <div key={index} className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm font-medium">
                      交易 #{transactions.length - index}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(transaction.time).toLocaleTimeString()}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm">
                    <div>
                      <div className="text-gray-500">买家</div>
                      <div className="font-medium">{transaction.buyerId}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">卖家</div>
                      <div className="font-medium">{transaction.sellerId}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">价格</div>
                      <div className="font-bold text-green-700">
                        {transaction.price.toFixed(3)} 元/kWh
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500">电量</div>
                      <div className="font-bold">{transaction.quantity} MWh</div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                暂无交易记录
              </div>
            )}
          </div>
        </div>
      </Card>
      
      {/* 规则说明 */}
      <Card title="规则说明">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm space-y-2">
            <div className="font-medium">挂牌交易核心规则：</div>
            <div>• 单向挂牌：一方挂牌，另一方摘牌，成交价为挂牌价</div>
            <div>• 双向挂牌：双方随时挂牌和摘牌，电量摘完即止</div>
            <div>• 报价有效期：玩家可设置报价持续时间，超时自动失效</div>
            <div>• 价格优先：买入报价按价格从高到低排序，卖出报价按价格从低到高排序</div>
            <div>• 数量限制：每次摘牌可购买/卖出部分或全部电量</div>
            <div className="mt-3 font-medium">游戏目标：</div>
            <div>• 通过低买高卖赚取利润</div>
            <div>• 合理设置报价价格和有效期</div>
            <div>• 关注市场动态，及时调整策略</div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ElectricityAuctionSimulator;