import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { SparklesIcon, PaintBrushIcon } from './IconComponents';
import { Login } from './Login';

export const StartPage: React.FC = () => {
    const { theme } = useTheme();
    const [showLogin, setShowLogin] = useState(false);

    const openLogin = () => {
        setShowLogin(true);
    };

    const showcaseImages = [
        "https://images.pexels.com/photos/167699/pexels-photo-167699.jpeg?auto=compress&cs=tinysrgb&w=600",
        "https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?auto=compress&cs=tinysrgb&w=600",
        "https://images.pexels.com/photos/1528640/pexels-photo-1528640.jpeg?auto=compress&cs=tinysrgb&w=600",
        "https://images.pexels.com/photos/235615/pexels-photo-235615.jpeg?auto=compress&cs=tinysrgb&w=600",
        "https://images.pexels.com/photos/414102/pexels-photo-414102.jpeg?auto=compress&cs=tinysrgb&w=600",
        "https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=600",
    ];

    return (
        <div className={`min-h-screen font-sans`}>
             <header className="absolute top-0 left-0 right-0 z-10 bg-transparent">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-3 group">
                        <SparklesIcon className="w-8 h-8 text-[var(--accent-primary)]" />
                        <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">AI Photo Editor</h1>
                    </div>
                    <button
                        onClick={openLogin}
                        className="bg-[var(--accent-primary)] text-white font-semibold py-2 px-5 rounded-lg hover:bg-[var(--accent-primary-hover)] transition-colors"
                    >
                        Get Started
                    </button>
                </div>
            </header>

            <main className="relative z-0">
                <section className="min-h-[90vh] flex flex-col items-center justify-center text-center px-4">
                     <div className="relative z-10">
                        <PaintBrushIcon className="w-20 h-20 mx-auto mb-6 text-white" />
                        <h2 className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-4 bg-clip-text text-transparent animated-gradient">Unleash Your Creativity with AI</h2>
                        <p className="text-lg sm:text-xl text-[var(--text-secondary)] max-w-3xl mx-auto mb-12">Transform your photos into stunning works of art. From simple touch-ups to fantastical transformations, our AI-powered editor makes it easy.</p>
                        <button
                            onClick={openLogin}
                            className="bg-[var(--accent-primary)] text-white font-bold py-3 px-8 text-base sm:text-lg rounded-full hover:bg-[var(--accent-primary-hover)] transition-transform hover:scale-105"
                        >
                            Start Editing for Free
                        </button>
                    </div>
                </section>
                
                <section className="container mx-auto px-4 py-8 sm:py-16">
                     <h3 className="text-3xl sm:text-4xl font-bold text-center mb-10 text-[var(--text-primary)]">See The Magic</h3>
                     <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                        {showcaseImages.map((src, index) => (
                             <img key={index} className="rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1" src={src} alt={`Showcase image ${index + 1}`} loading="lazy" />
                        ))}
                    </div>
                </section>
            </main>

            {showLogin && (
                <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in">
                   <style>{`.animate-fade-in { animation: fadeIn 0.3s ease-out forwards; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
                    <Login onClose={() => setShowLogin(false)} />
                </div>
            )}
        </div>
    );
};
