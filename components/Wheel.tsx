import React, { useState, useEffect, useCallback } from 'react';
import { MenuItem, CategoryType } from '../types';
import { Loader2 } from 'lucide-react';

interface Props {
  items: MenuItem[];
  category: CategoryType;
  onSpinEnd: (item: MenuItem) => void;
  isSpinning: boolean;
}

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#8b5cf6'];

const Wheel: React.FC<Props> = ({ items, category, onSpinEnd, isSpinning }) => {
  const [displayItem, setDisplayItem] = useState<MenuItem | null>(items[0] || null);
  const [localSpinning, setLocalSpinning] = useState(false);
  
  const categoryLabel = {
    main_dish: "จานหลัก",
    snack: "ของว่าง",
    drink: "เครื่องดื่ม"
  }[category];

  const categoryColor = {
    main_dish: "bg-orange-100 text-orange-800 border-orange-200",
    snack: "bg-yellow-100 text-yellow-800 border-yellow-200",
    drink: "bg-blue-100 text-blue-800 border-blue-200"
  }[category];

  useEffect(() => {
    if (isSpinning && items.length > 0) {
      setLocalSpinning(true);
      const interval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * items.length);
        setDisplayItem(items[randomIndex]);
      }, 100); // Fast cycle

      // Stop after random time between 1s and 2s
      const stopTime = 1000 + Math.random() * 1000;
      
      const timeout = setTimeout(() => {
        clearInterval(interval);
        const finalIndex = Math.floor(Math.random() * items.length);
        const selected = items[finalIndex];
        setDisplayItem(selected);
        setLocalSpinning(false);
        onSpinEnd(selected);
      }, stopTime);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [isSpinning, items, onSpinEnd]);

  if (items.length === 0) {
    return (
      <div className="h-40 flex items-center justify-center bg-gray-100 rounded-xl border-2 border-dashed border-gray-300">
        <Loader2 className="animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className={`relative flex flex-col items-center justify-center p-6 rounded-2xl border-4 transition-all duration-300 ${isSpinning ? 'scale-95 border-emerald-400' : 'scale-100 border-white shadow-lg bg-white'}`}>
      <span className={`absolute -top-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${categoryColor}`}>
        {categoryLabel}
      </span>
      
      <div className="text-center space-y-2 h-24 flex flex-col justify-center">
        {localSpinning ? (
           <div className="animate-pulse blur-[1px]">
             <h3 className="text-xl font-bold text-gray-800 line-clamp-2">{displayItem?.name_th}</h3>
             <p className="text-xs text-gray-400">Spinning...</p>
           </div>
        ) : (
          <>
            <h3 className="text-lg md:text-xl font-bold text-gray-800 line-clamp-2 leading-tight">
              {displayItem?.name_th || "Ready"}
            </h3>
            <p className="text-sm text-gray-500 line-clamp-1">{displayItem?.name_en}</p>
          </>
        )}
      </div>

      <div className="mt-2 flex gap-2">
        {displayItem && !localSpinning && (
          <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${
            displayItem.type_tag === 'healthy' ? 'bg-green-100 text-green-700' : 
            displayItem.type_tag === 'high_calorie' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
          }`}>
             {displayItem.calories_kcal} kcal
          </span>
        )}
      </div>
    </div>
  );
};

export default Wheel;