import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from './Button';

interface QuestionCardProps {
  question: any;
  onAnswer: (isCorrect: boolean) => void;
  onNext: () => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onAnswer, onNext }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | string[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // 当question属性变化时，重置组件内部状态
  useEffect(() => {
    setSelectedAnswer([]);
    setIsAnswered(false);
    setIsCorrect(false);
  }, [question]);

  // 处理单选答案选择
  const handleSingleChoiceChange = (option: string) => {
    if (!isAnswered) {
      setSelectedAnswer(option);
    }
  };

  // 处理多选答案选择
  const handleMultipleChoiceChange = (option: string) => {
    if (!isAnswered) {
      setSelectedAnswer((prev) => {
        const prevArray = Array.isArray(prev) ? prev : [prev];
        if (prevArray.includes(option)) {
          return prevArray.filter((item) => item !== option);
        } else {
          return [...prevArray, option];
        }
      });
    }
  };

  // 处理判断答案选择
  const handleTrueFalseChange = (option: string) => {
    if (!isAnswered) {
      setSelectedAnswer(option);
    }
  };

  // 提交答案
  const handleSubmit = () => {
    if (!isAnswered) {
      let correct = false;
      if (Array.isArray(question.answer)) {
        // 多选题
        const selectedArray = Array.isArray(selectedAnswer) ? selectedAnswer : [selectedAnswer];
        correct = selectedArray.length === question.answer.length && 
                 selectedArray.every((option) => question.answer.includes(option));
      } else {
        // 单选题或判断题
        correct = selectedAnswer === question.answer;
      }
      setIsAnswered(true);
      setIsCorrect(correct);
      onAnswer(correct);
    }
  };

  // 检查选项是否被选中
  const isOptionSelected = (option: string) => {
    if (Array.isArray(selectedAnswer)) {
      return selectedAnswer.includes(option);
    } else {
      return selectedAnswer === option;
    }
  };

  // 检查选项是否正确
  const isOptionCorrect = (option: string) => {
    if (isAnswered) {
      return question.answer.includes(option);
    }
    return false;
  };

  // 检查选项是否错误
  const isOptionWrong = (option: string) => {
    if (isAnswered && isOptionSelected(option) && !question.answer.includes(option)) {
      return true;
    }
    return false;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      {/* 题目信息 */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-500">
            {question.type === 'single_choice' && '单选题'}
            {question.type === 'multiple_choice' && '多选题'}
            {question.type === 'true_false' && '判断题'}
            {question.type === 'calculation' && '计算题'}
            {question.type === 'case_study' && '案例题'}
          </span>
          <span className="text-sm font-medium text-gray-500">
            难度：{question.difficulty === 'easy' && '★'}
            {question.difficulty === 'medium' && '★★'}
            {question.difficulty === 'hard' && '★★★'}
          </span>
        </div>
        <h3 className="text-lg font-semibold mb-4">{question.question}</h3>
      </div>

      {/* 选项 */}
      <div className="mb-6 space-y-3">
        {/* 为判断题生成正确/错误选项 */}
        {question.type === 'true_false' ? (
          [
            { letter: 'true', text: '正确' },
            { letter: 'false', text: '错误' }
          ].map((option, index) => (
            <div key={index} className="relative">
              <input
                type="radio"
                id={`option-${index}`}
                name="question-option"
                checked={isOptionSelected(option.letter)}
                onChange={() => handleTrueFalseChange(option.letter)}
                disabled={isAnswered}
                className="hidden"
              />
              <label
                htmlFor={`option-${index}`}
                className={`
                  block p-4 rounded-lg border cursor-pointer transition-all
                  ${isOptionSelected(option.letter) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
                  ${isAnswered && isOptionCorrect(option.letter) ? 'border-green-500 bg-green-50' : ''}
                  ${isAnswered && isOptionWrong(option.letter) ? 'border-red-500 bg-red-50' : ''}
                `}
              >
                <div className="flex items-center">
                  <div className={`
                    w-6 h-6 rounded-full flex items-center justify-center mr-3
                    ${isOptionSelected(option.letter) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}
                    ${isAnswered && isOptionCorrect(option.letter) ? 'bg-green-500 text-white' : ''}
                    ${isAnswered && isOptionWrong(option.letter) ? 'bg-red-500 text-white' : ''}
                  `}>
                    {isAnswered && isOptionCorrect(option.letter) && '✓'}
                    {isAnswered && isOptionWrong(option.letter) && '✗'}
                    {!isAnswered && index === 0 ? '√' : '×'}
                  </div>
                  <div>{option.text}</div>
                </div>
              </label>
            </div>
          ))
        ) : question.options ? (
          /* 其他类型题目的选项 */
          question.options.map((option: string, index: number) => {
            const optionLetter = option.split('.')[0];
            return (
              <div key={index} className="relative">
                <input
                  type={question.type === 'multiple_choice' ? 'checkbox' : 'radio'}
                  id={`option-${index}`}
                  name="question-option"
                  checked={isOptionSelected(optionLetter)}
                  onChange={() => {
                    if (question.type === 'single_choice') {
                      handleSingleChoiceChange(optionLetter);
                    } else if (question.type === 'multiple_choice') {
                      handleMultipleChoiceChange(optionLetter);
                    }
                  }}
                  disabled={isAnswered}
                  className="hidden"
                />
                <label
                  htmlFor={`option-${index}`}
                  className={`
                    block p-4 rounded-lg border cursor-pointer transition-all
                    ${isOptionSelected(optionLetter) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
                    ${isAnswered && isOptionCorrect(optionLetter) ? 'border-green-500 bg-green-50' : ''}
                    ${isAnswered && isOptionWrong(optionLetter) ? 'border-red-500 bg-red-50' : ''}
                  `}
                >
                  <div className="flex items-center">
                    <div className={`
                      w-6 h-6 rounded-full flex items-center justify-center mr-3
                      ${isOptionSelected(optionLetter) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}
                      ${isAnswered && isOptionCorrect(optionLetter) ? 'bg-green-500 text-white' : ''}
                      ${isAnswered && isOptionWrong(optionLetter) ? 'bg-red-500 text-white' : ''}
                    `}>
                      {isAnswered && isOptionCorrect(optionLetter) && '✓'}
                      {isAnswered && isOptionWrong(optionLetter) && '✗'}
                      {!isAnswered && optionLetter}
                    </div>
                    <div>{option}</div>
                  </div>
                </label>
              </div>
            );
          })
        ) : null}
      </div>

      {/* 提交按钮 */}
      {!isAnswered && (
        <Button variant="primary" onClick={handleSubmit} className="w-full">
          提交答案
        </Button>
      )}

      {/* 答案解析 */}
      {isAnswered && (
        <div className="mt-6 p-4 rounded-lg bg-gray-50 border border-gray-200">
          <div className="flex items-center mb-2">
            <div className={`
              w-6 h-6 rounded-full flex items-center justify-center mr-2
              ${isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}
            `}>
              {isCorrect ? '✓' : '✗'}
            </div>
            <h4 className="font-semibold">
              {isCorrect ? '回答正确！' : '回答错误！'}
            </h4>
          </div>
          <p className="text-sm text-gray-600 mt-2">{question.explanation}</p>
          <div className="mt-4">
            <Button variant="primary" onClick={onNext} className="w-full">
              下一题
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default QuestionCard;