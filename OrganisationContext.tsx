// src/contexts/UserOrganisationContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth, useUser } from "@clerk/clerk-react";
import { useNavigate } from 'react-router-dom';
import { getOrganisationById } from '../services/OrganisationService';
import { getUserByClerkId } from '../services/UserService';
import { Organisation } from "./interface/Organisation.ts";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  organisation: Organisation;
  clerkId: string;
  isOnboarded: string;
  role: string;
  primaryContact: string;
  isActive: boolean;
}

interface UserContextType {
  user: User | null;
  isOnboarded: boolean;
  organisation: Organisation | null;
  loading: boolean;
  token: string | null;
  refreshToken: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;
  const payload = JSON.parse(atob(token.split('.')[1]));
  return payload.exp * 1000 < Date.now();
};

export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const { user: clerkUser, isLoaded, isSignedIn } = useUser();
  const [organisation, setOrganisation] = useState<Organisation | null>(null);
  const [mongoUser, setMongoUser] = useState<User | null>(null);
  const [isOnboarded, setIsOnboarded] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(sessionStorage.getItem('authToken'));
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    const fetchMongoUser = async (clerkId: string) => {
      const response = await getUserByClerkId(clerkId);
      if (response.success) {
        setMongoUser(response.user);
        setIsOnboarded(response.user.isOnboarded === 'true');
        return response.user;
      } else {
        setLoading(false);
        console.error('Failed to fetch MongoDB user:', response.message);
        return null;
      }
    };

    const fetchOrganisation = async (orgId: string) => {
      const response = await getOrganisationById(orgId);
      if (response.success) {
        setOrganisation(response.organisation);
      }
      setLoading(false);
    };

    const fetchToken = async () => {
      const userToken = await auth.getToken({template: 'VAJWT'});
      console.log('userToken', {userToken})
      sessionStorage.setItem('authToken', userToken || '');
      setToken(userToken);
    };

    if (isLoaded) {
      if (isSignedIn) {
        if (clerkUser) {
          fetchMongoUser(clerkUser.id).then((user) => {
            if (user) {
              if (!user.isOnboarded) {
                navigate('/onboarding');
              } else {
                fetchOrganisation(user.organisation);
                fetchToken();
              }
            } else {
              setLoading(false);
            }
          });
        }
      } else {
        setLoading(false);
      }
    }
  }, [isLoaded, isSignedIn, clerkUser, navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (token) {
        const expired = isTokenExpired(token);
        console.log('Is token expired:', expired);
      }
    }, 5000); // 5 seconds interval

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [token]);

  return (
    <UserContext.Provider value={{ user: mongoUser, isOnboarded, organisation, loading, token, refreshToken }}>
      {children}
    </UserContext.Provider>
  );
};
