import { PublicPost, Comment } from '../types';

const PUBLIC_FEED_STORAGE_KEY = 'lumina_ai_public_feed';

// Dummy user profiles for seeding the feed
const DUMMY_USERS = [
    { id: 'pixel_dreamer', name: 'Pixel Dreamer', profilePicture: 'https://avatar.iran.liara.run/public/boy?username=PixelDreamer' },
    { id: 'artemis_ai', name: 'Artemis AI', profilePicture: 'https://avatar.iran.liara.run/public/girl?username=ArtemisAI' },
    { id: 'neuro_vision', name: 'Neuro Vision', profilePicture: 'https://avatar.iran.liara.run/public/boy?username=NeuroVision' },
    { id: 'synth_wave', name: 'Synth Wave', profilePicture: 'https://avatar.iran.liara.run/public/girl?username=SynthWave' },
];

// Dummy image URLs for seeding
const DUMMY_IMAGES = [
    'https://images.unsplash.com/photo-1682687220247-9f786e34d472?q=80&w=800',
    'https://images.unsplash.com/photo-1715456485933-8b23b1a80d4c?q=80&w=800',
    'https://images.unsplash.com/photo-1714859634952-32014168281a?q=80&w=800',
    'https://images.unsplash.com/photo-1682685797828-d3b2561deef4?q=80&w=800',
];

const DUMMY_PROMPTS = [
    "A majestic castle floating in a cyberpunk sky, neon lights reflecting on the clouds.",
    "Portrait of a futuristic warrior, intricate armor glowing with blue energy.",
    "An enchanted forest at night, with magical creatures and glowing flora.",
    "A retro-futuristic car racing through a desert on Mars, twin suns setting in the background.",
];

// Seed data to make the feed look alive
const getSeedData = (): PublicPost[] => {
    return DUMMY_USERS.map((user, index) => ({
        id: `seed_${index + 1}`,
        original: DUMMY_IMAGES[index],
        edited: DUMMY_IMAGES[index],
        prompt: DUMMY_PROMPTS[index],
        userId: user.id,
        userName: user.name,
        userProfilePicture: user.profilePicture,
        likes: Math.floor(Math.random() * 200) + 10,
        likedBy: [],
        comments: [
            { id: `c1_${index}`, userId: 'viewer_1', userName: 'Aesthete', text: 'This is incredible!', timestamp: new Date().toISOString() },
            { id: `c2_${index}`, userId: 'coder_2', userName: 'CodeWizard', text: 'Love the composition!', timestamp: new Date().toISOString() },
        ],
        shares: Math.floor(Math.random() * 50),
    }));
};

// Initialize feed with seed data if it doesn't exist
const initializeFeed = (): PublicPost[] => {
    try {
        const storedFeed = localStorage.getItem(PUBLIC_FEED_STORAGE_KEY);
        if (storedFeed) {
            return JSON.parse(storedFeed);
        }
        const seedData = getSeedData();
        localStorage.setItem(PUBLIC_FEED_STORAGE_KEY, JSON.stringify(seedData));
        return seedData;
    } catch (e) {
        console.error("Failed to initialize or get feed from local storage", e);
        return [];
    }
};

let publicFeed: PublicPost[] = initializeFeed();

const persistFeed = () => {
    try {
        localStorage.setItem(PUBLIC_FEED_STORAGE_KEY, JSON.stringify(publicFeed));
    } catch (e) {
        console.error("Failed to save feed to local storage", e);
    }
};

export const getPublicFeed = (): PublicPost[] => {
    return [...publicFeed].reverse(); // Show newest first
};

export const getPostsByUserId = (userId: string): PublicPost[] => {
    return publicFeed.filter(post => post.userId === userId).reverse();
};

export const addPostToFeed = (post: Omit<PublicPost, 'likes' | 'likedBy' | 'comments' | 'shares'>) => {
    const newPost: PublicPost = {
        ...post,
        likes: 0,
        likedBy: [],
        comments: [],
        shares: 0,
    };
    publicFeed.push(newPost);
    persistFeed();
};

export const removePostsByUserId = (userId: string) => {
    publicFeed = publicFeed.filter(post => post.userId !== userId);
    persistFeed();
};

export const updatePost = (postId: string, updates: Partial<PublicPost>): PublicPost | null => {
    const postIndex = publicFeed.findIndex(p => p.id === postId);
    if (postIndex !== -1) {
        publicFeed[postIndex] = { ...publicFeed[postIndex], ...updates };
        persistFeed();
        return publicFeed[postIndex];
    }
    return null;
};

export const toggleLikeOnPost = (postId: string, userId: string): PublicPost | null => {
    const post = publicFeed.find(p => p.id === postId);
    if (post) {
        const isLiked = post.likedBy.includes(userId);
        if (isLiked) {
            post.likes = Math.max(0, post.likes - 1);
            post.likedBy = post.likedBy.filter(id => id !== userId);
        } else {
            post.likes += 1;
            post.likedBy.push(userId);
        }
        return updatePost(postId, { likes: post.likes, likedBy: post.likedBy });
    }
    return null;
}

export const addCommentToPost = (postId: string, comment: Comment): PublicPost | null => {
    const post = publicFeed.find(p => p.id === postId);
    if (post) {
        post.comments.push(comment);
        return updatePost(postId, { comments: post.comments });
    }
    return null;
}

export const sharePost = (postId: string): PublicPost | null => {
    const post = publicFeed.find(p => p.id === postId);
    if (post) {
        post.shares += 1;
        return updatePost(postId, { shares: post.shares });
    }
    return null;
}
