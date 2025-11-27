import React from 'react';
import { MenuItem } from '../types';
import { Flame, Droplet, Wheat, Activity } from 'lucide-react';

interface Props {
  item: MenuItem;
}

const MenuCard: React.FC<Props> = ({ item }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-bold text-gray-900">{item.name_th}</h4>
          <p className="text-xs text-gray-500">{item.name_en}</p>
        </div>
        <div className={`
          w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
          ${item.health_score >= 8 ? 'bg-green-100 text-green-700' : 
            item.health_score >= 5 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}
        `}>
          {item.health_score}
        </div>
      </div>
      
      <p className="text-sm text-gray-600 mb-3">{item.description_th}</p>
      
      <div className="grid grid-cols-4 gap-2 text-xs">
        <div className="flex flex-col items-center bg-orange-50 p-2 rounded-lg">
          <Flame size={14} className="text-orange-500 mb-1" />
          <span className="font-semibold">{item.calories_kcal}</span>
          <span className="text-gray-400">kcal</span>
        </div>
        <div className="flex flex-col items-center bg-blue-50 p-2 rounded-lg">
          <Droplet size={14} className="text-blue-500 mb-1" />
          <span className="font-semibold">{item.sugar_g}g</span>
          <span className="text-gray-400">Sugar</span>
        </div>
        <div className="flex flex-col items-center bg-yellow-50 p-2 rounded-lg">
          <Wheat size={14} className="text-yellow-600 mb-1" />
          <span className="font-semibold">{item.carb_g}g</span>
          <span className="text-gray-400">Carb</span>
        </div>
        <div className="flex flex-col items-center bg-emerald-50 p-2 rounded-lg">
          <Activity size={14} className="text-emerald-500 mb-1" />
          <span className="font-semibold">{item.protein_g}g</span>
          <span className="text-gray-400">Prot</span>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;