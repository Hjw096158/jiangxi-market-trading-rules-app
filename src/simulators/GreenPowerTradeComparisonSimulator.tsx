import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/Button';
import Card from '../components/Card';

interface ComparisonCategory {
  id: string;
  name: string;
  description: string;
  items: ComparisonItem[];
}

interface ComparisonItem {
  id: string;
  aspect: string;
  greenPower: string;
  normalPower: string;
  greenDescription?: string;
  normalDescription?: string;
}

interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

const GreenPowerTradeComparisonSimulator: React.FC = () => {
  // 模拟器状态
  const [activeCategory, setActiveCategory] = useState('basic');
  const [showDetailedComparison, setShowDetailedComparison] = useState(false);
  
  // 对比分类数据
  const comparisonCategories: ComparisonCategory[] = [
    {
      id: 'basic',
      name: '基本特征',
      description: '绿电交易与普通电力交易的基本区别',
      items: [
        {
          id: 'basic-1',
          aspect: '交易标的物',
          greenPower: '电力+绿证',
          normalPower: '仅电力',
          greenDescription: '绿电交易包含电力商品和相应的绿色属性证书',
          normalDescription: '普通电力交易仅包含电力商品本身'
        },
        {
          id: 'basic-2',
          aspect: '价格构成',
          greenPower: '电力价格+绿色溢价',
          normalPower: '仅电力价格',
          greenDescription: '绿电价格包含电力基础价格和反映绿色属性的溢价部分',
          normalDescription: '普通电力价格由市场供需和成本决定'
        },
        {
          id: 'basic-3',
          aspect: '交易目的',
          greenPower: '清洁能源消费+碳减排',
          normalPower: '满足用电需求',
          greenDescription: '绿电交易用于实现清洁能源消费和碳减排目标',
          normalDescription: '普通电力交易主要用于满足基本用电需求'
        }
      ]
    },
    {
      id: 'process',
      name: '交易流程',
      description: '绿电交易与普通电力交易的流程差异',
      items: [
        {
          id: 'process-1',
          aspect: '申报环节',
          greenPower: '需注明绿色属性',
          normalPower: '无需特殊标记',
          greenDescription: '绿电交易申报时需明确注明绿色电力属性',
          normalDescription: '普通电力交易无需特殊标记'
        },
        {
          id: 'process-2',
          aspect: '结算环节',
          greenPower: '电力结算+证书核发',
          normalPower: '仅电力结算',
          greenDescription: '绿电交易完成后需同步核发绿证',
          normalDescription: '普通电力交易仅完成电力费用结算'
        },
        {
          id: 'process-3',
          aspect: '监管要求',
          greenPower: '更严格的溯源要求',
          normalPower: '常规监管',
          greenDescription: '绿电交易需满足严格的电力溯源要求',
          normalDescription: '普通电力交易遵循常规监管要求'
        }
      ]
    },
    {
      id: 'certificate',
      name: '证书管理',
      description: '绿证的颁发、使用和注销流程',
      items: [
        {
          id: 'cert-1',
          aspect: '证书颁发',
          greenPower: '自动核发绿证',
          normalPower: '无证书',
          greenDescription: '绿电交易完成后，系统自动为买方核发相应的绿证',
          normalDescription: '普通电力交易不涉及证书颁发'
        },
        {
          id: 'cert-2',
          aspect: '证书用途',
          greenPower: '碳减排证明+政策激励',
          normalPower: '无',
          greenDescription: '绿证可用于碳减排证明和享受相关政策激励',
          normalDescription: '普通电力交易无相关证书'
        },
        {
          id: 'cert-3',
          aspect: '证书注销',
          greenPower: '需在使用后注销',
          normalPower: '无',
          greenDescription: '绿证使用后需按规定流程注销，避免重复使用',
          normalDescription: '普通电力交易无证书注销环节'
        }
      ]
    }
  ];
  
  // 绿电交易特点卡片
  const featureCards: FeatureCard[] = [
    {
      id: 'feature-1',
      title: '双属性交易',
      description: '绿电交易同时包含电力商品和绿色属性，实现了电力的物理消纳和绿色属性的转移',
      icon: '⚡',
      color: 'bg-blue-500'
    },
    {
      id: 'feature-2',
      title: '绿色溢价机制',
      description: '绿电价格包含绿色溢价，反映了清洁能源的环境价值和稀缺性',
      icon: '💰',
      color: 'bg-green-500'
    },
    {
      id: 'feature-3',
      title: '溯源保障',
      description: '绿电交易建立了完善的溯源机制，确保绿色属性的真实性和唯一性',
      icon: '📜',
      color: 'bg-purple-500'
    },
    {
      id: 'feature-4',
      title: '政策支持',
      description: '绿电交易享受国家和地方的政策支持，包括财政补贴、税收优惠等',
      icon: '🏛️',
      color: 'bg-yellow-500'
    }
  ];
  
  // 获取当前分类
  const currentCategory = comparisonCategories.find(cat => cat.id === activeCategory) || comparisonCategories[0];
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center mb-4">5-1 绿电交易特点对比</h2>
      
      {/* 模拟器说明 */}
      <Card className="mb-6">
        <h3 className="text-lg font-semibold mb-4">模拟器说明</h3>
        <p className="text-gray-600 mb-4">
          本模拟器用于对比绿电交易与普通电力交易的特点和区别，帮助您理解绿电交易的核心特征和优势。
          您可以通过切换不同分类查看详细对比，并点击特点卡片了解更多信息。
        </p>
      </Card>
      
      {/* 特点卡片展示 */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-6 text-center">绿电交易核心特点</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featureCards.map(card => (
            <motion.div
              key={card.id}
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <Card className="h-full p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full ${card.color} flex items-center justify-center text-white text-xl font-bold`}>
                    {card.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold mb-2">{card.title}</h4>
                    <p className="text-gray-600">{card.description}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* 对比分类切换 */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4 text-center">绿电交易 vs 普通电力交易</h3>
        <div className="flex justify-center gap-4 mb-6 flex-wrap">
          {comparisonCategories.map(category => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? 'primary' : 'secondary'}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>
        
        {/* 对比内容 */}
        <Card className="mb-4">
          <h4 className="text-lg font-semibold mb-4">{currentCategory.description}</h4>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 p-3 text-left font-semibold text-gray-700">对比维度</th>
                  <th className="border border-gray-200 p-3 text-left font-semibold text-green-700">绿色电力交易</th>
                  <th className="border border-gray-200 p-3 text-left font-semibold text-blue-700">普通电力交易</th>
                </tr>
              </thead>
              <tbody>
                {currentCategory.items.map(item => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="border border-gray-200 p-3 font-medium">{item.aspect}</td>
                    <td className="border border-gray-200 p-3">
                      <div className="font-medium text-green-600">{item.greenPower}</div>
                      {item.greenDescription && (
                        <div className="text-sm text-gray-500 mt-1">{item.greenDescription}</div>
                      )}
                    </td>
                    <td className="border border-gray-200 p-3">
                      <div className="font-medium text-blue-600">{item.normalPower}</div>
                      {item.normalDescription && (
                        <div className="text-sm text-gray-500 mt-1">{item.normalDescription}</div>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        
        {/* 详细对比切换 */}
        <div className="text-center">
          <Button
            variant="secondary"
            onClick={() => setShowDetailedComparison(!showDetailedComparison)}
          >
            {showDetailedComparison ? '收起详细对比' : '查看详细对比'}
          </Button>
        </div>
      </div>
      
      {/* 详细对比内容 */}
      <AnimatePresence>
        {showDetailedComparison && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mb-6">
              <h4 className="text-lg font-semibold mb-4">详细对比分析</h4>
              
              <div className="space-y-6">
                {/* 交易标的物详细对比 */}
                <div className="space-y-3">
                  <h5 className="font-medium text-blue-700">1. 交易标的物构成</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h6 className="font-medium text-green-700 mb-2">绿色电力交易</h6>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        <li>物理电力：满足用电需求</li>
                        <li>绿证：证明清洁能源属性</li>
                        <li>可溯源性：确保绿色属性真实可靠</li>
                        <li>唯一性：一电一证，不可重复使用</li>
                      </ul>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h6 className="font-medium text-blue-700 mb-2">普通电力交易</h6>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        <li>仅物理电力：满足用电需求</li>
                        <li>无绿色属性证明</li>
                        <li>混合电力：无法区分能源类型</li>
                        <li>无额外环境价值</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                {/* 价格机制详细对比 */}
                <div className="space-y-3">
                  <h5 className="font-medium text-blue-700">2. 价格形成机制</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h6 className="font-medium text-green-700 mb-2">绿色电力交易</h6>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        <li>基础电价：与普通电力一致</li>
                        <li>绿色溢价：反映环境价值</li>
                        <li>政策补贴：享受政府支持</li>
                        <li>价格信号：引导清洁能源投资</li>
                      </ul>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h6 className="font-medium text-blue-700 mb-2">普通电力交易</h6>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        <li>市场定价：供需关系决定</li>
                        <li>成本导向：基于发电成本</li>
                        <li>无环境价值体现</li>
                        <li>价格波动：受燃料成本影响大</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                {/* 环境效益详细对比 */}
                <div className="space-y-3">
                  <h5 className="font-medium text-blue-700">3. 环境效益分析</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h6 className="font-medium text-green-700 mb-2">绿色电力交易</h6>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        <li>减少碳排放：替代化石能源发电</li>
                        <li>支持清洁能源发展：增加清洁能源消纳</li>
                        <li>促进碳市场发展：与碳交易协同</li>
                        <li>提升企业ESG表现：增强社会责任感</li>
                      </ul>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h6 className="font-medium text-blue-700 mb-2">普通电力交易</h6>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        <li>碳排放不确定：取决于电网结构</li>
                        <li>无直接环境激励：不区分能源类型</li>
                        <li>市场效率优先：环境因素考虑较少</li>
                        <li>无法证明碳减排：缺乏溯源机制</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 互动练习 */}
      <Card className="mb-6">
        <h3 className="text-lg font-semibold mb-4">互动练习</h3>
        <p className="text-gray-600 mb-4">
          通过以下练习，测试您对绿电交易特点的理解：
        </p>
        
        <div className="space-y-4">
          {/* 练习1 */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">练习1：绿电交易的核心特征是什么？</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="practice-1-1" className="w-4 h-4 text-blue-600" />
                <label htmlFor="practice-1-1" className="text-gray-700">包含电力和绿证双属性</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="practice-1-2" className="w-4 h-4 text-blue-600" />
                <label htmlFor="practice-1-2" className="text-gray-700">仅包含电力属性</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="practice-1-3" className="w-4 h-4 text-blue-600" />
                <label htmlFor="practice-1-3" className="text-gray-700">价格包含绿色溢价</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="practice-1-4" className="w-4 h-4 text-blue-600" />
                <label htmlFor="practice-1-4" className="text-gray-700">与普通电力价格相同</label>
              </div>
            </div>
          </div>
          
          {/* 练习2 */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">练习2：绿电交易的环境效益包括哪些？</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="practice-2-1" className="w-4 h-4 text-blue-600" />
                <label htmlFor="practice-2-1" className="text-gray-700">减少碳排放</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="practice-2-2" className="w-4 h-4 text-blue-600" />
                <label htmlFor="practice-2-2" className="text-gray-700">支持清洁能源发展</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="practice-2-3" className="w-4 h-4 text-blue-600" />
                <label htmlFor="practice-2-3" className="text-gray-700">降低电力成本</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="practice-2-4" className="w-4 h-4 text-blue-600" />
                <label htmlFor="practice-2-4" className="text-gray-700">提升企业ESG表现</label>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <Button variant="primary">
              提交答案
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default GreenPowerTradeComparisonSimulator;