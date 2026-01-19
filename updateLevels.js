import fs from 'fs';
import path from 'path';

// 读取questions.json和levels.json文件
const questionsPath = path.join(process.cwd(), 'src', 'data', 'questions.json');
const levelsPath = path.join(process.cwd(), 'src', 'data', 'levels.json');

const questions = JSON.parse(fs.readFileSync(questionsPath, 'utf-8'));
const levels = JSON.parse(fs.readFileSync(levelsPath, 'utf-8'));

// 遍历每个关卡
for (let level of levels) {
    let totalQuestions = 0;
    
    // 遍历每个section
    for (let section of level.sections) {
        // 根据level和subLevel筛选题目
        const filteredQuestions = questions.filter(q => 
            q.level === level.id && q.subLevel === section.id
        );
        
        // 提取题目ID
        section.questions = filteredQuestions.map(q => q.id);
        
        // 累加题目数量
        totalQuestions += section.questions.length;
    }
    
    // 更新关卡的questionCount
    level.questionCount = totalQuestions;
}

// 保存更新后的levels.json
fs.writeFileSync(levelsPath, JSON.stringify(levels, null, 2), 'utf-8');

console.log('levels.json已更新，添加了正确的题目ID和questionCount');
