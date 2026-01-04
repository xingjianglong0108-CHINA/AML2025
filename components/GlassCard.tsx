
import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = "", title }) => {
  return (
    <div className={`ios-glass rounded-2xl p-4 mb-4 shadow-sm ${className}`}>
      {title && <h3 className="text-gray-500 text-xs font-semibold uppercase mb-3 tracking-wider">{title}</h3>}
      {children}
    </div>
  );
};

export default GlassCard;
