import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getPostsByUserId } from '../services/publicFeedService';
import { PublicPost } from '../types';
import { PostCard } from './PostCard';
import { UserIcon, ArrowLeftIcon } from './IconComponents';

interface PublicProfilePageProps {
    userId: string;
    onBack: () => void;
    onViewProfile: (userId: string) => void; // For nested profile views
}

export const PublicProfilePage: React.FC<PublicProfilePageProps> = ({ userId, onBack, onViewProfile }) => {
    const { t } = useTranslation();
    const [posts, setPosts] = useState<PublicPost[]>([]);
    const [userProfile, setUserProfile] = useState<{name: string, profilePicture: string | null} | null>(null);

    useEffect(() => {
        const userPosts = getPostsByUserId(userId);
        setPosts(userPosts);
        if (userPosts.length > 0) {
            setUserProfile({
                name: userPosts[0].userName,
                profilePicture: userPosts[0].userProfilePicture,
            });
        }
    }, [userId]);

    const [column1, column2] = useMemo(() => {
        const col1: PublicPost[] = [];
        const col2: PublicPost[] = [];
        posts.forEach((post, index) => {
            if (index % 2 === 0) {
                col1.push(post);
            } else {
                col2.push(post);
            }
        });
        return [col1, col2];
    }, [posts]);

    if (!userProfile) {
        return (
            <div className="text-center py-20">
                <p className="text-[var(--text-secondary)]">{t('profile.notFound')}</p>
                <button onClick={onBack} className="mt-4 text-[var(--accent-primary)] hover:underline">
                    {t('common.back')}
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
             <button
                onClick={onBack}
                className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-8 transition-colors"
            >
                <ArrowLeftIcon className="w-5 h-5" />
                {t('common.backToFeed')}
            </button>
            
            <div className="text-center mb-12">
                {userProfile.profilePicture ? (
                    <img src={userProfile.profilePicture} alt={userProfile.name} className="w-24 h-24 mx-auto rounded-full object-cover border-4 border-[var(--border-primary)] mb-4" />
                ) : (
                    <div className="w-24 h-24 mx-auto rounded-full border-4 border-dashed border-[var(--border-primary)] grid place-items-center mb-4">
                        <UserIcon className="w-16 h-16 text-[var(--accent-primary)]" />
                    </div>
                )}
                <h1 className="text-4xl font-bold text-[var(--text-primary)]">{userProfile.name}</h1>
                <p className="text-[var(--text-secondary)] mt-2">{t('profile.creations', { count: posts.length })}</p>
            </div>
            
            {posts.length === 0 ? (
                <div className="text-center py-20 text-[var(--text-secondary)]">
                    <p>{t('profile.noPublicPosts')}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                        {column1.map(post => <PostCard key={post.id} post={post} onViewProfile={onViewProfile} />)}
                    </div>
                    <div className="space-y-4">
                        {column2.map(post => <PostCard key={post.id} post={post} onViewProfile={onViewProfile} />)}
                    </div>
                </div>
            )}
        </div>
    );
};
