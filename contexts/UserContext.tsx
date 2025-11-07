import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { SavedEdit } from '../types';
import i18n from '../i18n';
import { addPostToFeed, removePostsByUserId, toggleLikeOnPost, addCommentToPost, sharePost } from '../services/publicFeedService';

interface User {
  id: string; // Unique ID for the user
  name: string;
  profilePicture: string | null;
}

interface UserContextType {
  user: User | null;
  credits: number;
  isPremium: boolean;
  isProfilePublic: boolean;
  savedEdits: SavedEdit[];
  generationHistory: SavedEdit[];
  login: (username: string) => void;
  logout: () => void;
  deductCredits: (amount: number) => boolean;
  goPremium: () => void;
  saveEdit: (edit: Omit<SavedEdit, 'id' | 'userId' | 'userName' | 'userProfilePicture'>) => void;
  logGeneration: (edit: Omit<SavedEdit, 'id'>) => void;
  toggleProfilePublic: () => void;
  updateUsername: (newName: string) => void;
  updateProfilePicture: (imageUrl: string) => void;
  // Social Actions
  toggleLike: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
  share: (postId: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'photo_editor_user';

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [credits, setCredits] = useState<number>(0);
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [isProfilePublic, setIsProfilePublic] = useState<boolean>(false);
  const [savedEdits, setSavedEdits] = useState<SavedEdit[]>([]);
  const [generationHistory, setGenerationHistory] = useState<SavedEdit[]>([]);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUser({ id: parsed.id || parsed.name, name: parsed.name, profilePicture: parsed.profilePicture || null });
        setCredits(parsed.credits);
        setIsPremium(parsed.isPremium);
        setIsProfilePublic(parsed.isProfilePublic || false);
        setSavedEdits(parsed.savedEdits || []);
        setGenerationHistory(parsed.generationHistory || []);
      }
    } catch (error) {
      console.error("Failed to load user from local storage", error);
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, []);

  const persistUser = (data: object) => {
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save user to local storage", error);
    }
  };

  const login = (username: string) => {
    const userId = username.toLowerCase().replace(/\s/g, '_');
    const newUser = { id: userId, name: username, profilePicture: `https://avatar.iran.liara.run/public/boy?username=${encodeURIComponent(username)}` };
    const newUserData = {
      ...newUser,
      credits: 300,
      isPremium: false,
      isProfilePublic: false,
      savedEdits: [],
      generationHistory: [],
    };
    setUser(newUser);
    setCredits(300);
    setIsPremium(false);
    setIsProfilePublic(false);
    setSavedEdits([]);
    setGenerationHistory([]);
    persistUser(newUserData);
  };

  const logout = () => {
    if (user && isProfilePublic) {
        removePostsByUserId(user.id);
    }
    setUser(null);
    setCredits(0);
    setIsPremium(false);
    setIsProfilePublic(false);
    setSavedEdits([]);
    setGenerationHistory([]);
    localStorage.removeItem(USER_STORAGE_KEY);
  };

  const deductCredits = (amount: number) => {
    if (isPremium) return true;
    if (credits >= amount) {
      const newCredits = credits - amount;
      setCredits(newCredits);
      persistUser({ ...user, credits: newCredits, isPremium, isProfilePublic, savedEdits, generationHistory });
      return true;
    }
    return false;
  };

  const goPremium = () => {
    setIsPremium(true);
    persistUser({ ...user, credits, isPremium: true, isProfilePublic, savedEdits, generationHistory });
    alert(i18n.t('premiumModal.alert'));
  };
  
  const saveEdit = (edit: Omit<SavedEdit, 'id' | 'userId' | 'userName' | 'userProfilePicture'>) => {
    if (!user) return;
    const newEdit: SavedEdit = { 
        ...edit, 
        id: new Date().toISOString(),
        userId: user.id,
        userName: user.name,
        userProfilePicture: user.profilePicture
    };
    const newSavedEdits = [...savedEdits, newEdit];
    setSavedEdits(newSavedEdits);
    persistUser({ ...user, credits, isPremium, isProfilePublic, savedEdits: newSavedEdits, generationHistory });

    if (isProfilePublic) {
        // Fix: Cast to `Required<SavedEdit>` as `newEdit` is guaranteed to have user info, satisfying `addPostToFeed`.
        addPostToFeed(newEdit as Required<SavedEdit>);
    }
  };

  const logGeneration = (edit: Omit<SavedEdit, 'id'>) => {
    const newEntry = { ...edit, id: new Date().toISOString() };
    setGenerationHistory(prevHistory => {
        const newHistory = [...prevHistory, newEntry];
        persistUser({ ...user, credits, isPremium, isProfilePublic, savedEdits, generationHistory: newHistory });
        return newHistory;
    });
  };

  const toggleProfilePublic = () => {
    if (!user) return;
    const newStatus = !isProfilePublic;
    setIsProfilePublic(newStatus);
    persistUser({ ...user, credits, isPremium, isProfilePublic: newStatus, savedEdits, generationHistory });

    if (newStatus) {
        // Fix: Cast to `Required<SavedEdit>` as all `savedEdits` have user info, satisfying `addPostToFeed`.
        savedEdits.forEach(edit => addPostToFeed(edit as Required<SavedEdit>));
    } else {
        removePostsByUserId(user.id);
    }
  };

  const updateUsername = (newName: string) => {
    if (user) {
        const updatedUser = { ...user, name: newName };
        setUser(updatedUser);
        persistUser({ 
            ...updatedUser,
            credits, 
            isPremium, 
            isProfilePublic, 
            savedEdits, 
            generationHistory 
        });
    }
  };

  const updateProfilePicture = (imageUrl: string) => {
      if (user) {
          const updatedUser = { ...user, profilePicture: imageUrl };
          setUser(updatedUser);
          persistUser({ 
              ...updatedUser,
              credits, 
              isPremium, 
              isProfilePublic, 
              savedEdits, 
              generationHistory 
          });
      }
  };

  // Social Actions
  const toggleLike = (postId: string) => {
    if (!user) return;
    toggleLikeOnPost(postId, user.id);
  };

  const addComment = (postId: string, text: string) => {
    if (!user) return;
    const comment = {
        id: new Date().toISOString(),
        userId: user.id,
        userName: user.name,
        text,
        timestamp: new Date().toISOString()
    };
    addCommentToPost(postId, comment);
  };
  
  const share = (postId: string) => {
    sharePost(postId);
    alert('Link copied to clipboard (simulation)');
  };

  return (
    <UserContext.Provider value={{ user, credits, isPremium, isProfilePublic, savedEdits, generationHistory, login, logout, deductCredits, goPremium, saveEdit, logGeneration, toggleProfilePublic, updateUsername, updateProfilePicture, toggleLike, addComment, share }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
