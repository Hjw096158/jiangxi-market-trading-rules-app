import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import Card from '../components/Card';

interface Bid {
  id: string;
  type: 'buy' | 'sell';
  price: number;
  quantity: number;
  time: number;
  status: 'pending' | 'matched' | 'unmatched';
}

interface MatchingResult {
  buyBids: Bid[];
  sellBids: Bid[];
  matchedQuantity: number;
  clearingPrice: number;
  timestamp: number;
}

interface PlayerState {
  balance: number;
  inventory: number;
}

const CentralizedMatchingHallSimulator: React.FC = () => {
  // 申报区间时间（秒）
  const [intervalTime] = useState<number>(900); // 15分钟 = 900秒
  const [remainingTime, setRemainingTime] = useState<number>(intervalTime);
  
  // 玩家状态
  const [player, setPlayer] = useState<PlayerState>({
    balance: 100000,
    inventory: 0
  });
  
  // 申报池
  const [bidPool, setBidPool] = useState<Bid[]>([]);
  
  // 匹配结果
  const [matchingResults, setMatchingResults] = useState<MatchingResult[]>([]);
  
  // 当前区间
  const [currentInterval, setCurrentInterval] = useState<number>(1);
  
  // 新增申报
  const [newBid, setNewBid] = useState<{
    type: 'buy' | 'sell';
    price: number;
    quantity: number;
  }>({
    type: 'buy',
    price: 0.35,
    quantity: 100
  });
  
  // 定时器
  const [timer, setTimer] = useState<number | null>(null);
  
  // 开始定时器
  useEffect(() => {
    const startTimer = () => {
      const timerId = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            // 时间到，执行撮合
            executeMatching();
            return intervalTime;
          }
          return prev - 1;
        });
      }, 1000);
      setTimer(timerId);
    };
    
    startTimer();
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [intervalTime, timer]);
  
  // 执行集中撮合
  const executeMatching = () => {
    // 筛选当前区间的申报
    const currentBids = bidPool.filter(bid => bid.status === 'pending');
    
    // 分类买单和卖单
    const buyBids = [...currentBids]
      .filter(bid => bid.type === 'buy')
      .sort((a, b) => b.price - a.price);
    
    const sellBids = [...currentBids]
      .filter(bid => bid.type === 'sell')
      .sort((a, b) => a.price - b.price);
    
    // 计算出清价格和成交量
    let clearingPrice = 0;
    let matchedQuantity = 0;
    let totalBuy = 0;
    let totalSell = 0;
    
    // 计算累计需求和供应
    const cumulativeBuy = buyBids.map((bid) => {
      totalBuy += bid.quantity;
      return { price: bid.price, quantity: totalBuy };
    });
    
    const cumulativeSell = sellBids.map((bid) => {
      totalSell += bid.quantity;
      return { price: bid.price, quantity: totalSell };
    });
    
    // 寻找供需平衡点
    let equilibriumFound = false;
    for (let i = 0; i < cumulativeBuy.length && !equilibriumFound; i++) {
      const buy = cumulativeBuy[i];
      for (let j = 0; j < cumulativeSell.length && !equilibriumFound; j++) {
        const sell = cumulativeSell[j];
        if (buy.quantity >= sell.quantity && i === j) {
          clearingPrice = buy.price;
          matchedQuantity = sell.quantity;
          equilibriumFound = true;
        }
      }
    }
    
    // 如果没有找到平衡点，使用平均价格
    if (!equilibriumFound && buyBids.length > 0 && sellBids.length > 0) {
      const avgBuyPrice = buyBids.reduce((sum, bid) => sum + bid.price, 0) / buyBids.length;
      const avgSellPrice = sellBids.reduce((sum, bid) => sum + bid.price, 0) / sellBids.length;
      clearingPrice = (avgBuyPrice + avgSellPrice) / 2;
      matchedQuantity = Math.min(totalBuy, totalSell);
    }
    
    // 更新申报状态
    const updatedBids = bidPool.map(bid => {
      if (bid.status === 'pending') {
        if (bid.type === 'buy' && bid.price >= clearingPrice) {
          return { ...bid, status: 'matched' as const };
        } else if (bid.type === 'sell' && bid.price <= clearingPrice) {
          return { ...bid, status: 'matched' as const };
        } else {
          return { ...bid, status: 'unmatched' as const };
        }
      }
      return bid;
    });
    
    // 记录匹配结果
    const result: MatchingResult = {
      buyBids: buyBids,
      sellBids: sellBids,
      matchedQuantity,
      clearingPrice,
      timestamp: Date.now()
    };
    
    setBidPool(updatedBids);
    setMatchingResults(prev => [result, ...prev]);
    setCurrentInterval(prev => prev + 1);
  };
  
  // 添加新申报
  const addBid = () => {
    const bid: Bid = {
      id: `bid-${Date.now()}`,
      type: newBid.type,
      price: newBid.price,
      quantity: newBid.quantity,
      time: Date.now(),
      status: 'pending'
    };
    
    setBidPool(prev => [...prev, bid]);
    
    // 重置表单
    setNewBid(prev => ({
      ...prev,
      quantity: 100
    }));
  };
  
  // 重置模拟器
  const resetSimulator = () => {
    setBidPool([]);
    setMatchingResults([]);
    setPlayer({
      balance: 100000,
      inventory: 0
    });
    setCurrentInterval(1);
    setRemainingTime(intervalTime);
  };
  
  // 格式化时间
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // 获取当前申报池中的买单和卖单
  const pendingBids = bidPool.filter(bid => bid.status === 'pending');
  const pendingBuyBids = pendingBids
    .filter(bid => bid.type === 'buy')
    .sort((a, b) => b.price - a.price);
  const pendingSellBids = pendingBids
    .filter(bid => bid.type === 'sell')
    .sort((a, b) => a.price - b.price);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">集中撮合交易大厅</h2>
        <p className="text-gray-600">
          体验15分钟申报区间，价格优先出清的集中撮合交易机制
        </p>
      </div>
      
      {/* 申报区间信息 */}
      <Card title="当前申报区间" className="bg-yellow-50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-2">区间编号</div>
            <div className="text-3xl font-bold">{currentInterval}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-2">剩余时间</div>
            <div className="text-3xl font-bold text-red-700">
              {formatTime(remainingTime)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-2">当前申报数量</div>
            <div className="text-3xl font-bold">{pendingBids.length}</div>
          </div>
        </div>
        <div className="mt-4 text-center">
          <Button variant="primary" onClick={executeMatching}>
            立即开始撮合
          </Button>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 申报池 */}
        <Card title="申报池" className="h-full">
          <div className="space-y-4">
            {/* 卖单申报 */}
            <div>
              <h4 className="font-medium mb-3">卖单申报（价格从低到高）</h4>
              <div className="bg-red-50 p-3 rounded-lg max-h-60 overflow-y-auto">
                {pendingSellBids.length > 0 ? (
                  <div className="space-y-2">
                    {pendingSellBids.map(bid => (
                      <div key={bid.id} className="p-2 bg-white rounded border border-gray-200 text-sm">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">价格：{bid.price.toFixed(3)} 元/kWh</div>
                            <div className="text-xs text-gray-500">电量：{bid.quantity} MWh</div>
                          </div>
                          <div className="text-xs font-medium px-2 py-1 rounded-full bg-red-100 text-red-800">
                            待匹配
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    暂无卖单申报
                  </div>
                )}
              </div>
            </div>
            
            {/* 买单申报 */}
            <div>
              <h4 className="font-medium mb-3">买单申报（价格从高到低）</h4>
              <div className="bg-blue-50 p-3 rounded-lg max-h-60 overflow-y-auto">
                {pendingBuyBids.length > 0 ? (
                  <div className="space-y-2">
                    {pendingBuyBids.map(bid => (
                      <div key={bid.id} className="p-2 bg-white rounded border border-gray-200 text-sm">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">价格：{bid.price.toFixed(3)} 元/kWh</div>
                            <div className="text-xs text-gray-500">电量：{bid.quantity} MWh</div>
                          </div>
                          <div className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                            待匹配
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    暂无买单申报
                  </div>
                )}
              </div>
            </div>
            
            {/* 新增申报 */}
            <div>
              <h4 className="font-medium mb-3">提交新申报</h4>
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">申报类型</label>
                    <select
                      value={newBid.type}
                      onChange={(e) => setNewBid({ ...newBid, type: e.target.value as 'buy' | 'sell' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="buy">买入</option>
                      <option value="sell">卖出</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">价格 (元/kWh)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.2"
                      max="0.5"
                      value={newBid.price}
                      onChange={(e) => setNewBid({ ...newBid, price: parseFloat(e.target.value) })}
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
                      value={newBid.quantity}
                      onChange={(e) => setNewBid({ ...newBid, quantity: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <Button variant="primary" onClick={addBid}>
                  提交申报
                </Button>
              </div>
            </div>
          </div>
        </Card>
        
        {/* 撮合结果 */}
        <Card title="撮合结果" className="h-full">
          <div className="space-y-4">
            <div className="max-h-80 overflow-y-auto space-y-4">
              {matchingResults.length > 0 ? (
                matchingResults.map((result, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-green-50 p-3 rounded-lg border border-green-200"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div className="text-sm font-medium">
                        第 {currentInterval - index - 1} 轮撮合结果
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(result.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <div className="text-sm font-medium mb-2">出清价格</div>
                        <div className="text-2xl font-bold text-green-700">
                          {result.clearingPrice.toFixed(3)} 元/kWh
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium mb-2">成交电量</div>
                        <div className="text-2xl font-bold">
                          {result.matchedQuantity} MWh
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium mb-2">买单情况</div>
                        <div className="text-xs text-gray-500">
                          共 {result.buyBids.length} 笔买单，总电量 {result.buyBids.reduce((sum, bid) => sum + bid.quantity, 0)} MWh
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium mb-2">卖单情况</div>
                        <div className="text-xs text-gray-500">
                          共 {result.sellBids.length} 笔卖单，总电量 {result.sellBids.reduce((sum, bid) => sum + bid.quantity, 0)} MWh
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  暂无撮合结果
                </div>
              )}
            </div>
            
            {/* 操作按钮 */}
            <div className="flex gap-3">
              <Button variant="primary" onClick={executeMatching} className="flex-1">
                开始撮合
              </Button>
              <Button variant="secondary" onClick={resetSimulator} className="flex-1">
                重置模拟器
              </Button>
            </div>
          </div>
        </Card>
      </div>
      
      {/* 玩家状态 */}
      <Card title="玩家状态" className="h-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3">账户信息</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">可用资金</div>
                  <div className="text-xl font-bold">¥{player.balance.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">可用电量</div>
                  <div className="text-xl font-bold">{player.inventory} MWh</div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">规则说明</h4>
            <div className="bg-blue-50 p-4 rounded-lg text-sm space-y-2">
              <div className="font-medium">集中撮合交易规则：</div>
              <div>• 每个申报区间为15分钟</div>
              <div>• 购售双方可多次自由申报电量包</div>
              <div>• 系统按"价格优先"原则每15分钟自动出清一次</div>
              <div>• 支持手动点击"开始撮合"按钮立即进行出清</div>
              <div>• 买单按价格从高到低排序</div>
              <div>• 卖单按价格从低到高排序</div>
              <div>• 匹配成功的申报将从池移除</div>
              <div>• 未匹配的申报将进入下一区间</div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default CentralizedMatchingHallSimulator;