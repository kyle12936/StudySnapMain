// UserContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import {useAuth } from './AuthProvider'; // Adjust the import path as needed
import { apiBaseUrl } from './api';

interface UserData {
    email: string;
    username: string;
}

interface UserContextType {
  user: UserData | null;
  loading: boolean;
}

const baseUrl = apiBaseUrl;
export const UserContext = createContext<UserContextType | undefined>(undefined);
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth(); // Fetch isAuthenticated from AuthProvider
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (isAuthenticated) {
        try {
            const response = await fetch(baseUrl + '/api/auth/user', { credentials: 'include' });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data:UserData = await response.json();
            console.log(data);
            setUser(data);
        } catch (error) {
            console.error('Error fetching user data:', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
      } else {
            setUser(null);
            setLoading(false);
      }
    };

    fetchUserData();
  }, [isAuthenticated]);

    return (
        <UserContext.Provider value={{ user, loading }}>
        {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};


