import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { SavedEdit } from '../types';

interface User {
  name: string;
}

interface UserContextType {
  user: User | null;
  credits: number;
  isPremium: boolean;
  savedEdits: SavedEdit[];
  generationHistory: SavedEdit[];
  login: (username: string) => void;
  logout: () => void;
  deductCredits: (amount: number) => boolean;
  goPremium: () => void;
  saveEdit: (edit: Omit<SavedEdit, 'id'>) => void;
  logGeneration: (edit: Omit<SavedEdit, 'id'>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'photo_editor_user';

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [credits, setCredits] = useState<number>(0);
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [savedEdits, setSavedEdits] = useState<SavedEdit[]>([]);
  const [generationHistory, setGenerationHistory] = useState<SavedEdit[]>([]);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUser({ name: parsed.name });
        setCredits(parsed.credits);
        setIsPremium(parsed.isPremium);
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
    const newUser = { name: username };
    const newUserData = {
      ...newUser,
      credits: 300,
      isPremium: false,
      savedEdits: [],
      generationHistory: [],
    };
    setUser(newUser);
    setCredits(300);
    setIsPremium(false);
    setSavedEdits([]);
    setGenerationHistory([]);
    persistUser(newUserData);
  };

  const logout = () => {
    setUser(null);
    setCredits(0);
    setIsPremium(false);
    setSavedEdits([]);
    setGenerationHistory([]);
    localStorage.removeItem(USER_STORAGE_KEY);
  };

  const deductCredits = (amount: number) => {
    if (isPremium) return true;
    if (credits >= amount) {
      const newCredits = credits - amount;
      setCredits(newCredits);
      persistUser({ name: user?.name, credits: newCredits, isPremium, savedEdits, generationHistory });
      return true;
    }
    return false;
  };

  const goPremium = () => {
    setIsPremium(true);
    persistUser({ name: user?.name, credits, isPremium: true, savedEdits, generationHistory });
    alert("Congratulations! You are now a Premium user with unlimited edits. (This is a simulation)");
  };
  
  const saveEdit = (edit: Omit<SavedEdit, 'id'>) => {
    const newEdit = { ...edit, id: new Date().toISOString() };
    const newSavedEdits = [...savedEdits, newEdit];
    setSavedEdits(newSavedEdits);
    persistUser({ name: user?.name, credits, isPremium, savedEdits: newSavedEdits, generationHistory });
  };

  const logGeneration = (edit: Omit<SavedEdit, 'id'>) => {
    const newEntry = { ...edit, id: new Date().toISOString() };
    setGenerationHistory(prevHistory => {
        const newHistory = [...prevHistory, newEntry];
        persistUser({ name: user?.name, credits, isPremium, savedEdits, generationHistory: newHistory });
        return newHistory;
    });
  };


  return (
    <UserContext.Provider value={{ user, credits, isPremium, savedEdits, generationHistory, login, logout, deductCredits, goPremium, saveEdit, logGeneration }}>
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