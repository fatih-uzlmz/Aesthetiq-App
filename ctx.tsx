import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useState } from 'react';

type AuthContextType = {
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, data?: { full_name: string; username?: string; avatar_url?: string }) => Promise<any>;
    signOut: () => void;
    session: Session | null;
    isLoading: boolean;
    isOnboarded: boolean;
    completeOnboarding: () => void;
    signInAnonymously: () => Promise<void>;
    isAnonymous: boolean;
};

const AuthContext = createContext<AuthContextType>({
    signIn: async () => { },
    signUp: async () => { },
    signOut: () => { },
    session: null,
    isLoading: false,
    isOnboarded: false,
    completeOnboarding: () => { },
    signInAnonymously: async () => { },
    isAnonymous: false,
});

export function useSession() {
    const value = useContext(AuthContext);
    if (process.env.NODE_ENV !== 'production') {
        if (!value) {
            throw new Error('useSession must be wrapped in a <SessionProvider />');
        }
    }
    return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isOnboarded, setIsOnboarded] = useState(false);
    const [isAnonymous, setIsAnonymous] = useState(false);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session?.user?.email?.includes('guest_')) {
                setIsAnonymous(true);
            }
            if (session) {
                // If we have a session, we're done loading (unless we want to do more checks)
                setIsLoading(false);
            } else {
                // No session? Auto-create guest account
                signInAnonymously().finally(() => setIsLoading(false));
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session?.user?.email?.includes('guest_')) {
                setIsAnonymous(true);
            } else {
                setIsAnonymous(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
    };

    const signUp = async (email: string, password: string, data?: { full_name: string; username?: string; avatar_url?: string }) => {
        const { data: authData, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data,
            }
        });
        if (error) throw error;
        return authData;
    };

    const signInAnonymously = async () => {
        // Generate random credentials
        // Use a cleaner format: guest[timestamp][random]
        const timestamp = Date.now().toString(36);
        const randomStr = Math.random().toString(36).substring(2, 8);
        const email = `guest.${timestamp}.${randomStr}@aesthetiq.app`;
        const password = `guest-${timestamp}-${randomStr}-secret`;

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: 'Guest User',
                    username: `guest_${timestamp}`
                }
            }
        });

        if (error) {
            console.error("Anonymous Sign In Error:", error.message);
            // Fallback: try to just start anyway, but without session features might break
        }
    };

    const signOut = () => {
        supabase.auth.signOut();
        setIsOnboarded(false);
    };

    return (
        <AuthContext.Provider
            value={{
                signIn,
                signUp,
                signOut,
                session,
                isLoading,
                isOnboarded,
                completeOnboarding: () => setIsOnboarded(true),
                signInAnonymously,
                isAnonymous
            }}
        >
            {props.children}
        </AuthContext.Provider>
    );
}
