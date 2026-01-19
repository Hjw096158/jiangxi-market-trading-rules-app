import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import Card from '../components/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

interface Bid {
  price: number;
  quantity: number;
}

interface SupplyDemandCurve {
  quantity: number;
  supplyPrice: number | undefined;
  demandPrice: number | undefined;
}

const SupplyDemandCurveSimulator: React.FC = () => {
  // 角色选择
  const [role, setRole] = useState<'buyer' | 'seller'>('seller');
  
  // 报价模式：报量报价或报量不报价
  const [buyerBidMode, setBuyerBidMode] = useState<'price_quantity' | 'quantity_only'>('price_quantity');
  
  // 报价数据
  const [sellerBids, setSellerBids] = useState<Bid[]>([
    { price: 0.30, quantity: 200 },
    { price: 0.33, quantity: 150 },
    { price: 0.36, quantity: 100 }
  ]);
  
  const [buyerBids, setBuyerBids] = useState<Bid[]>([
    { price: 0.38, quantity: 180 },
    { price: 0.35, quantity: 200 },
    { price: 0.32, quantity: 120 }
  ]);
  
  // 报量不保价的总需求量
  const [buyerTotalQuantity, setBuyerTotalQuantity] = useState<number>(500);
  
  // 新增报价
  const [newBid, setNewBid] = useState<Bid>({ price: 0.30, quantity: 100 });
  
  // 供需曲线数据
  const [supplyDemandData, setSupplyDemandData] = useState<SupplyDemandCurve[]>([]);
  
  // 出清结果
  const [clearingPrice, setClearingPrice] = useState<number>(0);
  const [clearingQuantity, setClearingQuantity] = useState<number>(0);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [calculationSteps, setCalculationSteps] = useState<string[]>([]);
  
  // 生成供需曲线
  const generateSupplyDemandCurve = () => {
    // 按价格排序
    const sortedSellerBids = [...sellerBids].sort((a, b) => a.price - b.price);
    
    // 生成供应曲线：价格从低到高，累加电量
    let cumulativeSupply = 0;
    const supplyPoints: { price: number; quantity: number }[] = [];
    for (const bid of sortedSellerBids) {
      cumulativeSupply += bid.quantity;
      supplyPoints.push({ price: bid.price, quantity: cumulativeSupply });
    }
    
    // 合并所有电量点，用于生成完整的供应曲线
    const allQuantities = [
      ...supplyPoints.map(point => point.quantity),
      0
    ];
    const uniqueQuantities = Array.from(new Set(allQuantities)).sort((a, b) => a - b);
    
    // 生成供需曲线数据：电量为横轴，价格为纵轴
    const curveData: SupplyDemandCurve[] = [];
    
    // 生成每个电量点对应的供应价格
    for (const quantity of uniqueQuantities) {
      // 找到对应电量的供应价格
      let supplyPrice = 0;
      
      // 供应价格：找到第一个供应量大于等于当前电量的报价
      for (const point of supplyPoints) {
        if (point.quantity >= quantity) {
          supplyPrice = point.price;
          break;
        }
      }
      
      // 如果所有供应点都小于当前电量，使用最后一个供应点的价格
      if (supplyPrice === 0 && supplyPoints.length > 0) {
        supplyPrice = supplyPoints[supplyPoints.length - 1].price;
      }
      
      curveData.push({
        quantity: quantity, // 电量作为横轴
        supplyPrice: supplyPrice, // 供应曲线的价格
        demandPrice: undefined // 初始需求价格设为undefined
      });
    }
    
    // 添加结束点（最大电量+100），只添加结束点，起始点0已经存在
    const maxQuantity = Math.max(...uniqueQuantities);
    
    // 检查是否已存在结束点附近的点，避免重复
    const hasEndPoint = curveData.some(point => Math.abs(point.quantity - (maxQuantity + 100)) < 50);
    if (!hasEndPoint) {
      curveData.push({
        quantity: maxQuantity + 100,
        supplyPrice: supplyPoints.length > 0 ? supplyPoints[supplyPoints.length - 1].price : 0,
        demandPrice: undefined
      });
    }
    
    // 报量不报价模式：需求曲线是一条纯粹的垂直直线
    if (buyerBidMode === 'quantity_only') {
      // 计算垂直直线的价格范围
      const maxPrice = 0.7; // 设置一个固定的最大价格，确保垂直直线足够长
      const minPrice = 0;
      
      // 计算总需求量对应的供应价格
      let demandPositionSupplyPrice = 0;
      for (const point of supplyPoints) {
        if (point.quantity >= buyerTotalQuantity) {
          demandPositionSupplyPrice = point.price;
          break;
        }
      }
      // 如果需求超过了总供应，使用最后一个供应价格
      if (demandPositionSupplyPrice === 0 && supplyPoints.length > 0) {
        demandPositionSupplyPrice = supplyPoints[supplyPoints.length - 1].price;
      }
      
      // 生成最终的曲线数据，使用Map确保每个电量只对应一个数据点
      const curveDataMap = new Map<number, SupplyDemandCurve>();
      
      // 首先添加供应曲线的所有点，确保每个电量只有一个供应点
      for (const point of curveData) {
        if (!curveDataMap.has(point.quantity)) {
          curveDataMap.set(point.quantity, {
            quantity: point.quantity,
            supplyPrice: point.supplyPrice,
            demandPrice: undefined // 初始需求价格设为undefined
          });
        }
      }
      
      // 处理垂直需求线：将需求价格信息合并到现有数据点或创建新点
      const targetQuantity = buyerTotalQuantity;
      
      // 创建包含需求曲线信息的点
      const verticalDemandPoints: SupplyDemandCurve[] = [
        // 底部点：价格0，电量为总需求量
        { quantity: targetQuantity, supplyPrice: undefined, demandPrice: minPrice },
        // 顶部点：最大价格，电量为总需求量
        { quantity: targetQuantity, supplyPrice: undefined, demandPrice: maxPrice },
        // 交点：供应价格等于需求价格的点
        { quantity: targetQuantity, supplyPrice: demandPositionSupplyPrice, demandPrice: demandPositionSupplyPrice }
      ];
      
      // 将垂直需求线的点合并到Map中
      for (const vPoint of verticalDemandPoints) {
        if (curveDataMap.has(vPoint.quantity)) {
          // 如果该电量已存在，合并需求价格信息
          const existingPoint = curveDataMap.get(vPoint.quantity)!;
          curveDataMap.set(vPoint.quantity, {
            quantity: vPoint.quantity,
            supplyPrice: existingPoint.supplyPrice !== undefined ? existingPoint.supplyPrice : vPoint.supplyPrice,
            demandPrice: vPoint.demandPrice
          });
        } else {
          // 如果该电量不存在，直接添加
          curveDataMap.set(vPoint.quantity, vPoint);
        }
      }
      
      // 转换Map为数组并排序
      const finalCurveData = Array.from(curveDataMap.values()).sort((a, b) => a.quantity - b.quantity);
      
      setSupplyDemandData(finalCurveData);
      return;
    } else {
      // 报量报价模式：生成正常的需求曲线
      const sortedBuyerBids = [...buyerBids].sort((a, b) => b.price - a.price);
      
      // 生成需求曲线：价格从高到低，累加电量
      let cumulativeDemand = 0;
      const demandPoints: { price: number; quantity: number }[] = [];
      for (const bid of sortedBuyerBids) {
        cumulativeDemand += bid.quantity;
        demandPoints.push({ price: bid.price, quantity: cumulativeDemand });
      }
      
      // 使用Map确保每个电量只对应一个数据点
      const curveDataMap = new Map<number, SupplyDemandCurve>();
      
      // 添加供应曲线的所有点
      for (const point of curveData) {
        if (!curveDataMap.has(point.quantity)) {
          curveDataMap.set(point.quantity, {
            quantity: point.quantity,
            supplyPrice: point.supplyPrice,
            demandPrice: undefined // 初始需求价格设为undefined
          });
        }
      }
      
      // 更新每个电量点对应的需求价格
      for (const [quantity, point] of curveDataMap) {
        let demandPrice = 0;
        
        // 需求价格：找到第一个需求量大于等于当前电量的报价
        for (const demandPoint of demandPoints) {
          if (demandPoint.quantity >= quantity) {
            demandPrice = demandPoint.price;
            break;
          }
        }
        
        // 如果所有需求点都小于当前电量，使用最后一个需求点的价格
        if (demandPrice === 0 && demandPoints.length > 0) {
          demandPrice = demandPoints[demandPoints.length - 1].price;
        }
        
        // 更新需求价格
        curveDataMap.set(quantity, {
          ...point,
          demandPrice: demandPrice
        });
      }
      
      // 转换Map为数组并排序
      const finalCurveData = Array.from(curveDataMap.values()).sort((a, b) => a.quantity - b.quantity);
      
      setSupplyDemandData(finalCurveData);
    }
  };
  
  // 计算边际电价
  const calculateMarginalPrice = () => {
    generateSupplyDemandCurve();
    
    const steps: string[] = [];
    
    // 按价格排序
    const sortedSellerBids = [...sellerBids].sort((a, b) => a.price - b.price);
    const sortedBuyerBids = [...buyerBids].sort((a, b) => b.price - a.price);
    
    steps.push("1. 售方报价按价格从低到高排序：");
    sortedSellerBids.forEach((bid, index) => {
      steps.push(`   ${index + 1}. 价格：${bid.price.toFixed(3)} 元/kWh，电量：${bid.quantity} MWh`);
    });
    
    // 计算累计供应
    const cumulativeSupply: number[] = [];
    let sumSupply = 0;
    for (const bid of sortedSellerBids) {
      sumSupply += bid.quantity;
      cumulativeSupply.push(sumSupply);
    }
    
    steps.push("\n2. 计算累计供应量：");
    cumulativeSupply.forEach((supply, index) => {
      steps.push(`   价格 ≤ ${sortedSellerBids[index].price.toFixed(3)} 元/kWh 时，累计供应：${supply} MWh`);
    });
    
    // 计算边际价格
    let p0 = 0;
    let q0 = 0;
    
    if (buyerBidMode === 'quantity_only') {
      // 报量不报价模式：需求固定，边际价格是供应曲线在该需求点对应的价格
      q0 = buyerTotalQuantity;
      
      steps.push(`\n3. 购方报量不报价，总需求量：${buyerTotalQuantity} MWh`);
      steps.push(`   需求曲线为垂直直线，与供应曲线相交确定边际价格`);
      
      // 计算在给定需求下的供应价格
      let cumulative = 0;
      for (let i = 0; i < sortedSellerBids.length; i++) {
        cumulative += sortedSellerBids[i].quantity;
        if (cumulative >= q0) {
          // 找到了边际供应者
          p0 = sortedSellerBids[i].price;
          break;
        }
      }
      
      // 如果需求超过了总供应，使用最后一个供应价格，出清电量为总供应量
      if (p0 === 0 && cumulativeSupply.length > 0) {
        p0 = sortedSellerBids[sortedSellerBids.length - 1].price;
        q0 = cumulativeSupply[cumulativeSupply.length - 1];
        steps.push("\n4. 边界情况：需求超过总供应");
        steps.push(`   总供应量：${q0} MWh，出清电量为总供应量`);
      } else {
        steps.push("\n4. 垂直需求曲线与供应曲线相交：");
      }
    } else {
      // 报量报价模式：正常计算供需曲线交点
      // 计算累计需求
      const cumulativeDemand: number[] = [];
      let sumDemand = 0;
      for (const bid of sortedBuyerBids) {
        sumDemand += bid.quantity;
        cumulativeDemand.push(sumDemand);
      }
      
      steps.push("\n3. 购方报价按价格从高到低排序：");
      sortedBuyerBids.forEach((bid, index) => {
        steps.push(`   ${index + 1}. 价格：${bid.price.toFixed(3)} 元/kWh，电量：${bid.quantity} MWh`);
      });
      
      steps.push("\n4. 计算累计需求量：");
      cumulativeDemand.forEach((demand, index) => {
        steps.push(`   价格 ≥ ${sortedBuyerBids[index].price.toFixed(3)} 元/kWh 时，累计需求：${demand} MWh`);
      });
      
      // 寻找交点
      let found = false;
      
      // 检查是否有交叉点
      for (let i = 0; i < supplyDemandData.length - 1; i++) {
        const current = supplyDemandData[i];
        const next = supplyDemandData[i + 1];
        
        // 确保supplyPrice和demandPrice值存在，否则跳过这个点
        if (current.supplyPrice === undefined || current.demandPrice === undefined ||
            next.supplyPrice === undefined || next.demandPrice === undefined) {
          continue;
        }
        
        // 检查是否交叉
        if ((current.supplyPrice <= current.demandPrice && next.supplyPrice >= next.demandPrice) ||
            (current.supplyPrice >= current.demandPrice && next.supplyPrice <= next.demandPrice)) {
          // 简单起见，取当前点作为交点
          p0 = (current.supplyPrice + current.demandPrice) / 2;
          q0 = current.quantity;
          found = true;
          break;
        }
      }
      
      if (!found) {
        // 计算售方最低价和购方最高价
        const minSellerPrice = Math.min(...sellerBids.map(bid => bid.price));
        const maxBuyerPrice = Math.max(...buyerBids.map(bid => bid.price));
        const maxSellerPrice = Math.max(...sellerBids.map(bid => bid.price));
        const minBuyerPrice = Math.min(...buyerBids.map(bid => bid.price));
        
        if (maxBuyerPrice < minSellerPrice) {
          // 边界情况1：购方最高价 < 售方最低价，没有成交电量
          p0 = 0;
          q0 = 0;
          
          steps.push(`\n5. 边界情况：购方最高价 &lt; 售方最低价时，曲线不相交`);
          steps.push(`   购方最高价：${maxBuyerPrice.toFixed(3)} 元/kWh`);
          steps.push(`   售方最低价：${minSellerPrice.toFixed(3)} 元/kWh`);
          steps.push(`   没有匹配的报价，成交电量为0`);
        } else if (minBuyerPrice > maxSellerPrice) {
          // 边界情况2：购方最低价 > 售方最高价，所有报价都匹配
          const pMin = Math.min(...sellerBids.map(bid => bid.price));
          const pMax = Math.max(...buyerBids.map(bid => bid.price));
          p0 = pMin + 0.5 * (pMax - pMin);
          q0 = Math.min(
            sellerBids.reduce((sum, bid) => sum + bid.quantity, 0),
            buyerBids.reduce((sum, bid) => sum + bid.quantity, 0)
          );
          
          steps.push(`\n5. 边界情况：购方最低价 &gt; 售方最高价时，曲线不相交`);
          steps.push(`   使用公式：P₀ = P_Dmin - K×(P_Dmin - P_Smax)，其中 K=0.5`);
          steps.push(`   其中 K=0.5，P_Dmin=${pMin.toFixed(3)}，P_Smax=${pMax.toFixed(3)}`);
          steps.push(`   计算得：P₀ = ${p0.toFixed(3)} 元/kWh`);
        } else {
          // 其他边界情况，使用默认处理
          const pMin = Math.min(...sellerBids.map(bid => bid.price));
          const pMax = Math.max(...buyerBids.map(bid => bid.price));
          p0 = pMin + 0.5 * (pMax - pMin);
          q0 = Math.min(
            sellerBids.reduce((sum, bid) => sum + bid.quantity, 0),
            buyerBids.reduce((sum, bid) => sum + bid.quantity, 0)
          );
          
          steps.push(`\n5. 边界情况：曲线不相交，使用平均价格`);
          steps.push(`   计算得：P₀ = ${p0.toFixed(3)} 元/kWh`);
        }
      } else {
        steps.push(`\n5. 找到供需曲线交点：`);
      }
    }
    
    // 通用的结果显示
    steps.push(`   边际价格 P₀ = ${p0.toFixed(3)} 元/kWh`);
    steps.push(`   预出清电量 Q₀ = ${q0} MWh`);
    
    setClearingPrice(p0);
    setClearingQuantity(q0);
    setCalculationSteps(steps);
    setShowResults(true);
  };
  
  // 添加新报价
  const addBid = () => {
    if (role === 'seller') {
      setSellerBids([...sellerBids, newBid]);
    } else {
      setBuyerBids([...buyerBids, newBid]);
    }
    setNewBid({ price: 0.30, quantity: 100 });
  };
  
  // 重置模拟器
  const resetSimulator = () => {
    setSellerBids([
      { price: 0.30, quantity: 200 },
      { price: 0.33, quantity: 150 },
      { price: 0.36, quantity: 100 }
    ]);
    setBuyerBids([
      { price: 0.38, quantity: 180 },
      { price: 0.35, quantity: 200 },
      { price: 0.32, quantity: 120 }
    ]);
    setNewBid({ price: 0.30, quantity: 100 });
    setSupplyDemandData([]);
    setClearingPrice(0);
    setClearingQuantity(0);
    setShowResults(false);
    setCalculationSteps([]);
  };
  
  // 初始化生成曲线
  useEffect(() => {
    generateSupplyDemandCurve();
  }, [sellerBids, buyerBids, buyerBidMode, buyerTotalQuantity]);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">供需曲线可视化模拟器</h2>
        <p className="text-gray-600">
          学习边际电价法的出清原理，可视化供需曲线交点
        </p>
      </div>
      
      {/* 角色选择 */}
      <div className="flex gap-4 justify-center mb-6">
        <Button
          variant={role === 'seller' ? 'primary' : 'secondary'}
          onClick={() => setRole('seller')}
        >
          售方
        </Button>
        <Button
          variant={role === 'buyer' ? 'primary' : 'secondary'}
          onClick={() => setRole('buyer')}
        >
          购方
        </Button>
      </div>
      
      {/* 购方报价模式选择 */}
      {role === 'buyer' && (
        <div className="flex gap-4 justify-center mb-6">
          <Button
            variant={buyerBidMode === 'price_quantity' ? 'primary' : 'secondary'}
            onClick={() => setBuyerBidMode('price_quantity')}
          >
            报量报价
          </Button>
          <Button
            variant={buyerBidMode === 'quantity_only' ? 'primary' : 'secondary'}
            onClick={() => setBuyerBidMode('quantity_only')}
          >
            报量不报价
          </Button>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 报价区 */}
        <Card title={buyerBidMode === 'quantity_only' ? '需求设置' : '报价区'} className="h-full">
          <div className="space-y-4">
            {/* 报量不报价模式 - 购方总需求量输入 */}
            {role === 'buyer' && buyerBidMode === 'quantity_only' && (
              <div>
                <h4 className="font-medium mb-3">购方总需求量：</h4>
                <div className="mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">总需求量 (MWh)</label>
                      <input
                        type="number"
                        step="50"
                        min="50"
                        max="2000"
                        value={buyerTotalQuantity}
                        onChange={(e) => setBuyerTotalQuantity(parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* 现有报价 - 仅在报量报价模式下显示 */}
            {(role === 'seller' || (role === 'buyer' && buyerBidMode === 'price_quantity')) && (
              <div>
                <h4 className="font-medium mb-3">{role === 'seller' ? '售方' : '购方'}报价：</h4>
                <div className="space-y-2">
                  {(role === 'seller' ? sellerBids : buyerBids).map((bid, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg flex justify-between">
                      <div>
                        <div className="text-sm font-medium">报价 {index + 1}</div>
                      </div>
                      <div className="text-sm">
                        价格：{bid.price.toFixed(3)} 元/kWh | 电量：{bid.quantity} MWh
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* 新增报价 - 仅在报量报价模式下显示 */}
            {(role === 'seller' || (role === 'buyer' && buyerBidMode === 'price_quantity')) && (
              <div>
                <h4 className="font-medium mb-3">添加新报价：</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
            )}
            
            {/* 操作按钮 */}
            <div className="flex gap-3 pt-2">
              <Button variant="primary" onClick={calculateMarginalPrice} className="flex-1">
                开始出清
              </Button>
              <Button variant="secondary" onClick={resetSimulator} className="flex-1">
                重置
              </Button>
            </div>
          </div>
        </Card>
        
        {/* 供需曲线 */}
        <Card title="供需曲线" className="h-full">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={supplyDemandData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="quantity" 
                  label={{ value: '电量 (MWh)', position: 'insideBottom', offset: -5 }} 
                  tickFormatter={(value) => value.toFixed(0)}
                  domain={[0, 'dataMax + 50']}
                />
                <YAxis 
                  label={{ value: '价格 (元/kWh)', angle: -90, position: 'insideLeft' }} 
                  tickFormatter={(value) => value.toFixed(2)}
                  domain={[0, 'dataMax + 0.1']}
                />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === '供应曲线' || name === '需求曲线') {
                      const numValue = typeof value === 'number' ? value : parseFloat(value as string) || 0;
                      return [`${numValue.toFixed(3)} 元/kWh`, name];
                    }
                    return [
                      `${value}`,
                      name === 'quantity' ? '电量' : name === 'demandPrice' ? '需求价格' : '供应价格'
                    ];
                  }}
                  labelFormatter={(label) => `电量：${label} MWh`}
                />
                <Legend />
                {/* 供应曲线：电量为横轴，价格为纵轴 */}
                <Line 
                  type="monotone" 
                  dataKey="supplyPrice" 
                  name="供应曲线" 
                  stroke="#2563eb" 
                  strokeWidth={2} 
                  dot={{ r: 3 }} 
                  activeDot={{ r: 6 }} 
                />
                {/* 需求曲线：电量为横轴，价格为纵轴 */}
                <Line 
                  type="monotone" 
                  dataKey="demandPrice" 
                  name="需求曲线" 
                  stroke="#dc2626" 
                  strokeWidth={2} 
                  dot={{ r: 3 }} 
                  activeDot={{ r: 6 }} 
                />
                {showResults && (
                  <>
                    <ReferenceLine 
                      x={clearingQuantity} 
                      stroke="#10b981" 
                      strokeDasharray="5 5" 
                      strokeWidth={2}
                      label={{ value: '出清电量', position: 'top' }}
                    />
                    <ReferenceLine 
                      y={clearingPrice} 
                      stroke="#10b981" 
                      strokeDasharray="5 5" 
                      strokeWidth={2}
                      label={{ value: '边际价格', position: 'right' }}
                    />
                  </>
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {/* 出清结果 */}
          {showResults && (
            <div className="mt-4 bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-3">出清结果：</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-500">边际出清价格</div>
                  <div className="text-xl font-bold">{clearingPrice.toFixed(3)} 元/kWh</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">预出清电量</div>
                  <div className="text-xl font-bold">{clearingQuantity} MWh</div>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
      
      {/* 计算过程 */}
      {showResults && (
        <Card title="计算过程">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="space-y-2 text-sm">
              {calculationSteps.map((step, index) => (
                <div key={index}>{step}</div>
              ))}
            </div>
          </div>
        </Card>
      )}
      
      {/* 公式说明 */}
      <Card title="公式说明">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm space-y-2">
            <div className="font-medium">边际电价法核心原理：</div>
            <div>• 售方报价按价格从低到高排序，形成供应曲线</div>
            <div>• 购方报价按价格从高到低排序，形成需求曲线</div>
            <div>• 两条曲线的交点即为边际出清价格（P₀）</div>
            <div>• 所有成交的购售双方均以统一的边际出清价格结算</div>
            <div className="mt-3 font-medium">边界情况处理：</div>
            <div>• 当购方最低价 &gt; 售方最高价时，曲线不相交</div>
            <div>• 使用公式：P₀ = P_Dmin - K × (P_Dmin - P_Smax)，其中 K=0.5</div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default SupplyDemandCurveSimulator;