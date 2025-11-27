import React, { useState, useEffect, useCallback } from 'react';
import { MenuDatabase, MenuItem, UserProfile as UserProfileType, SelectionState, AdvisorResponse, UIContent } from './types';
import { generateMenuDatabase, generateAdvisorAnalysis, generateUICopy } from './services/geminiService';
import { DEFAULT_USER_PROFILE, FALLBACK_UI } from './constants';
import UserProfile from './components/UserProfile';
import Wheel from './components/Wheel';
import MenuCard from './components/MenuCard';
import AdvisorPanel from './components/AdvisorPanel';
import { Settings, Utensils, RefreshCw, ChevronRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const App: React.FC = () => {
  // State
  const [db, setDb] = useState<MenuDatabase | null>(null);
  const [profile, setProfile] = useState<UserProfileType>(DEFAULT_USER_PROFILE);
  const [selection, setSelection] = useState<SelectionState>({ main_dish: null, snack: null, drink: null });
  const [advisorAnalysis, setAdvisorAnalysis] = useState<AdvisorResponse | null>(null);
  const [uiCopy, setUiCopy] = useState<UIContent>(FALLBACK_UI);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // Loading States
  const [isDbLoading, setIsDbLoading] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Initialize
  useEffect(() => {
    const init = async () => {
      const [fetchedDb, fetchedUi] = await Promise.all([
        generateMenuDatabase(),
        generateUICopy()
      ]);
      setDb(fetchedDb);
      setUiCopy(fetchedUi);
      setIsDbLoading(false);
    };
    init();
  }, []);

  const handleSpinAll = () => {
    if (!db || isSpinning) return;
    
    setIsSpinning(true);
    setAdvisorAnalysis(null); // Reset analysis on new spin

    // Logic is handled inside Wheel components via props, but we need to track completion
    // The Wheel components will call onSpinEnd after their animation
  };

  const handleSpinEnd = useCallback((category: keyof SelectionState, item: MenuItem) => {
    setSelection(prev => {
      const newSelection = { ...prev, [category]: item };
      // Check if all are set (simplified check, in reality race conditions might exist but for this UI simple is fine)
      return newSelection;
    });
    
    // In a real app we'd count how many wheels finished, here we just unset spinning after a delay
    // Assuming the longest spin is ~3s
    setTimeout(() => setIsSpinning(false), 3000); 
  }, []);

  const handleAnalyze = async () => {
    if (!selection.main_dish || !selection.snack || !selection.drink || !db) return;
    
    setIsAnalyzing(true);
    
    // Collect alternatives for context
    const alternatives = [
      ...db.categories.main_dish.slice(0, 3),
      ...db.categories.snack.slice(0, 2),
      ...db.categories.drink.slice(0, 2)
    ];

    const result = await generateAdvisorAnalysis(
      profile, 
      { main_dish: selection.main_dish, snack: selection.snack, drink: selection.drink },
      alternatives
    );
    
    setAdvisorAnalysis(result);
    setIsAnalyzing(false);
  };

  // Chart Data Preparation
  const totalCalories = (selection.main_dish?.calories_kcal || 0) + (selection.snack?.calories_kcal || 0) + (selection.drink?.calories_kcal || 0);
  const totalSugar = (selection.main_dish?.sugar_g || 0) + (selection.snack?.sugar_g || 0) + (selection.drink?.sugar_g || 0);
  
  const chartData = [
    { name: 'Main', value: selection.main_dish?.calories_kcal || 0, color: '#f97316' },
    { name: 'Snack', value: selection.snack?.calories_kcal || 0, color: '#eab308' },
    { name: 'Drink', value: selection.drink?.calories_kcal || 0, color: '#3b82f6' },
  ].filter(d => d.value > 0);

  return (
    <div className="min-h-screen bg-green-50/50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
             <div className="bg-emerald-500 text-white p-2 rounded-lg">
               <Utensils size={24} />
             </div>
             <div>
               <h1 className="text-xl font-bold text-gray-800 leading-none">NutriWheel</h1>
               <span className="text-xs text-gray-500">AI Food Randomizer</span>
             </div>
          </div>
          <button 
            onClick={() => setIsProfileOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
          >
            <Settings size={24} />
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        
        {/* Loading Initial Data */}
        {isDbLoading ? (
           <div className="text-center py-20">
             <RefreshCw className="animate-spin mx-auto text-emerald-500 mb-4" size={40} />
             <h2 className="text-xl font-medium text-gray-600">Generating Menu Database...</h2>
           </div>
        ) : !db ? (
           <div className="text-center text-red-500">Failed to load data. Please check API Key.</div>
        ) : (
          <>
            {/* Action Area */}
            <div className="grid md:grid-cols-3 gap-6">
               <Wheel 
                 items={db.categories.main_dish} 
                 category="main_dish" 
                 onSpinEnd={(item) => handleSpinEnd('main_dish', item)}
                 isSpinning={isSpinning}
               />
               <Wheel 
                 items={db.categories.snack} 
                 category="snack" 
                 onSpinEnd={(item) => handleSpinEnd('snack', item)}
                 isSpinning={isSpinning}
               />
               <Wheel 
                 items={db.categories.drink} 
                 category="drink" 
                 onSpinEnd={(item) => handleSpinEnd('drink', item)}
                 isSpinning={isSpinning}
               />
            </div>

            {/* Controls */}
            <div className="flex justify-center py-4">
              <button 
                onClick={handleSpinAll}
                disabled={isSpinning || isAnalyzing}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-bold px-12 py-4 rounded-full shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100 flex items-center gap-3"
              >
                <RefreshCw size={24} className={isSpinning ? "animate-spin" : ""} />
                {isSpinning ? "Spinning..." : uiCopy.buttons.spin_all}
              </button>
            </div>

            {/* Results & Analysis Grid */}
            <div className="grid lg:grid-cols-2 gap-8">
              
              {/* Left Column: Menu Details & Stats */}
              <div className="space-y-6">
                
                {/* Selected Items List */}
                {selection.main_dish && (
                  <div className="space-y-4">
                     <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                       <ChevronRight size={20} className="text-emerald-500" /> มื้ออาหารของคุณ
                     </h3>
                     {selection.main_dish && <MenuCard item={selection.main_dish} />}
                     {selection.snack && <MenuCard item={selection.snack} />}
                     {selection.drink && <MenuCard item={selection.drink} />}
                  </div>
                )}

                {/* Quick Stats Chart */}
                {totalCalories > 0 && (
                   <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                     <h3 className="text-lg font-bold text-gray-700 mb-4">สรุปโภชนาการ</h3>
                     <div className="flex items-center">
                        <div className="h-40 w-40 relative">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={chartData}
                                innerRadius={40}
                                outerRadius={60}
                                paddingAngle={5}
                                dataKey="value"
                              >
                                {chartData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                             <span className="text-lg font-bold text-gray-800">{totalCalories}</span>
                             <span className="text-[10px] text-gray-400">kcal</span>
                          </div>
                        </div>
                        <div className="ml-6 space-y-2 flex-1">
                           <div className="flex justify-between items-center text-sm">
                             <span className="text-gray-500">Total Sugar</span>
                             <span className={`font-bold ${totalSugar > 24 ? 'text-red-500' : 'text-green-600'}`}>
                               {totalSugar}g
                             </span>
                           </div>
                           <div className="w-full bg-gray-200 rounded-full h-1.5">
                             <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${Math.min((totalSugar/50)*100, 100)}%` }}></div>
                           </div>
                           <p className="text-xs text-gray-400 mt-1">
                             *Recommended daily sugar limit ~24g
                           </p>
                        </div>
                     </div>
                   </div>
                )}
              </div>

              {/* Right Column: Advisor */}
              <div className="lg:sticky lg:top-24 h-fit">
                <AdvisorPanel 
                  analysis={advisorAnalysis} 
                  loading={isAnalyzing} 
                  onAnalyze={handleAnalyze}
                  canAnalyze={!!(selection.main_dish && selection.snack && selection.drink)}
                />
              </div>

            </div>
          </>
        )}
      </main>

      <UserProfile 
        profile={profile} 
        setProfile={setProfile} 
        isOpen={isProfileOpen} 
        setIsOpen={setIsProfileOpen} 
      />
    </div>
  );
};

export default App;