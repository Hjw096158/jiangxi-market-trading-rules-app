import fs from 'fs';

const content = fs.readFileSync('# 江西电力市场规则学习应用 - 题库.txt', 'utf-8');
const idRegex = /\*\*L(\d+)-(\d+)-(\w+)-(\d{3})\*\*/g;
const ids = [];
let match;

while ((match = idRegex.exec(content)) !== null) {
    ids.push(match[0]);
}

console.log(`共找到 ${ids.length} 道题`);
console.log('前20道题:', ids.slice(0, 20));
console.log('后20道题:', ids.slice(-20));
