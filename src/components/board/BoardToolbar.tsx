import { Plus, Wand2, LayoutGrid, Trash2, LogOut } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:5000/api';

export function BoardToolbar({ onAddIdea, onClearBoard, onSummaryClick }: { onAddIdea?: () => void, onClearBoard?: () => void, onSummaryClick?: () => void }) {
    const [user, setUser] = useState<any>(null);
    const [projectName, setProjectName] = useState('Brainstack Architect');
    const navigate = useNavigate();
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        // Try localStorage first for instant render, then verify with cookie-based API
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            if (parsedUser.projectName) {
                setProjectName(parsedUser.projectName);
            }
        }

        // Verify auth via cookie
        const verifyUser = async () => {
            try {
                const res = await fetch(`${API_BASE}/auth/me`, {
                    credentials: 'include',
                });
                const data = await res.json();
                console.log('[BoardToolbar] /auth/me response:', data);
                if (data.success && data.data) {
                    setUser(data.data);
                    if (data.data.projectName) {
                        setProjectName(data.data.projectName);
                    }
                    localStorage.setItem("user", JSON.stringify(data.data));
                } else {
                    // Cookie expired or invalid — redirect to login
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    navigate("/login");
                }
            } catch (error) {
                console.error('[BoardToolbar] Auth verification failed:', error);
            }
        };

        verifyUser();
    }, [navigate]);

    const handleLogout = async () => {
        try {
            await fetch(`${API_BASE}/auth/logout`, {
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

    const handleProjectNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;
        setProjectName(newName);

        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        debounceTimer.current = setTimeout(async () => {
            try {
                await fetch(`${API_BASE}/auth/project-name`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ projectName: newName })
                });
            } catch (err) {
                console.error('Failed to update project name', err);
            }
        }, 800);
    };

    return (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-7xl px-8 flex justify-between items-center">

            {/* Left Side User Settings */}
            <div className="flex items-center gap-3 bg-[#111827]/70 backdrop-blur-xl border border-indigo-500/15 px-4 py-2 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                {user?.photo ? (
                    <img src={user.photo} alt="Profile" className="w-8 h-8 rounded-full border border-indigo-500/40" />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-300 text-sm font-bold">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                )}
                <div className="hidden md:flex flex-col">
                    <span className="text-[#E5E7EB] text-sm font-semibold leading-none">{user?.name || 'User'}</span>
                    <span className="text-[#E5E7EB]/40 text-xs">{user?.email || ''}</span>
                </div>
                <div className="w-px h-6 bg-indigo-500/15 mx-2 hidden md:block" />
                <button onClick={handleLogout} className="text-[#E5E7EB]/40 hover:text-red-400 transition-colors p-1" title="Logout">
                    <LogOut className="w-4 h-4" />
                </button>
            </div>

            {/* Centered Board Actions */}
            <div className="flex items-center gap-4 bg-[#111827]/70 backdrop-blur-xl border border-indigo-500/15 px-6 py-3 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                <input
                    type="text"
                    value={projectName}
                    onChange={handleProjectNameChange}
                    className="bg-transparent text-[#E5E7EB] border-none outline-none font-medium w-40 text-lg hidden sm:block"
                    placeholder="Project Name"
                />

                <div className="w-px h-6 bg-indigo-500/15 mx-2 hidden sm:block" />

                <div className="flex items-center gap-2">
                    <button onClick={onAddIdea} className="flex items-center gap-2 px-4 py-2 hover:bg-indigo-500/15 rounded-full text-indigo-200 transition-colors text-sm font-medium">
                        <Plus className="w-4 h-4" />
                        <span className="hidden md:block">Add Idea</span>
                    </button>

                    <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 rounded-full text-white transition-all text-sm font-medium shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                        <Wand2 className="w-4 h-4" />
                        <span className="hidden md:block">Auto Connect</span>
                    </button>

                    <button onClick={onSummaryClick} className="flex items-center gap-2 px-4 py-2 hover:bg-indigo-500/15 rounded-full text-indigo-200 transition-colors text-sm font-medium">
                        <LayoutGrid className="w-4 h-4" />
                        <span className="hidden md:block">Summary</span>
                    </button>

                    <button onClick={onClearBoard} className="flex items-center gap-2 px-4 py-2 hover:bg-red-500/15 rounded-full text-red-300 transition-colors text-sm font-medium group">
                        <Trash2 className="w-4 h-4 group-hover:text-red-400" />
                        <span className="hidden md:block">Clear</span>
                    </button>
                </div>
            </div>

        </div>
    );
}
