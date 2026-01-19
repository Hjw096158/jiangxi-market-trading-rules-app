import fs from 'fs';
import path from 'path';

// 验证JSON文件格式
function validateJson(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        JSON.parse(content);
        console.log(`${path.basename(filePath)} 格式正确`);
        return true;
    } catch (error) {
        console.error(`${path.basename(filePath)} 格式错误:`, error.message);
        return false;
    }
}

// 验证两个JSON文件
const questionsPath = path.join(process.cwd(), 'src', 'data', 'questions.json');
const levelsPath = path.join(process.cwd(), 'src', 'data', 'levels.json');

const isQuestionsValid = validateJson(questionsPath);
const isLevelsValid = validateJson(levelsPath);

if (isQuestionsValid && isLevelsValid) {
    console.log('所有JSON文件格式都正确');
} else {
    console.log('部分JSON文件格式错误');
}
