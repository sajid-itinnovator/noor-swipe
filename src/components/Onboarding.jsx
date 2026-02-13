import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Baby, ArrowRight, Check } from 'lucide-react';
import { saveUser } from '../utils/user_storage';

const Onboarding = ({ onComplete }) => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        profileType: 'adult',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDF1skqy1lwoMBsZrtneEY5yEZ7CEdyD0tETAI4kgQyMeDQwsWKMRNlIytDY_dqLg2oGZ7C_1n-B_VBqkUdv-vOWYM3IKDwSh0acQKDbrP1iFCTVbJqTwz0iDbufFnqyoRbuuva9c_XL1Nnyi87I_BoWOgLH3FdSyT5_2ycB1_HDECHeu7z6JuTTMM5e6unFFHLGBUB7W8zWjkPkf8CYmpv3OJ-CGp9fRxk0rePo1fZaisdhvepTFbsGtaQVysLkA5flLrpHhOK4Sw'
    });

    const avatars = [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDF1skqy1lwoMBsZrtneEY5yEZ7CEdyD0tETAI4kgQyMeDQwsWKMRNlIytDY_dqLg2oGZ7C_1n-B_VBqkUdv-vOWYM3IKDwSh0acQKDbrP1iFCTVbJqTwz0iDbufFnqyoRbuuva9c_XL1Nnyi87I_BoWOgLH3FdSyT5_2ycB1_HDECHeu7z6JuTTMM5e6unFFHLGBUB7W8zWjkPkf8CYmpv3OJ-CGp9fRxk0rePo1fZaisdhvepTFbsGtaQVysLkA5flLrpHhOK4Sw",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBNi_u9yy9mJQXJshKVUmM5Xr5F-E4atyWBeNzlcvK3Hxd6k5GGxyT9hiuZdMcLsv9GaEA9I4srGBgaBQDdEyNPH148SCp8ig4IsARIzPcmHgMZxM-Whnirtg2jBfVfgxBpmUAP3LUsbirp2uLkFPK_ovdRWOEDgoqy0Z9z_jCyNT80QMV2ls-LICG9JPuJtz0VqZivF_mvCnLRtHKkLCvkEq7UxWocifll5wlDycUjk2N2kp3X8rU8JySuT-gZLFwJB1ABceCplSE",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuD4P74wr4fi5zdUfEc9bjnce2AILlMGWqNW8MN2C_PBvKaW0PM7TNkbqhwuc7N7KYDbBLHyq7n6Clc9Y8cdL_FduzPp0udkfOa42iLjcB_Mn8JN4FOsQDq5VkrWsASi18NASdYcCuaPwYHGmxU5odroCIQBMI4nqm_xPLOqLYoxVHAs6HgA1HWAWJrsElcrAQtkxFHRRMmxa13Mmm-tOu2WkKyGxE8ZeBVjFsIom7ZE2QFNNsts44P7pxgzMiW3zHk1xTSGEVBRoKY",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAdseiG4Uv02-Gy1wEd40__dTtLQ7GdJIbf8_0LOj-bLyfDU002iMSIN-9Rp3T0oz0sYKTDrXnuFASvJoHaQBk8vQugXAhkW8x9r6aN0KBpI-13Jh3A7WC20Yy5u54ZOUT-nyi7HJx6oeJ9zNr8GmCBG--1W2m3k0JPvfgg6fiO-uST0Kl-hZPlgoieAnBsVqIDXzo_e-TSmVRLQhnQGZR2HhrprEzEZ4QQJhwHTSw_iqeLJrmdJ123OH-R7LuI34uj-roKKL732tw"
    ];

    const handleNext = () => {
        if (step === 3) {
            // Save and Finish
            const newUser = saveUser(formData);
            if (onComplete) onComplete(newUser);
            navigate('/');
        } else {
            setStep(step + 1);
        }
    };

    return (
        <div className="min-h-screen bg-[#111] text-white font-display flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-md">

                {/* Progress Indicator */}
                <div className="flex gap-2 mb-12 justify-center">
                    {[1, 2, 3].map(i => (
                        <div key={i} className={`h-1 w-8 rounded-full transition-colors ${i <= step ? 'bg-[#F59E0B]' : 'bg-gray-800'}`}></div>
                    ))}
                </div>

                {/* Step 1: Welcome & Name */}
                {step === 1 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h1 className="text-4xl font-bold mb-4 text-center">Welcome to <span className="text-[#F59E0B]">Noor Swipe</span></h1>
                        <p className="text-gray-400 text-center mb-8">Let's get to know each other. What should we call you?</p>

                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Enter your name"
                            className="w-full bg-[#222] border border-gray-700 rounded-2xl p-4 text-lg focus:border-[#F59E0B] focus:outline-none transition-colors mb-8 text-center"
                            autoFocus
                        />
                    </div>
                )}

                {/* Step 2: Profile Type */}
                {step === 2 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h1 className="text-3xl font-bold mb-2 text-center">Choose your style</h1>
                        <p className="text-gray-400 text-center mb-8">Select the learning experience that fits you best.</p>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <button
                                onClick={() => setFormData({ ...formData, profileType: 'adult' })}
                                className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-4 ${formData.profileType === 'adult' ? 'border-[#F59E0B] bg-[#F59E0B]/10' : 'border-gray-700 bg-[#222] hover:border-gray-500'}`}
                            >
                                <User size={48} className={formData.profileType === 'adult' ? 'text-[#F59E0B]' : 'text-gray-400'} />
                                <div className="text-center">
                                    <h3 className="font-bold">Standard</h3>
                                    <p className="text-xs text-gray-400">Full Arabic script & phonics</p>
                                </div>
                            </button>

                            <button
                                onClick={() => setFormData({ ...formData, profileType: 'junior' })}
                                className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-4 ${formData.profileType === 'junior' ? 'border-[#3B82F6] bg-[#3B82F6]/10' : 'border-gray-700 bg-[#222] hover:border-gray-500'}`}
                            >
                                <Baby size={48} className={formData.profileType === 'junior' ? 'text-[#3B82F6]' : 'text-gray-400'} />
                                <div className="text-center">
                                    <h3 className="font-bold">Junior</h3>
                                    <p className="text-xs text-gray-400">Simplified visual learning</p>
                                </div>
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Avatar Selection */}
                {step === 3 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h1 className="text-3xl font-bold mb-2 text-center">Pick your avatar</h1>
                        <p className="text-gray-400 text-center mb-8">How do you want to appear on the leaderboard?</p>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            {avatars.map((avatar, index) => (
                                <button
                                    key={index}
                                    onClick={() => setFormData({ ...formData, avatar })}
                                    className={`relative rounded-full overflow-hidden border-4 transition-all ${formData.avatar === avatar ? 'border-[#F59E0B] scale-105' : 'border-transparent opacity-70 hover:opacity-100 hover:scale-105'}`}
                                >
                                    <img src={avatar} alt={`Avatar ${index + 1}`} className="w-full h-full object-cover" />
                                    {formData.avatar === avatar && (
                                        <div className="absolute inset-0 bg-[#F59E0B]/20 flex items-center justify-center">
                                            <Check className="text-white drop-shadow-md" size={32} />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <button
                    onClick={handleNext}
                    disabled={step === 1 && !formData.name.trim()}
                    className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${step === 1 && !formData.name.trim()
                            ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-black hover:shadow-lg hover:scale-[1.02] active:scale-95'
                        }`}
                >
                    {step === 3 ? "Let's Start!" : "Continue"}
                    <ArrowRight size={20} />
                </button>

            </div>
        </div>
    );
};

export default Onboarding;
