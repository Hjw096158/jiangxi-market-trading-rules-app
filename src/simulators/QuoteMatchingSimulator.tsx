import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import Card from '../components/Card';

interface Bid {
  id: string;
  price: number;
  quantity: number;
  status: 'pending' | 'matched' | 'unmatched';
  matchedWith?: string;
}

interface MatchingResult {
  seller: Bid;
  buyer: Bid;
  matchedQuantity: number;
  buyPrice: number;
  sellPrice: number;
  round: number;
}

const QuoteMatchingSimulator: React.FC = () => {
  // k系数
  const [k, setK] = useState<number>(0.5);
  
  // 报价数据
  const [sellerBids, setSellerBids] = useState<Bid[]>([
    { id: 's1', price: 0.30, quantity: 100, status: 'pending' },
    { id: 's2', price: 0.32, quantity: 150, status: 'pending' },
    { id: 's3', price: 0.34, quantity: 200, status: 'pending' }
  ]);
  
  const [buyerBids, setBuyerBids] = useState<Bid[]>([
    { id: 'b1', price: 0.38, quantity: 180, status: 'pending' },
    { id: 'b2', price: 0.36, quantity: 200, status: 'pending' },
    { id: 'b3', price: 0.33, quantity: 120, status: 'pending' }
  ]);
  
  // 匹配结果
  const [matchingResults, setMatchingResults] = useState<MatchingResult[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [calculationSteps, setCalculationSteps] = useState<string[]>([]);
  
  // 新增报价
  const [newBid, setNewBid] = useState<{ price: number; quantity: number; type: 'buy' | 'sell' }>({ 
    price: 0.35, 
    quantity: 100, 
    type: 'buy' 
  });
  
  // 执行报价撮合
  const executeMatching = () => {
    // 重置状态
    const resetSellerBids = sellerBids.map(bid => ({ ...bid, status: 'pending' as const, matchedWith: undefined }));
    const resetBuyerBids = buyerBids.map(bid => ({ ...bid, status: 'pending' as const, matchedWith: undefined }));
    
    // 复制数据用于匹配
    let tempSellerBids: Bid[] = [...resetSellerBids].sort((a, b) => a.price - b.price); // 售方从低到高
    let tempBuyerBids: Bid[] = [...resetBuyerBids].sort((a, b) => b.price - a.price); // 购方从高到低
    
    const results: MatchingResult[] = [];
    const steps: string[] = [];
    let round = 1;
    
    steps.push("1. 报价排序：");
    steps.push("   售方报价按价格从低到高排序：");
    tempSellerBids.forEach((bid, index) => {
      steps.push(`      ${index + 1}. 价格：${bid.price.toFixed(3)} 元/kWh，电量：${bid.quantity} MWh`);
    });
    
    steps.push("   购方报价按价格从高到低排序：");
    tempBuyerBids.forEach((bid, index) => {
      steps.push(`      ${index + 1}. 价格：${bid.price.toFixed(3)} 元/kWh，电量：${bid.quantity} MWh`);
    });
    
    steps.push(`\n2. k系数设置：k = ${k}`);
    steps.push(`\n3. 开始撮合：`);
    
    // 执行撮合
    let sellerIndex = 0;
    let buyerIndex = 0;
    
    while (sellerIndex < tempSellerBids.length && buyerIndex < tempBuyerBids.length) {
      const seller = tempSellerBids[sellerIndex];
      const buyer = tempBuyerBids[buyerIndex];
      
      steps.push(`   第 ${round} 轮撮合：`);
      steps.push(`      售方：${seller.price.toFixed(3)} 元/kWh | ${seller.quantity} MWh`);
      steps.push(`      购方：${buyer.price.toFixed(3)} 元/kWh | ${buyer.quantity} MWh`);
      
      if (buyer.price >= seller.price) {
        // 可以成交
        const matchedQuantity = Math.min(seller.quantity, buyer.quantity);
        
        // 计算成交价格
        const buyPrice = buyer.price - k * (buyer.price - seller.price);
        const sellPrice = seller.price + (1 - k) * (buyer.price - seller.price);
        
        // 记录结果
        results.push({
          seller: { ...seller },
          buyer: { ...buyer },
          matchedQuantity,
          buyPrice,
          sellPrice,
          round
        });
        
        steps.push(`      ✅ 成交！`);
        steps.push(`      成交电量：${matchedQuantity} MWh`);
        steps.push(`      购方成交价：${buyPrice.toFixed(3)} 元/kWh`);
        steps.push(`      售方成交价：${sellPrice.toFixed(3)} 元/kWh`);
        steps.push(`      计算公式：`);
        steps.push(`         购方：P购 = P购报 - k×(P购报 - P售报) = ${buyer.price.toFixed(3)} - ${k}×(${buyer.price.toFixed(3)} - ${seller.price.toFixed(3)}) = ${buyPrice.toFixed(3)}`);
        steps.push(`         售方：P售 = P售报 + (1-k)×(P购报 - P售报) = ${seller.price.toFixed(3)} + ${1-k}×(${buyer.price.toFixed(3)} - ${seller.price.toFixed(3)}) = ${sellPrice.toFixed(3)}`);
        
        // 更新报价状态
        seller.status = 'matched' as const;
        buyer.status = 'matched' as const;
        seller.matchedWith = buyer.id;
        buyer.matchedWith = seller.id;
        
        // 更新剩余电量
        seller.quantity -= matchedQuantity;
        buyer.quantity -= matchedQuantity;
        
        // 如果电量耗尽，移动指针
        if (seller.quantity === 0) {
          sellerIndex++;
        }
        if (buyer.quantity === 0) {
          buyerIndex++;
        }
      } else {
        // 无法成交，结束撮合
        steps.push(`      ❌ 无法成交（购方报价 < 售方报价）`);
        break;
      }
      
      round++;
    }
    
    // 更新未匹配的报价状态
    while (sellerIndex < tempSellerBids.length) {
      tempSellerBids[sellerIndex].status = 'unmatched' as const;
      sellerIndex++;
    }
    
    while (buyerIndex < tempBuyerBids.length) {
      tempBuyerBids[buyerIndex].status = 'unmatched' as const;
      buyerIndex++;
    }
    
    setMatchingResults(results);
    setCalculationSteps(steps);
    setShowResults(true);
  };
  
  // 添加新报价
  const addBid = () => {
    const id = `${newBid.type === 'sell' ? 's' : 'b'}${Date.now()}`;
    const newBidItem: Bid = {
      id,
      price: newBid.price,
      quantity: newBid.quantity,
      status: 'pending'
    };
    
    if (newBid.type === 'sell') {
      setSellerBids([...sellerBids, newBidItem]);
    } else {
      setBuyerBids([...buyerBids, newBidItem]);
    }
    
    setNewBid({ price: 0.35, quantity: 100, type: newBid.type });
  };
  
  // 重置模拟器
  const resetSimulator = () => {
    setSellerBids([
      { id: 's1', price: 0.30, quantity: 100, status: 'pending' },
      { id: 's2', price: 0.32, quantity: 150, status: 'pending' },
      { id: 's3', price: 0.34, quantity: 200, status: 'pending' }
    ]);
    
    setBuyerBids([
      { id: 'b1', price: 0.38, quantity: 180, status: 'pending' },
      { id: 'b2', price: 0.36, quantity: 200, status: 'pending' },
      { id: 'b3', price: 0.33, quantity: 120, status: 'pending' }
    ]);
    
    setMatchingResults([]);
    setShowResults(false);
    setCalculationSteps([]);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">报价撮合出清模拟器</h2>
        <p className="text-gray-600">
          学习报价撮合法的配对规则和价差对系数k的作用
        </p>
      </div>
      
      {/* k系数设置 */}
      <div className="flex justify-center gap-4 items-center mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">价差对系数 k</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="1"
            value={k}
            onChange={(e) => setK(parseFloat(e.target.value))}
            className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
          />
        </div>
        <div className="text-sm text-gray-500">
          （暂按0.5执行，表示购售双方平分价差收益）
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 报价列表 */}
        <Card title="报价列表" className="h-full">
          <div className="space-y-6">
            {/* 售方报价 */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium">售方报价（价格从低到高）</h4>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {sellerBids.length} 条
                </span>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {[...sellerBids].sort((a, b) => a.price - b.price).map((bid) => (
                  <div 
                    key={bid.id} 
                    className={`p-3 rounded-lg border ${bid.status === 'matched' ? 'border-green-200 bg-green-50' : bid.status === 'unmatched' ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50'}`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm font-medium">报价 {bid.id}</div>
                        <div className="text-xs text-gray-500">
                          价格：{bid.price.toFixed(3)} 元/kWh | 电量：{bid.quantity} MWh
                        </div>
                      </div>
                      <div className="text-xs font-medium px-2 py-1 rounded-full"
                        style={{
                          backgroundColor: bid.status === 'matched' ? '#10b981' : bid.status === 'unmatched' ? '#ef4444' : '#6b7280',
                          color: 'white'
                        }}
                      >
                        {bid.status === 'matched' ? '已匹配' : bid.status === 'unmatched' ? '未匹配' : '待匹配'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* 购方报价 */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium">购方报价（价格从高到低）</h4>
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                  {buyerBids.length} 条
                </span>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {[...buyerBids].sort((a, b) => b.price - a.price).map((bid) => (
                  <div 
                    key={bid.id} 
                    className={`p-3 rounded-lg border ${bid.status === 'matched' ? 'border-green-200 bg-green-50' : bid.status === 'unmatched' ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50'}`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm font-medium">报价 {bid.id}</div>
                        <div className="text-xs text-gray-500">
                          价格：{bid.price.toFixed(3)} 元/kWh | 电量：{bid.quantity} MWh
                        </div>
                      </div>
                      <div className="text-xs font-medium px-2 py-1 rounded-full"
                        style={{
                          backgroundColor: bid.status === 'matched' ? '#10b981' : bid.status === 'unmatched' ? '#ef4444' : '#6b7280',
                          color: 'white'
                        }}
                      >
                        {bid.status === 'matched' ? '已匹配' : bid.status === 'unmatched' ? '未匹配' : '待匹配'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* 添加新报价 */}
            <div>
              <h4 className="font-medium mb-3">添加新报价</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <div>
                  <label className="block text-sm font-medium mb-1">类型</label>
                  <select
                    value={newBid.type}
                    onChange={(e) => setNewBid({ ...newBid, type: e.target.value as 'buy' | 'sell' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="buy">购方</option>
                    <option value="sell">售方</option>
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
                添加报价
              </Button>
            </div>
            
            {/* 操作按钮 */}
            <div className="flex gap-3">
              <Button variant="primary" onClick={executeMatching} className="flex-1">
                开始撮合
              </Button>
              <Button variant="secondary" onClick={resetSimulator} className="flex-1">
                重置
              </Button>
            </div>
          </div>
        </Card>
        
        {/* 撮合结果 */}
        <Card title="撮合结果" className="h-full">
          <div className="space-y-4">
            {showResults ? (
              <>
                {/* 匹配结果 */}
                <div>
                  <h4 className="font-medium mb-3">匹配结果</h4>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {matchingResults.map((result, index) => (
                      <div key={index} className="bg-green-50 p-3 rounded-lg border border-green-200">
                        <div className="text-sm font-medium mb-2">第 {result.round} 轮匹配</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                          <div>
                            <div className="font-medium text-gray-700">售方信息</div>
                            <div>报价ID：{result.seller.id}</div>
                            <div>原报价：{result.seller.price.toFixed(3)} 元/kWh | {result.seller.quantity + result.matchedQuantity} MWh</div>
                            <div>成交价格：{result.sellPrice.toFixed(3)} 元/kWh</div>
                            <div>成交电量：{result.matchedQuantity} MWh</div>
                          </div>
                          <div>
                            <div className="font-medium text-gray-700">购方信息</div>
                            <div>报价ID：{result.buyer.id}</div>
                            <div>原报价：{result.buyer.price.toFixed(3)} 元/kWh | {result.buyer.quantity + result.matchedQuantity} MWh</div>
                            <div>成交价格：{result.buyPrice.toFixed(3)} 元/kWh</div>
                            <div>成交电量：{result.matchedQuantity} MWh</div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {matchingResults.length === 0 && (
                      <div className="text-center py-4 text-gray-500">
                        没有匹配结果
                      </div>
                    )}
                  </div>
                </div>
                
                {/* 统计信息 */}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="font-medium mb-3">统计信息</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500">总成交轮数</div>
                      <div className="font-bold">{matchingResults.length} 轮</div>
                    </div>
                    <div>
                      <div className="text-gray-500">总成交电量</div>
                      <div className="font-bold">
                        {matchingResults.reduce((sum, result) => sum + result.matchedQuantity, 0)} MWh
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500">平均购方成交价</div>
                      <div className="font-bold">
                        {matchingResults.length > 0 ? (
                          (matchingResults.reduce((sum, result) => sum + result.buyPrice, 0) / matchingResults.length).toFixed(3)
                        ) : '0.000'}
                        {' '}元/kWh
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500">平均售方成交价</div>
                      <div className="font-bold">
                        {matchingResults.length > 0 ? (
                          (matchingResults.reduce((sum, result) => sum + result.sellPrice, 0) / matchingResults.length).toFixed(3)
                        ) : '0.000'}
                        {' '}元/kWh
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="text-xl mb-2">📊</div>
                <div className="mb-2">点击"开始撮合"查看结果</div>
                <div className="text-sm">系统将按照价格优先原则进行撮合</div>
              </div>
            )}
          </div>
        </Card>
      </div>
      
      {/* 计算过程 */}
      {showResults && (
        <Card title="撮合过程" className="overflow-hidden">
          <div className="max-h-80 overflow-y-auto">
            <div className="bg-gray-50 p-4">
              <div className="space-y-2 text-sm">
                {calculationSteps.map((step, index) => (
                  <div key={index}>{step}</div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}
      
      {/* 公式说明 */}
      <Card title="公式说明">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm space-y-2">
            <div className="font-medium">报价撮合法核心原理：</div>
            <div>• 售方报价按价格从低到高排序</div>
            <div>• 购方报价按价格从高到低排序</div>
            <div>• 依次配对，只要购方报价 ≥ 售方报价即可成交</div>
            <div>• 成交电量为双方申报电量的较小值</div>
            <div className="mt-3 font-medium">成交价格计算公式：</div>
            <div>• 购方成交价：P购 = P购报 - k × (P购报 - P售报)</div>
            <div>• 售方成交价：P售 = P售报 + (1 - k) × (P购报 - P售报)</div>
            <div>• 当 k=0.5 时，P购 = P售（双方平分价差）</div>
            <div className="mt-3 font-medium">k系数含义：</div>
            <div>• k为价差对系数，取值范围 0-1</div>
            <div>• k=0：所有价差归售方所有</div>
            <div>• k=1：所有价差归购方所有</div>
            <div>• 暂按0.5执行，表示购售双方平分价差收益</div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default QuoteMatchingSimulator;