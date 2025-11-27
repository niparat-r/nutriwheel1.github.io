import React from 'react';
import { UserProfile as UserProfileType } from '../types';
import { Settings, User, Activity, AlertCircle } from 'lucide-react';

interface Props {
  profile: UserProfileType;
  setProfile: (p: UserProfileType) => void;
  isOpen: boolean;
  setIsOpen: (o: boolean) => void;
}

const UserProfile: React.FC<Props> = ({ profile, setProfile, isOpen, setIsOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="bg-emerald-600 p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <User size={20} />
            <h2 className="font-semibold text-lg">ข้อมูลสุขภาพ (Profile)</h2>
          </div>
          <button onClick={() => setIsOpen(false)} className="hover:bg-emerald-700 p-1 rounded-full">
            Close
          </button>
        </div>
        
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
              <input 
                type="number" 
                value={profile.age} 
                onChange={e => setProfile({...profile, age: Number(e.target.value)})}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select 
                value={profile.gender}
                onChange={e => setProfile({...profile, gender: e.target.value as any})}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
              <input 
                type="number" 
                value={profile.weight_kg} 
                onChange={e => setProfile({...profile, weight_kg: Number(e.target.value)})}
                className="w-full border rounded-lg p-2"
              />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
              <input 
                type="number" 
                value={profile.height_cm} 
                onChange={e => setProfile({...profile, height_cm: Number(e.target.value)})}
                className="w-full border rounded-lg p-2"
              />
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Goal</label>
              <select 
                value={profile.goal}
                onChange={e => setProfile({...profile, goal: e.target.value as any})}
                className="w-full border rounded-lg p-2"
              >
                <option value="weight_loss">Weight Loss (ลดน้ำหนัก)</option>
                <option value="maintain">Maintain (รักษาสุขภาพ)</option>
                <option value="muscle_gain">Muscle Gain (เพิ่มกล้ามเนื้อ)</option>
              </select>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg space-y-2">
            <p className="text-sm font-semibold text-gray-600 flex items-center gap-2">
              <Activity size={16} /> Health Conditions
            </p>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={profile.has_diabetes} 
                onChange={e => setProfile({...profile, has_diabetes: e.target.checked})}
                className="rounded text-emerald-600 focus:ring-emerald-500" 
              />
              <span className="text-sm">Diabetes (เบาหวาน)</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={profile.has_hypertension} 
                onChange={e => setProfile({...profile, has_hypertension: e.target.checked})}
                className="rounded text-emerald-600 focus:ring-emerald-500" 
              />
              <span className="text-sm">Hypertension (ความดันสูง)</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={profile.sensitive_to_caffeine} 
                onChange={e => setProfile({...profile, sensitive_to_caffeine: e.target.checked})}
                className="rounded text-emerald-600 focus:ring-emerald-500" 
              />
              <span className="text-sm">Caffeine Sensitive (แพ้คาเฟอีนง่าย)</span>
            </label>
          </div>
        </div>
        
        <div className="p-4 border-t bg-gray-50 flex justify-end">
          <button 
            onClick={() => setIsOpen(false)}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 transition"
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;