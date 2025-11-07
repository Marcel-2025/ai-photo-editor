import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PublicPost } from '../types';
import { useUser } from '../contexts/UserContext';
import { HeartIcon, CommentIcon, ShareIcon, UserIcon } from './IconComponents';

interface PostCardProps {
    post: PublicPost;
    onViewProfile: (userId: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onViewProfile }) => {
    const { t } = useTranslation();
    const { user, toggleLike, addComment, share } = useUser();
    const [isLiked, setIsLiked] = useState(user ? post.likedBy.includes(user.id) : false);
    const [likeCount, setLikeCount] = useState(post.likes);

    const handleLike = () => {
        if (!user) {
            alert(t('feed.loginToInteract'));
            return;
        }
        const newLikedState = !isLiked;
        setIsLiked(newLikedState);
        setLikeCount(prev => newLikedState ? prev + 1 : prev - 1);
        toggleLike(post.id);
    };
    
    const handleComment = () => {
        if (!user) {
            alert(t('feed.loginToInteract'));
            return;
        }
        const commentText = prompt(t('feed.addCommentPrompt'));
        if (commentText) {
            addComment(post.id, commentText);
            // In a real app, you would re-fetch or update state to show the new comment.
            alert(t('feed.commentAdded'));
        }
    };
    
    const handleShare = () => {
        share(post.id);
    };

    return (
        <div className="bg-[var(--background-secondary)] rounded-xl border border-[var(--border-primary)] shadow-lg overflow-hidden break-inside-avoid">
            <img src={post.edited} alt={post.prompt} className="w-full h-auto object-cover" />
            <div className="p-4">
                <div 
                    className="flex items-center gap-2 mb-3 cursor-pointer group"
                    onClick={() => onViewProfile(post.userId)}
                >
                    {post.userProfilePicture ? (
                        <img src={post.userProfilePicture} alt={post.userName} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                         <div className="w-8 h-8 rounded-full bg-[var(--background-tertiary)] grid place-items-center">
                            <UserIcon className="w-4 h-4 text-[var(--text-secondary)]" />
                        </div>
                    )}
                    <span className="text-sm font-semibold text-[var(--text-primary)] group-hover:underline">{post.userName}</span>
                </div>
                <p className="text-sm text-[var(--text-secondary)] mb-4">{post.prompt}</p>
                <div className="flex items-center justify-between text-[var(--text-secondary)]">
                    <div className="flex items-center gap-4">
                        <button onClick={handleLike} className="flex items-center gap-1.5 hover:text-red-500 transition-colors">
                            <HeartIcon className={`w-5 h-5 ${isLiked ? 'text-red-500 fill-current' : ''}`} />
                            <span className="text-xs">{likeCount}</span>
                        </button>
                        <button onClick={handleComment} className="flex items-center gap-1.5 hover:text-blue-400 transition-colors">
                            <CommentIcon className="w-5 h-5" />
                            <span className="text-xs">{post.comments.length}</span>
                        </button>
                    </div>
                    <button onClick={handleShare} className="flex items-center gap-1.5 hover:text-green-400 transition-colors">
                        <ShareIcon className="w-5 h-5" />
                         <span className="text-xs">{post.shares}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
