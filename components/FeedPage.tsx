import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getPublicFeed } from '../services/publicFeedService';
import { PublicPost } from '../types';
import { PostCard } from './PostCard';
import { SparklesIcon } from './IconComponents';

interface FeedPageProps {
    onViewProfile: (userId: string) => void;
}

export const FeedPage: React.FC<FeedPageProps> = ({ onViewProfile }) => {
    const { t } = useTranslation();
    const [posts, setPosts] = useState<PublicPost[]>([]);

    useEffect(() => {
        setPosts(getPublicFeed());
    }, []);

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

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-8">
                <SparklesIcon className="w-8 h-8 text-[var(--accent-primary)]" />
                <h1 className="text-3xl font-bold text-[var(--text-primary)]">{t('feed.title')}</h1>
            </div>

            {posts.length === 0 ? (
                <div className="text-center py-20 text-[var(--text-secondary)]">
                    <p>{t('feed.empty')}</p>
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
