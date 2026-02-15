import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { LogOut, Activity, Flame, Zap, Dumbbell } from 'lucide-react';

const NutritionDashboard = () => {
    const { userProfile, logout } = useAuth();

    if (!userProfile) return null;

    const target = userProfile.goalMode === 'CALORIES' ? userProfile.targetCalories : (userProfile.protein * 4 + userProfile.carbs * 4 + userProfile.fats * 9);

    // Simulated current progress for UI demo
    const current = Math.floor(target * 0.6);
    const percentage = Math.round((current / target) * 100);

    return (
        <div className="min-h-screen bg-[#121213] text-white flex flex-col font-sans pb-24">
            {/* Header */}
            <div className="p-6 flex justify-between items-start">
                <div>
                    <p className="text-[10px] font-black text-[#666666] tracking-[0.2em] uppercase underline decoration-[#00BFFF] decoration-2 underline-offset-4 mb-2">System Active</p>
                    <h1 className="text-3xl font-black uppercase tracking-tighter">Unit: {userProfile.name}</h1>
                </div>
                <button onClick={logout} className="p-2 bg-[#1A1A1B] border border-[#2D2D2E] rounded-lg">
                    <LogOut className="h-5 w-5 text-[#666666]" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 space-y-8 no-scrollbar">
                {/* Main Calorie Ring */}
                <div className="flex justify-center py-6">
                    <div className="relative h-64 w-64 flex items-center justify-center">
                        {/* Background Circle */}
                        <svg className="absolute h-full w-full -rotate-90">
                            <circle cx="128" cy="128" r="110" fill="none" stroke="#1A1A1B" strokeWidth="20" />
                            <motion.circle
                                cx="128" cy="128" r="110" fill="none" stroke="#00BFFF" strokeWidth="20"
                                strokeDasharray="691"
                                initial={{ strokeDashoffset: 691 }}
                                animate={{ strokeDashoffset: 691 - (691 * (current / target)) }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="text-center z-10">
                            <Flame className="mx-auto h-6 w-6 text-[#00BFFF] mb-1" />
                            <p className="text-5xl font-black italic">{current}</p>
                            <p className="text-[10px] font-black text-[#666666] tracking-[0.2em] uppercase">KCAL / {target}</p>
                        </div>
                        {/* Pulse effect */}
                        <div className="absolute h-64 w-64 rounded-full border border-[#00BFFF] opacity-10 animate-ping"></div>
                    </div>
                </div>

                {/* Macro Indicators */}
                <div className="grid grid-cols-1 gap-4">
                    <MacroCard
                        label="Protein"
                        current={Math.floor(userProfile.protein * 0.5 || 75)}
                        target={userProfile.protein || (target * 0.25 / 4)}
                        color="#00BFFF"
                        icon={<Zap className="h-4 w-4" />}
                    />
                    <MacroCard
                        label="Carbs"
                        current={Math.floor(userProfile.carbs * 0.4 || 120)}
                        target={userProfile.carbs || (target * 0.5 / 4)}
                        color="#FFFFFF"
                        icon={<Activity className="h-4 w-4" />}
                    />
                    <MacroCard
                        label="Fats"
                        current={Math.floor(userProfile.fats * 0.7 || 45)}
                        target={userProfile.fats || (target * 0.25 / 9)}
                        color="#666666"
                        icon={<Flame className="h-4 w-4" />}
                    />
                </div>

                {/* Next Training Section */}
                <div className="premium-card bg-gradient-to-br from-[#1A1A1B] to-[#121213] border-l-4 border-l-[#00BFFF]">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-black uppercase italic text-sm tracking-wider">Upcoming Session</h3>
                        <span className="text-[10px] font-black bg-[#2D2D2E] px-2 py-1 rounded uppercase">Coming Soon</span>
                    </div>
                    <div className="flex items-center space-x-4 opacity-40">
                        <div className="h-12 w-12 bg-[#2D2D2E] rounded-full flex items-center justify-center">
                            <Dumbbell className="text-[#00BFFF]" />
                        </div>
                        <div>
                            <p className="font-black text-sm uppercase">Strength / Hypertrophy</p>
                            <p className="text-[10px] text-[#666666] uppercase font-bold">Protocol Alpha-01</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="fixed bottom-0 left-0 right-0 glass h-20 flex items-center justify-around border-t border-[#2D2D2E] px-6">
                <button className="flex flex-col items-center space-y-1 text-[#00BFFF]">
                    <Activity className="h-6 w-6" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Nutrition</span>
                </button>
                <button className="flex flex-col items-center space-y-1 text-[#666666] opacity-50">
                    <Dumbbell className="h-6 w-6" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Training</span>
                </button>
            </div>
        </div>
    );
};

const MacroCard = ({ label, current, target, color, icon }) => (
    <div className="bg-[#1A1A1B] border border-[#2D2D2E] rounded-2xl p-4 flex items-center space-x-4">
        <div className="h-10 w-10 flex items-center justify-center border border-[#2D2D2E] rounded-xl" style={{ color }}>
            {icon}
        </div>
        <div className="flex-1">
            <div className="flex justify-between items-baseline mb-2">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-[#666666]">{label}</h4>
                <p className="text-xs font-black uppercase tracking-tighter">
                    {current}g <span className="text-[#666666]">/ {Math.round(target)}g</span>
                </p>
            </div>
            <div className="h-1.5 w-full bg-[#121213] rounded-full overflow-hidden">
                <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((current / target) * 100, 100)}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                />
            </div>
        </div>
    </div>
);

export default NutritionDashboard;
