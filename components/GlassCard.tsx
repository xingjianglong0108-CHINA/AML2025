
import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = "", title }) => {
  return (
    <div className={`ios-glass rounded-[20px] p-5 mb-4 shadow-[0_4px_12px_rgba(0,0,0,0.03)] ${className}`}>
      {title && <h3 className="text-[#8E8E93] text-[11px] font-bold uppercase mb-4 tracking-[0.05em]">{title}</h3>}
      {children}
    </div>
  );
};

export default GlassCard;
