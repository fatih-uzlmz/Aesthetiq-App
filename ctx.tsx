import { useStorageState } from '@/hooks/useStorageState';
import React from 'react';

const AuthContext = React.createContext<{
    signIn: () => void;
    signOut: () => void;
    session?: string | null;
    isLoading: boolean;
    isOnboarded: boolean;
    completeOnboarding: () => void;
}>({
    signIn: () => null,
    signOut: () => null,
    session: null,
    isLoading: false,
    isOnboarded: false,
    completeOnboarding: () => null,
});

// This hook can be used to access the user info.
export function useSession() {
    const value = React.useContext(AuthContext);
    if (process.env.NODE_ENV !== 'production') {
        if (!value) {
            throw new Error('useSession must be wrapped in a <SessionProvider />');
        }
    }
    return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
    const [[isLoading, session], setSession] = useStorageState('session');
    // Use simple useState for isOnboarded to reset on every launch (session-only)
    const [isOnboarded, setIsOnboarded] = React.useState(false);

    return (
        <AuthContext.Provider
            value={{
                signIn: () => {
                    // Perform sign-in logic here
                    setSession('xxx');
                },
                signOut: () => {
                    setSession(null);
                    setIsOnboarded(false);
                },
                session,
                isLoading,
                isOnboarded,
                completeOnboarding: () => {
                    setIsOnboarded(true);
                },
            }}>
            {props.children}
        </AuthContext.Provider>
    );
}
