import { BrainCircuit, Twitter, Github, Linkedin } from "lucide-react";

const LandingFooter = () => {
    return (
        <footer className="bg-[#0B0F19] pt-20 pb-10 border-t border-indigo-500/10 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10 mb-16">
                <div className="col-span-1 md:col-span-1">
                    <div className="flex items-center gap-2 mb-6">
                        <BrainCircuit className="w-6 h-6 text-indigo-400" />
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
                            BrainStack
                        </span>
                    </div>
                    <p className="text-[#E5E7EB]/40 text-sm max-w-sm leading-relaxed mb-6">
                        The intelligent visual workspace completely optimized for modern knowledge workers, researchers, and seamless builders entirely everywhere.
                    </p>
                    <div className="flex gap-4">
                        <a href="#" className="w-10 h-10 rounded-full bg-[#111827]/60 border border-indigo-500/10 flex items-center justify-center text-[#E5E7EB]/40 hover:text-indigo-400 hover:border-indigo-500/30 transition-all">
                            <Twitter className="w-4 h-4" />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-[#111827]/60 border border-indigo-500/10 flex items-center justify-center text-[#E5E7EB]/40 hover:text-indigo-400 hover:border-indigo-500/30 transition-all">
                            <Github className="w-4 h-4" />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-[#111827]/60 border border-indigo-500/10 flex items-center justify-center text-[#E5E7EB]/40 hover:text-indigo-400 hover:border-indigo-500/30 transition-all">
                            <Linkedin className="w-4 h-4" />
                        </a>
                    </div>
                </div>

                <div>
                    <h4 className="font-semibold text-[#E5E7EB] mb-6">Product</h4>
                    <ul className="space-y-4">
                        <li><a href="#" className="text-[#E5E7EB]/40 hover:text-indigo-400 transition-colors text-sm">Visual Boards</a></li>
                        <li><a href="#" className="text-[#E5E7EB]/40 hover:text-indigo-400 transition-colors text-sm">Smart Notes</a></li>
                        <li><a href="#" className="text-[#E5E7EB]/40 hover:text-indigo-400 transition-colors text-sm">Knowledge Graph</a></li>
                        <li><a href="#" className="text-[#E5E7EB]/40 hover:text-indigo-400 transition-colors text-sm">Integrations</a></li>
                        <li><a href="#" className="text-[#E5E7EB]/40 hover:text-indigo-400 transition-colors text-sm">Pricing</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold text-[#E5E7EB] mb-6">Resources</h4>
                    <ul className="space-y-4">
                        <li><a href="#" className="text-[#E5E7EB]/40 hover:text-indigo-400 transition-colors text-sm">Blog</a></li>
                        <li><a href="#" className="text-[#E5E7EB]/40 hover:text-indigo-400 transition-colors text-sm">Help Center</a></li>
                        <li><a href="#" className="text-[#E5E7EB]/40 hover:text-indigo-400 transition-colors text-sm">Community</a></li>
                        <li><a href="#" className="text-[#E5E7EB]/40 hover:text-indigo-400 transition-colors text-sm">Developers API</a></li>
                        <li><a href="#" className="text-[#E5E7EB]/40 hover:text-indigo-400 transition-colors text-sm">Status</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold text-[#E5E7EB] mb-6">Legal</h4>
                    <ul className="space-y-4">
                        <li><a href="#" className="text-[#E5E7EB]/40 hover:text-indigo-400 transition-colors text-sm">Privacy Policy</a></li>
                        <li><a href="#" className="text-[#E5E7EB]/40 hover:text-indigo-400 transition-colors text-sm">Terms of Service</a></li>
                        <li><a href="#" className="text-[#E5E7EB]/40 hover:text-indigo-400 transition-colors text-sm">Security</a></li>
                        <li><a href="#" className="text-[#E5E7EB]/40 hover:text-indigo-400 transition-colors text-sm">Cookie Preferences</a></li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-indigo-500/10 text-center flex flex-col items-center">
                <p className="text-[#E5E7EB]/30 text-sm">
                    &copy; {new Date().getFullYear()} BrainStack. All rights entirely reserved.
                </p>
            </div>
        </footer>
    );
};

export default LandingFooter;
