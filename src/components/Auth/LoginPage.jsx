import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Chrome, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const LoginPage = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, register, loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (isRegister) {
                await register(email, password);
            } else {
                await login(email, password);
            }
            navigate('/onboarding');
        } catch (err) {
            setError('Error de autenticación. Verifica tus credenciales.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            await loginWithGoogle();
            navigate('/onboarding');
        } catch (err) {
            setError('Error con Google login.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#121213] p-4 font-sans">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-10">
                    <h1 className="text-6xl font-black tracking-tighter text-[#00BFFF] mb-2 italic">LEVEL</h1>
                    <p className="text-[#B0B0B0] uppercase tracking-widest text-xs font-semibold">Nutritional Control System</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted h-5 w-5" />
                        <input
                            type="email"
                            placeholder="EMAIL"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-[#1A1A1B] border border-[#2D2D2E] rounded-lg py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#00BFFF] transition-colors placeholder:text-[#666666] text-sm tracking-widest"
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted h-5 w-5" />
                        <input
                            type="password"
                            placeholder="PASSWORD"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-[#1A1A1B] border border-[#2D2D2E] rounded-lg py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#00BFFF] transition-colors placeholder:text-[#666666] text-sm tracking-widest"
                        />
                    </div>

                    {error && <p className="text-red-500 text-xs text-center font-semibold">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#00BFFF] hover:bg-[#0099CC] text-black font-black py-4 rounded-lg transition-all flex items-center justify-center uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(0,191,255,0.3)]"
                    >
                        {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (isRegister ? 'Registrar Account' : 'Initialize Session')}
                    </button>
                </form>

                <div className="mt-6 flex flex-col space-y-4">
                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full bg-white text-black font-bold py-4 rounded-lg transition-all flex items-center justify-center uppercase tracking-widest text-sm"
                    >
                        <Chrome className="mr-2 h-5 w-5" /> Google Sync
                    </button>

                    <button
                        onClick={() => setIsRegister(!isRegister)}
                        className="text-[#666666] hover:text-[#B0B0B0] text-xs font-bold uppercase tracking-widest transition-colors"
                    >
                        {isRegister ? 'Already have an account? Login' : 'No account? Create discipline'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
