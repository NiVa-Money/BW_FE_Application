import React from 'react';

interface PerformanceMeterProps {
  percentage: number;
  type?: 'resolved' | 'unresolved';
}

const PerformanceMeter: React.FC<PerformanceMeterProps> = ({
  percentage,
  type = 'resolved',
}) => {
  const getColorClass = () => {
    if (type === 'resolved') {
      return 'bg-[#08071c]';
    } else {
      if (percentage >= 50) return 'bg-[#B3261E]';
      if (percentage >= 30) return 'bg-[#EFB8C8]';
      return 'bg-[#65558f]';
    }
  };

  const progressBarClass = `absolute top-0 left-0 h-full rounded-full ${getColorClass()}`;

  const getPercentageClass = () => {
    if (type === 'unresolved') {
      if (percentage >= 50) return 'bg-[#B3261E] text-white';
      if (percentage >= 30) return 'bg-[#EFB8C8] text-[#08071c]';
    }
    return 'text-[#65558f]';
  };

  const percentageClass = `text-sm font-medium rounded-md px-1.5 py-0.5 ${getPercentageClass()}`;

  return (
    <div className="flex items-center gap-2">
      {type === 'resolved' && (
        <div className="relative h-2 w-16 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={progressBarClass}
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
      <span className={percentageClass}>{percentage}%</span>
    </div>
  );
};

export default PerformanceMeter;
