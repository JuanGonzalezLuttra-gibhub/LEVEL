import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Target, Scale, Zap, Activity } from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const OnboardingWizard = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        weight: '',
        goalMode: 'CALORIES', // 'CALORIES' or 'MACROS'
        targetCalories: 2500,
        protein: 156,
        carbs: 312,
        fats: 69
    });

    const { currentUser, setUserProfile } = useAuth();
    const navigate = useNavigate();

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const calculateCalories = (p, c, f) => (p * 4) + (c * 4) + (f * 9);

    const handleComplete = async () => {
        try {
            const profile = {
                ...formData,
                completedOnboarding: true,
                updatedAt: new Date().toISOString()
            };
            await setDoc(doc(db, 'users', currentUser.uid), profile);
            setUserProfile(profile);
            navigate('/dashboard');
        } catch (error) {
            console.error("Error saving profile:", error);
        }
    };

    return (
        <div className="min-h-screen bg-[#121213] text-white flex flex-col items-center p-6 font-sans">
            <div className="w-full max-w-md flex flex-col h-full">
                {/* Header */}
                <div className="flex justify-between items-center mb-12">
                    <h1 className="text-2xl font-black italic text-[#00BFFF]">LEVEL</h1>
                    <div className="flex space-x-1">
                        {[1, 2, 3].map(i => (
                            <div
                                key={i}
                                className={`h-1 w-8 rounded-full transition-colors ${step >= i ? 'bg-[#00BFFF]' : 'bg-[#2D2D2E]'}`}
                            />
                        ))}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <div>
                                <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">Basic Info</h2>
                                <p className="text-[#666666] text-xs tracking-widest uppercase font-bold">Step 01 / Physical Data</p>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#666666] tracking-[0.2em] uppercase">Your Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="ENTER NAME"
                                        className="w-full bg-transparent border-b-2 border-[#2D2D2E] py-3 text-2xl font-bold focus:outline-none focus:border-[#00BFFF] transition-colors placeholder:text-[#1A1A1B]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#666666] tracking-[0.2em] uppercase">Weight (KG)</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={formData.weight}
                                            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                            placeholder="0.0"
                                            className="w-full bg-transparent border-b-2 border-[#2D2D2E] py-3 text-5xl font-black focus:outline-none focus:border-[#00BFFF] transition-colors placeholder:text-[#1A1A1B]"
                                        />
                                        <Scale className="absolute right-0 bottom-4 text-[#2D2D2E] h-6 w-6" />
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleNext}
                                disabled={!formData.name || !formData.weight}
                                className="w-full bg-[#00BFFF] text-black h-16 rounded-xl font-black uppercase tracking-widest flex items-center justify-center mt-10 shadow-[0_0_30px_rgba(0,191,255,0.2)]"
                            >
                                PROCEED <ChevronRight className="ml-2 h-5 w-5" />
                            </button>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <div>
                                <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">Objective</h2>
                                <p className="text-[#666666] text-xs tracking-widest uppercase font-bold">Step 02 / Tracking Mode</p>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <button
                                    onClick={() => setFormData({ ...formData, goalMode: 'CALORIES' })}
                                    className={`p-6 rounded-2xl border-2 transition-all text-left flex flex-col justify-between h-40 ${formData.goalMode === 'CALORIES' ? 'border-[#00BFFF] bg-[#1A1A1B]' : 'border-[#2D2D2E] bg-transparent opacity-50'}`}
                                >
                                    <Zap className={formData.goalMode === 'CALORIES' ? 'text-[#00BFFF]' : 'text-white'} />
                                    <div>
                                        <h3 className="font-black text-xl uppercase italic">Calories</h3>
                                        <p className="text-[10px] text-[#666666] uppercase font-bold">Fast & Efficient Tracking</p>
                                    </div>
                                </button>

                                <button
                                    onClick={() => setFormData({ ...formData, goalMode: 'MACROS' })}
                                    className={`p-6 rounded-2xl border-2 transition-all text-left flex flex-col justify-between h-40 ${formData.goalMode === 'MACROS' ? 'border-[#00BFFF] bg-[#1A1A1B]' : 'border-[#2D2D2E] bg-transparent opacity-50'}`}
                                >
                                    <Target className={formData.goalMode === 'MACROS' ? 'text-[#00BFFF]' : 'text-white'} />
                                    <div>
                                        <h3 className="font-black text-xl uppercase italic">Macros</h3>
                                        <p className="text-[10px] text-[#666666] uppercase font-bold">Precision Performance Gear</p>
                                    </div>
                                </button>
                            </div>

                            <div className="flex space-x-4 mt-6">
                                <button onClick={handleBack} className="h-16 w-16 border-2 border-[#2D2D2E] rounded-xl flex items-center justify-center">
                                    <ChevronLeft />
                                </button>
                                <button onClick={handleNext} className="flex-1 bg-[#00BFFF] text-black h-16 rounded-xl font-black uppercase tracking-widest flex items-center justify-center">
                                    NEXT PHASE
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <div>
                                <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">Config</h2>
                                <p className="text-[#666666] text-xs tracking-widest uppercase font-bold">Step 03 / {formData.goalMode} Targets</p>
                            </div>

                            {formData.goalMode === 'CALORIES' ? (
                                <div className="space-y-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-[#666666] tracking-[0.2em] uppercase">Daily Target</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={formData.targetCalories}
                                                onChange={(e) => setFormData({ ...formData, targetCalories: e.target.value })}
                                                className="w-full bg-transparent border-b-2 border-[#2D2D2E] py-3 text-6xl font-black focus:outline-none focus:border-[#00BFFF] transition-colors"
                                            />
                                            <span className="absolute right-0 bottom-4 text-[10px] font-black text-[#666666]">KCAL</span>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-[#1A1A1B] rounded-xl border border-[#2D2D2E]">
                                        <p className="text-[10px] font-black text-[#666666] uppercase mb-3">Default Split (50/25/25)</p>
                                        <div className="h-2 flex w-full rounded-full overflow-hidden">
                                            <div className="h-full bg-[#00BFFF]" style={{ width: '50%' }}></div>
                                            <div className="h-full bg-white" style={{ width: '25%' }}></div>
                                            <div className="h-full bg-[#666666]" style={{ width: '25%' }}></div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-[#00BFFF] tracking-[0.2em] uppercase">Protein (G)</label>
                                        <input
                                            type="number"
                                            value={formData.protein}
                                            onChange={(e) => setFormData({ ...formData, protein: Number(e.target.value) })}
                                            className="w-full bg-[#1A1A1B] border border-[#2D2D2E] p-4 rounded-xl text-2xl font-black focus:outline-none focus:border-[#00BFFF]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-white tracking-[0.2em] uppercase">Carbs (G)</label>
                                        <input
                                            type="number"
                                            value={formData.carbs}
                                            onChange={(e) => setFormData({ ...formData, carbs: Number(e.target.value) })}
                                            className="w-full bg-[#1A1A1B] border border-[#2D2D2E] p-4 rounded-xl text-2xl font-black focus:outline-none focus:border-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-[#666666] tracking-[0.2em] uppercase">Fats (G)</label>
                                        <input
                                            type="number"
                                            value={formData.fats}
                                            onChange={(e) => setFormData({ ...formData, fats: Number(e.target.value) })}
                                            className="w-full bg-[#1A1A1B] border border-[#2D2D2E] p-4 rounded-xl text-2xl font-black focus:outline-none focus:border-[#666666]"
                                        />
                                    </div>
                                    <div className="text-center pt-4">
                                        <p className="text-[10px] font-black text-[#666666] uppercase mb-1">Total Calculated</p>
                                        <p className="text-4xl font-black text-[#00BFFF] italic">{calculateCalories(formData.protein, formData.carbs, formData.fats)} KCAL</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex space-x-4 mt-6">
                                <button onClick={handleBack} className="h-16 w-16 border-2 border-[#2D2D2E] rounded-xl flex items-center justify-center">
                                    <ChevronLeft />
                                </button>
                                <button onClick={handleComplete} className="flex-1 bg-[#00BFFF] text-black h-16 rounded-xl font-black uppercase tracking-widest flex items-center justify-center shadow-[0_0_30px_rgba(0,191,255,0.4)]">
                                    INITIALIZE SYSTEM
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default OnboardingWizard;
