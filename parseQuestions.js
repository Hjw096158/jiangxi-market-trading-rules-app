import fs from 'fs';
import path from 'path';

// 读取题库文件
const filePath = path.join(process.cwd(), '# 江西电力市场规则学习应用 - 题库.txt');
const content = fs.readFileSync(filePath, 'utf-8');

// 解析题目
function parseQuestions() {
    const questions = [];
    
    // 统一换行符为\n
    const normalizedContent = content.replace(/\r\n/g, '\n');
    
    // 提取所有题目编号
    const idRegex = /\*\*L(\d+)-(\d+)-(\w+)-(\d{3})\*\*/g;
    const ids = [];
    let idMatch;
    while ((idMatch = idRegex.exec(normalizedContent)) !== null) {
        ids.push(idMatch[0]);
    }
    
    console.log(`共找到 ${ids.length} 道题目`);
    
    // 逐一解析每个题目
    for (let i = 0; i < ids.length; i++) {
        const startIndex = normalizedContent.indexOf(ids[i]);
        const nextIdIndex = i < ids.length - 1 ? normalizedContent.indexOf(ids[i + 1]) : normalizedContent.length;
        const block = normalizedContent.slice(startIndex, nextIdIndex).trim();
        
        try {
            // 解析题目编号
            const [, levelStr, subLevelStr, typeCode, indexStr] = block.match(/\*\*L(\d+)-(\d+)-(\w+)-(\d{3})\*\*/);
            const level = parseInt(levelStr);
            const subLevel = parseInt(subLevelStr);
            
            // 解析题型
            let type;
            switch (typeCode) {
                case 'SC': type = 'single_choice'; break;
                case 'MC': type = 'multiple_choice'; break;
                case 'TF': type = 'true_false'; break;
                case 'CA': type = 'calculation'; break;
                case 'CS': type = 'case_study'; break;
                default: type = 'other'; break;
            }
            
            // 解析难度
            const difficultyMatch = block.match(/\*\*难度\*\*：(\*+)\n/);
            let difficulty;
            if (difficultyMatch) {
                const stars = difficultyMatch[1].length;
                switch (stars) {
                    case 1: difficulty = 'easy'; break;
                    case 2: difficulty = 'medium'; break;
                    case 3: difficulty = 'hard'; break;
                    default: difficulty = 'medium'; break;
                }
            } else {
                difficulty = 'medium';
            }
            
            // 解析题干
            const questionMatch = block.match(/\*\*题干\*\*：([\s\S]*?)\n\*\*/);
            if (!questionMatch) {
                console.log(`解析题干失败: ${ids[i]}`);
                continue;
            }
            let question = questionMatch[1].trim().replace(/\\$/g, '');
            
            // 解析选项
            let options = [];
            const optionsMatch = block.match(/\*\*选项\*\*：[\s\S]*?(?=\n\*\*答案\*\*)/);
            if (optionsMatch) {
                const optionsStr = optionsMatch[0].replace(/\*\*选项\*\*：\n?/, '');
                options = optionsStr.split('\n- ').filter(opt => opt.trim()).map(opt => opt.trim());
            }
            
            // 解析答案
            let answer;
            if (type === 'case_study') {
                // 案例分析题的答案格式特殊，是详细的文字说明
                const answerMatch = block.match(/\*\*参考答案\*\*：([\s\S]*?)(?=\n\*\*|$)/);
                if (answerMatch) {
                    answer = answerMatch[1].trim().replace(/\\$/g, '');
                } else {
                    // 尝试匹配普通答案格式
                    const answerMatch2 = block.match(/\*\*答案\*\*：([\s\S]*?)(?=\n\*\*|$)/);
                    if (answerMatch2) {
                        answer = answerMatch2[1].trim().replace(/\\$/g, '');
                    } else {
                        console.log(`解析答案失败: ${ids[i]}`);
                        continue;
                    }
                }
            } else {
                // 普通题目的答案
                const answerMatch = block.match(/\*\*答案\*\*：([\s\S]*?)(?=\n\*\*|$)/);
                if (!answerMatch) {
                    console.log(`解析答案失败: ${ids[i]}`);
                    continue;
                }
                answer = answerMatch[1].trim().replace(/\\$/g, '');
                
                // 处理多选题答案
                if (type === 'multiple_choice') {
                    // 处理连续字母的情况，如ABCD拆分为[A, B, C, D]
                    if (/^[A-Z]+$/.test(answer)) {
                        answer = answer.split('').map(char => char);
                    } else {
                        // 处理逗号分隔的情况
                        answer = answer.split(',').map(a => a.trim());
                    }
                }
                
                // 处理判断题答案
                if (type === 'true_false') {
                    answer = answer === '正确' ? 'true' : 'false';
                }
            }
            
            // 解析解析
            let explanation = '';
            const explanationMatch = block.match(/\*\*解析\*\*：([\s\S]*?)(?=\n\*\*|$)/);
            if (explanationMatch) {
                explanation = explanationMatch[1].trim().replace(/\\$/g, '');
            }
            
            // 解析关联模拟器
            let relatedSimulator = '';
            const simulatorMatch = block.match(/\*\*关联模拟器\*\*：([\s\S]*?)(?=\n\*\*|$)/);
            if (simulatorMatch) {
                relatedSimulator = simulatorMatch[1].trim().replace(/\\$/g, '');
            }
            
            // 构建题目对象
            const questionObj = {
                id: `L${level}-${subLevel}-${typeCode}-${indexStr}`,
                level,
                subLevel,
                type,
                difficulty,
                question,
                options: options.length > 0 ? options : undefined,
                answer,
                explanation,
                relatedSimulator
            };
            
            questions.push(questionObj);
        } catch (error) {
            console.log(`解析题目失败: ${ids[i]}, 错误: ${error.message}`);
        }
    }
    
    return questions;
}

// 生成题目数据
const questions = parseQuestions();

// 保存到questions.json
const questionsJsonPath = path.join(process.cwd(), 'src', 'data', 'questions.json');
fs.writeFileSync(questionsJsonPath, JSON.stringify(questions, null, 2), 'utf-8');

console.log(`成功解析 ${questions.length} 道题目`);
console.log(`已保存到 ${questionsJsonPath}`);
