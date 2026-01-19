import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../components/Card';

interface CycleItem {
  id: number;
  name: string;
  description: string;
  timeline: string;
  features: string[];
}

const TransactionCycleTimelineSimulator: React.FC = () => {
  // 游戏状态
  const [activeTab, setActiveTab] = useState('all');
  
  // 交易周期数据
  const cycles: CycleItem[] = [
    {
      id: 1,
      name: '年度双边协商交易',
      description: '年度双边协商交易是中长期市场的主要交易方式之一',
      timeline: '每年12月份',
      features: [
        '交易周期为一个日历年',
        '交易双方自主协商确定交易电量、电价等要素',
        '是电力市场交易的基础',
        '占比较大，提供稳定的电量保障'
      ]
    },
    {
      id: 2,
      name: '月度集中竞价交易',
      description: '月度集中竞价交易是月度交易的重要组成部分',
      timeline: '每月25日左右',
      features: [
        '交易周期为一个月',
        '采用边际电价法出清',
        '价格发现功能较强',
        '用于调整月度电量需求'
      ]
    },
    {
      id: 3,
      name: '月内滚动撮合交易',
      description: '月内滚动撮合交易是月度交易的补充',
      timeline: '每月1日至28日',
      features: [
        '交易周期为月内剩余天数',
        '采用"时间优先、价格优先"原则',
        '即时成交，价格为挂牌方价格',
        '用于精细化调整电量'
      ]
    },
    {
      id: 4,
      name: '日前市场交易',
      description: '日前市场交易是现货市场的主要交易方式',
      timeline: '交易日前一天',
      features: [
        '交易周期为次日24小时',
        '按48个时段申报',
        '采用边际电价法出清',
        '用于平衡次日供需'
      ]
    },
    {
      id: 5,
      name: '实时平衡交易',
      description: '实时平衡交易是现货市场的补充',
      timeline: '交易时段前15分钟',
      features: [
        '交易周期为当前时段',
        '用于处理实时偏差',
        '价格波动较大',
        '保障电网实时平衡'
      ]
    }
  ];
  
  // 筛选周期
  const filteredCycles = activeTab === 'all' ? cycles : cycles.filter(cycle => {
    if (activeTab === 'long') {
      return cycle.id <= 3; // 中长期交易
    } else {
      return cycle.id > 3; // 现货交易
    }
  });
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center mb-4">2-2 交易周期时间轴</h2>
      
      {/* 分类标签 */}
      <div className="flex justify-center gap-4 mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeTab === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          全部交易
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('long')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeTab === 'long' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          中长期交易
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('spot')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeTab === 'spot' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          现货交易
        </motion.button>
      </div>
      
      {/* 时间轴 */}
      <div className="relative">
        {/* 时间轴中心线 */}
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-200"></div>
        
        {/* 时间轴节点 */}
        <div className="space-y-12">
          {filteredCycles.map((cycle, index) => (
            <motion.div 
              key={cycle.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative flex ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} items-center`}
            >
              {/* 左侧内容 */}
              <div className={`w-1/2 ${index % 2 === 0 ? 'pr-12 text-right' : 'pl-12 text-left'}`}>
                <Card className="h-full">
                  <h3 className="text-xl font-semibold mb-2">{cycle.name}</h3>
                  <p className="text-gray-600 mb-3">{cycle.description}</p>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">交易时间：</span>
                      <span className="text-blue-600">{cycle.timeline}</span>
                    </div>
                    <div>
                      <span className="font-medium">交易特点：</span>
                      <ul className="list-disc list-inside text-gray-600 mt-1 space-y-1">
                        {cycle.features.map((feature, idx) => (
                          <li key={idx}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              </div>
              
              {/* 中心节点 */}
              <div className="absolute left-1/2 transform -translate-x-1/2 z-10 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                {cycle.id}
              </div>
              
              {/* 右侧内容（空） */}
              <div className="w-1/2"></div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* 交易周期总结 */}
      <Card>
        <h3 className="text-xl font-semibold mb-4">交易周期总结</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2">中长期交易特点：</h4>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>交易周期较长，从月到年不等</li>
              <li>交易双方自主协商或集中竞价</li>
              <li>提供稳定的电量和价格保障</li>
              <li>是电力市场交易的基础</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">现货交易特点：</h4>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>交易周期短，从小时到日</li>
              <li>价格波动较大，反映实时供需</li>
              <li>用于平衡实时电力供需</li>
              <li>采用边际电价法出清</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TransactionCycleTimelineSimulator;
