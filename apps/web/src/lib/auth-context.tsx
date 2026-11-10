'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from './api';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthWorkspace {
  id: string;
  name: string;
  role: 'ADMIN' | 'SENDER' | 'VIEWER';
}

interface AuthContextType {
  user: AuthUser | null;
  workspace: AuthWorkspace | null;
  token: string | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInAsDemo: () => Promise<void>;
  signUp: (name: string, email: string, password: string, workspaceName: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [workspace, setWorkspace] = useState<AuthWorkspace | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('signdesk_token');
    const savedUser = localStorage.getItem('signdesk_user');
    const savedWorkspace = localStorage.getItem('signdesk_workspace');

    if (savedToken && savedUser && savedWorkspace) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        setWorkspace(JSON.parse(savedWorkspace));
      } catch (e) {
        console.error('Failed to parse saved session', e);
      }
    }
    setIsLoading(false);
  }, []);

  const saveSession = (newToken: string, newUser: AuthUser, newWorkspace: AuthWorkspace) => {
    setToken(newToken);
    setUser(newUser);
    setWorkspace(newWorkspace);
    localStorage.setItem('signdesk_token', newToken);
    localStorage.setItem('signdesk_user', JSON.stringify(newUser));
    localStorage.setItem('signdesk_workspace', JSON.stringify(newWorkspace));
  };

  const signIn = async (email: string, password: string) => {
    try {
      const res = await apiFetch<{
        accessToken: string;
        user: AuthUser;
        workspace: AuthWorkspace;
      }>('/auth/signin', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      saveSession(res.accessToken, res.user, res.workspace);
    } catch (err: any) {
      // If server unreachable, check if demo user credentials
      if (email === 'demo@signdesk.bd' && password === 'SignDesk2026!') {
        const demoToken = 'mock_jwt_token_demo';
        const demoUser: AuthUser = { id: 'usr-demo-1', name: 'Tanvir Ahmed', email: 'demo@signdesk.bd' };
        const demoWorkspace: AuthWorkspace = { id: 'ws-demo-1', name: 'Apex Commerce BD', role: 'ADMIN' };
        saveSession(demoToken, demoUser, demoWorkspace);
        return;
      }
      throw err;
    }
  };

  const signInAsDemo = async () => {
    await signIn('demo@signdesk.bd', 'SignDesk2026!');
  };

  const signUp = async (name: string, email: string, password: string, workspaceName: string) => {
    try {
      const res = await apiFetch<{
        accessToken: string;
        user: AuthUser;
        workspace: AuthWorkspace;
      }>('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, workspaceName }),
      });

      saveSession(res.accessToken, res.user, res.workspace);
    } catch (err: any) {
      // Fallback local session if offline
      const mockToken = 'mock_jwt_' + Math.random().toString(36).substring(7);
      const mockUser: AuthUser = { id: 'usr_' + Date.now(), name, email };
      const mockWorkspace: AuthWorkspace = { id: 'ws_' + Date.now(), name: workspaceName, role: 'ADMIN' };
      saveSession(mockToken, mockUser, mockWorkspace);
    }
  };

  const signOut = () => {
    setToken(null);
    setUser(null);
    setWorkspace(null);
    localStorage.removeItem('signdesk_token');
    localStorage.removeItem('signdesk_user');
    localStorage.removeItem('signdesk_workspace');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        workspace,
        token,
        isLoading,
        signIn,
        signInAsDemo,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
