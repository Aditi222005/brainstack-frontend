import { Plus, Wand2, LayoutGrid, Trash2, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function BoardToolbar() {
    const [user, setUser] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = async () => {
        try {
            await fetch("http://localhost:5000/api/auth/logout", {
                method: "POST",
                credentials: "include"
            });
        } catch (error) {
            console.error("Logout failed", error);
        }
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-7xl px-8 flex justify-between items-center">

            {/* Left Side User Settings */}
            <div className="flex items-center gap-3 bg-[#0f0a1f]/60 backdrop-blur-xl border border-purple-500/20 px-4 py-2 rounded-full shadow-[0_4_20px_rgba(0,0,0,0.5)]">
                {user?.photo ? (
                    <img src={user.photo} alt="Profile" className="w-8 h-8 rounded-full border border-primary/50" />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center text-primary text-sm font-bold">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                )}
                <div className="hidden md:flex flex-col">
                    <span className="text-white text-sm font-semibold leading-none">{user?.name || 'User'}</span>
                    <span className="text-white/50 text-xs">{user?.email || ''}</span>
                </div>
                <div className="w-px h-6 bg-purple-500/20 mx-2 hidden md:block" />
                <button onClick={handleLogout} className="text-white/50 hover:text-red-400 transition-colors p-1" title="Logout">
                    <LogOut className="w-4 h-4" />
                </button>
            </div>

            {/* Centered Board Actions */}
            <div className="flex items-center gap-4 bg-[#0f0a1f]/60 backdrop-blur-xl border border-purple-500/20 px-6 py-3 rounded-full shadow-[0_4_20px_rgba(0,0,0,0.5)]">
                <input
                    type="text"
                    defaultValue="Brainstack Architect"
                    className="bg-transparent text-white border-none outline-none font-medium w-40 text-lg hidden sm:block"
                />

                <div className="w-px h-6 bg-purple-500/20 mx-2 hidden sm:block" />

                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 hover:bg-purple-500/20 rounded-full text-purple-200 transition-colors text-sm font-medium">
                        <Plus className="w-4 h-4" />
                        <span className="hidden md:block">Add Idea</span>
                    </button>

                    <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-full text-white transition-all text-sm font-medium shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                        <Wand2 className="w-4 h-4" />
                        <span className="hidden md:block">Auto Connect</span>
                    </button>

                    <button className="flex items-center gap-2 px-4 py-2 hover:bg-purple-500/20 rounded-full text-purple-200 transition-colors text-sm font-medium">
                        <LayoutGrid className="w-4 h-4" />
                        <span className="hidden md:block">Summary</span>
                    </button>

                    <button className="flex items-center gap-2 px-4 py-2 hover:bg-red-500/20 rounded-full text-red-300 transition-colors text-sm font-medium group">
                        <Trash2 className="w-4 h-4 group-hover:text-red-400" />
                        <span className="hidden md:block">Clear</span>
                    </button>
                </div>
            </div>

        </div>
    );
}
