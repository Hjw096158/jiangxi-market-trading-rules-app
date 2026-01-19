import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  hoverEffect?: boolean;
  variant?: 'default' | 'elevated' | 'outlined';
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  icon,
  onClick,
  className = '',
  hoverEffect = true,
  variant = 'default'
}) => {
  // 变体样式
  const variantClasses = {
    default: 'bg-white',
    elevated: 'bg-white shadow-md hover:shadow-lg transition-shadow',
    outlined: 'bg-white border border-gray-200'
  };

  return (
    <motion.div
      whileHover={hoverEffect ? { y: -5 } : {}}
      transition={{ duration: 0.2 }}
      className={`
        rounded-xl overflow-hidden
        ${variantClasses[variant]}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {/* 头部 */}
      {(title || subtitle || icon) && (
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            {icon && <div className="text-xl">{icon}</div>}
            <div>
              {title && <h3 className="font-semibold text-lg">{title}</h3>}
              {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
            </div>
          </div>
        </div>
      )}

      {/* 内容 */}
      <div className="p-4">{children}</div>
    </motion.div>
  );
};

export default Card;