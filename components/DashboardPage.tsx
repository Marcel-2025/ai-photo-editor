import React, { useState, useRef } from 'react';
import { UserIcon, SettingsIcon, ColorfulSparklesIcon, ColorfulSaveIcon, ColorfulHistoryIcon, EditIcon, UploadIcon } from './IconComponents';
import { useUser } from '../contexts/UserContext';
import { Favorites } from './Gallery';

export const DashboardPage: React.FC = () => {
    const { user, credits, isPremium, isProfilePublic, toggleProfilePublic, generationHistory, savedEdits, updateUsername, updateProfilePicture } = useUser();
    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState(user?.name || '');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handlePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (reader.result) {
                    updateProfilePicture(reader.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleNameSave = () => {
        if (newName.trim() && user && newName.trim() !== user.name) {
            updateUsername(newName.trim());
        }
        setIsEditingName(false);
    };
    
    if (!user) return null;

    const statCards = [
        {
            icon: ColorfulSaveIcon,
            label: "Favorites Saved",
            value: savedEdits.length,
            color: "cyan"
        },
        {
            icon: ColorfulHistoryIcon,
            label: "Total Generations",
            value: generationHistory.length,
            color: "pink"
        },
        ...(!isPremium ? [{
            icon: ColorfulSparklesIcon,
            label: "Credits Remaining",
            value: credits,
            color: "lime"
        }] : [])
    ];

    return (
        <div className="max-w-7xl mx-auto px-2">
            <div className="text-center mb-12">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePictureUpload}
                    className="hidden"
                    accept="image/png, image/jpeg, image/webp"
                />
                <div
                    className="relative w-28 h-28 mx-auto mb-4 group cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                    title="Change profile picture"
                >
                    {user.profilePicture ? (
                        <img src={user.profilePicture} alt="Profile" className="w-full h-full rounded-full object-cover border-4 border-[var(--border-primary)]" />
                    ) : (
                        <div className="w-full h-full rounded-full border-4 border-dashed border-[var(--border-primary)] grid place-items-center">
                            <UserIcon className="w-24 h-24 text-[var(--accent-primary)]" />
                        </div>
                    )}
                    <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <UploadIcon className="w-8 h-8 text-white" />
                    </div>
                </div>

                {!isEditingName ? (
                    <div className="flex items-center justify-center gap-2">
                        <h1 className="text-4xl font-bold text-[var(--text-primary)]">{user.name}</h1>
                        <button 
                            onClick={() => { setIsEditingName(true); setNewName(user.name); }} 
                            className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-full hover:bg-[var(--background-tertiary)] transition-colors"
                            title="Edit name"
                        >
                            <EditIcon className="w-6 h-6" />
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center justify-center gap-2 max-w-sm mx-auto"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleNameSave();
                            if (e.key === 'Escape') setIsEditingName(false);
                        }}
                    >
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="flex-grow bg-[var(--background-secondary)] border border-[var(--border-secondary)] rounded-lg py-2 px-3 text-[var(--text-primary)] text-2xl font-bold text-center focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] transition-colors"
                            autoFocus
                        />
                        <button onClick={handleNameSave} className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">Save</button>
                        <button onClick={() => setIsEditingName(false)} className="bg-[var(--danger-primary)] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[var(--danger-primary-hover)] transition-colors">Cancel</button>
                    </div>
                )}

                {isPremium ? (
                    <p className="text-yellow-400 font-semibold mt-2 text-lg">Premium Member</p>
                ) : (
                    <p className="text-[var(--text-secondary)] mt-2 text-lg">Free Member</p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {statCards.map((card, index) => (
                    <div key={index} className={`bg-[var(--background-secondary)]/50 backdrop-blur-sm border-2 rounded-2xl p-6 shadow-2xl transition-all duration-300 hover:shadow-[0_0_25px] hover:-translate-y-1 border-cyan-500 shadow-cyan-500/20 hover:shadow-cyan-500/40`}>
                        <div className="flex items-center gap-6">
                            <card.icon className="w-12 h-12" />
                            <div>
                                <p className="text-lg text-[var(--text-secondary)]">{card.label}</p>
                                <p className="text-4xl font-bold text-[var(--text-primary)]">{card.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="max-w-md mx-auto">
                <div className="bg-[var(--background-secondary)]/50 backdrop-blur-sm border-2 border-purple-500 rounded-2xl p-6 shadow-2xl shadow-purple-500/20">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <SettingsIcon className="w-6 h-6 text-purple-400" />
                            <label htmlFor="public-profile-toggle" className="text-lg font-medium text-[var(--text-primary)] cursor-pointer">
                                Public Gallery
                            </label>
                        </div>
                        <button
                            id="public-profile-toggle"
                            onClick={toggleProfilePublic}
                            role="switch"
                            aria-checked={isProfilePublic}
                            className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-[var(--background-secondary)] ${
                                isProfilePublic ? 'bg-purple-500' : 'bg-[var(--border-secondary)]'
                            }`}
                        >
                            <span
                                aria-hidden="true"
                                className={`inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                    isProfilePublic ? 'translate-x-5' : 'translate-x-0'
                                }`}
                            />
                        </button>
                    </div>
                     <p className="text-sm text-[var(--text-secondary)]/80 mt-3 text-center">Toggle to make your favorites gallery visible to others (feature coming soon).</p>
                </div>
            </div>

            <Favorites />
        </div>
    );
};
