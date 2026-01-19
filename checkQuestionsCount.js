import fs from 'fs';
import path from 'path';

// 检查questions.json文件中的题目数量
const questionsPath = path.join(process.cwd(), 'src', 'data', 'questions.json');
const questions = JSON.parse(fs.readFileSync(questionsPath, 'utf-8'));

console.log(`questions.json 包含 ${questions.length} 道题目`);
