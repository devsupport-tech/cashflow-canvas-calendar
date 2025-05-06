
import React from 'react';

export const ChartStyles: React.FC = () => {
  const futureDataStyles = `
    .future-income-dashed { stroke-dasharray: 3 3; }
    .future-personal-dashed { stroke-dasharray: 3 3; }
    .future-business-dashed { stroke-dasharray: 3 3; }
  `;

  return <style>{futureDataStyles}</style>;
};
