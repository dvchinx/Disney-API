import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import type { SearchHistory, UserProfile } from '../types';

interface AuthUser {
  uid: string;
  email: string;
  displayName: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  profile: UserProfile | null;
  loading: boolean;
  authError: string | null;
  register: (displayName: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  recordSearch: (query: string) => Promise<void>;
  toggleFavorite: (characterId: number) => Promise<void>;
  removeSearchHistoryItem: (historyId: string) => Promise<void>;
  clearSearchHistory: () => Promise<void>;
  sendResetEmail: (email: string) => Promise<void>;
  clearAuthError: () => void;
}

type UserRecord = {
  uid: string;
  displayName: string;
  email: string;
  passwordHash: string;
  profile: UserProfile;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const USERS_COLLECTION = 'users';

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
};

const now = () => Date.now();

const createDefaultProfile = (uid: string, displayName: string, email: string): UserProfile => ({
  uid,
  displayName,
  email,
  favorites: [],
  searchHistory: [],
  createdAt: now(),
  updatedAt: now(),
});

const normalizeProfile = (data: Partial<UserProfile>, fallback: UserProfile): UserProfile => ({
  uid: data.uid || fallback.uid,
  displayName: data.displayName?.trim() || fallback.displayName,
  email: data.email || fallback.email,
  favorites: Array.isArray(data.favorites) ? data.favorites : fallback.favorites,
  searchHistory: Array.isArray(data.searchHistory) ? data.searchHistory : fallback.searchHistory,
  createdAt: data.createdAt || fallback.createdAt,
  updatedAt: data.updatedAt || fallback.updatedAt,
});

const hashPassword = async (password: string): Promise<string> => {
  const encoded = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
};

const userDocId = (email: string): string => email.trim().toLowerCase();

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(false);
  }, []);

  const usersCollection = useMemo(() => collection(db, USERS_COLLECTION), []);

  const persistRecord = useCallback(
    async (record: UserRecord) => {
      const ref = doc(usersCollection, userDocId(record.email));
      const updatedRecord: UserRecord = {
        ...record,
        profile: {
          ...record.profile,
          updatedAt: now(),
        },
      };

      await setDoc(ref, updatedRecord, { merge: true });
      setUser({ uid: updatedRecord.uid, email: updatedRecord.email, displayName: updatedRecord.displayName });
      setProfile(updatedRecord.profile);
    },
    [usersCollection],
  );

  const loadRecord = useCallback(async (email: string) => {
    const ref = doc(usersCollection, userDocId(email));
    const snapshot = await getDoc(ref);
    if (!snapshot.exists()) {
      throw new Error('No existe una cuenta con ese correo.');
    }

    return snapshot.data() as UserRecord;
  }, [usersCollection]);

  const register = useCallback(async (displayName: string, email: string, password: string) => {
    try {
      setAuthError(null);
      const normalizedEmail = email.trim().toLowerCase();
      const trimmedName = displayName.trim();

      if (!trimmedName || !normalizedEmail) {
        throw new Error('Debes completar el nombre y el correo.');
      }

      const ref = doc(usersCollection, userDocId(normalizedEmail));
      const existing = await getDoc(ref);
      if (existing.exists()) {
        throw new Error('Ya existe una cuenta con ese correo.');
      }

      const passwordHash = await hashPassword(password);
      const profileData = createDefaultProfile(userDocId(normalizedEmail), trimmedName, normalizedEmail);
      await setDoc(ref, {
        uid: profileData.uid,
        displayName: trimmedName,
        email: normalizedEmail,
        passwordHash,
        profile: profileData,
      });

      setUser({ uid: profileData.uid, email: normalizedEmail, displayName: trimmedName });
      setProfile(profileData);
    } catch (error) {
      const message = getErrorMessage(error, 'No se pudo crear la cuenta.');
      setAuthError(message);
      throw new Error(message);
    }
  }, [usersCollection]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setAuthError(null);
      const record = await loadRecord(email);
      const passwordHash = await hashPassword(password);

      if (record.passwordHash !== passwordHash) {
        throw new Error('Correo o contraseña inválidos.');
      }

      const currentProfile = normalizeProfile(record.profile, record.profile);
      const updatedProfile = { ...currentProfile, email: record.email };
      setUser({ uid: record.uid, email: record.email, displayName: record.displayName });
      setProfile(updatedProfile);
    } catch (error) {
      const message = getErrorMessage(error, 'No se pudo iniciar sesión.');
      setAuthError(message);
      throw new Error(message);
    }
  }, [loadRecord]);

  const logout = useCallback(async () => {
    setAuthError(null);
    setUser(null);
    setProfile(null);
  }, []);

  const updateActiveProfile = useCallback(
    async (nextProfile: UserProfile) => {
      if (!user) {
        throw new Error('No hay un usuario activo.');
      }

      const ref = doc(usersCollection, userDocId(nextProfile.email));
      const snapshot = await getDoc(ref);
      if (!snapshot.exists()) {
        throw new Error('No se encontró el usuario activo.');
      }

      const payload: UserRecord = {
        ...(snapshot.data() as UserRecord),
        displayName: nextProfile.displayName,
        email: nextProfile.email,
        profile: {
          ...nextProfile,
          updatedAt: now(),
        },
      };

      await setDoc(ref, payload, { merge: true });
      setProfile(payload.profile);
      setUser({ uid: payload.uid, email: payload.email, displayName: payload.displayName });
    },
    [usersCollection, user],
  );

  const recordSearch = useCallback(async (query: string) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery || !profile) return;

    try {
      const normalizedQuery = trimmedQuery.toLowerCase();
      const searchHistory: SearchHistory[] = [
        {
          id: `${now()}-${Math.random().toString(36).slice(2, 8)}`,
          query: trimmedQuery,
          timestamp: now(),
        },
        ...profile.searchHistory.filter((item) => item.query.toLowerCase() !== normalizedQuery),
      ].slice(0, 10);

      await updateActiveProfile({ ...profile, searchHistory });
    } catch (error) {
      setAuthError(getErrorMessage(error, 'No se pudo guardar la búsqueda.'));
    }
  }, [profile, updateActiveProfile]);

  const toggleFavorite = useCallback(async (characterId: number) => {
    if (!profile) return;

    try {
      const favorites = profile.favorites.includes(characterId)
        ? profile.favorites.filter((id) => id !== characterId)
        : [...profile.favorites, characterId];

      await updateActiveProfile({ ...profile, favorites });
    } catch (error) {
      setAuthError(getErrorMessage(error, 'No se pudo actualizar favoritos.'));
    }
  }, [profile, updateActiveProfile]);

  const removeSearchHistoryItem = useCallback(async (historyId: string) => {
    if (!profile) return;

    try {
      const searchHistory = profile.searchHistory.filter((item) => item.id !== historyId);
      await updateActiveProfile({ ...profile, searchHistory });
    } catch (error) {
      setAuthError(getErrorMessage(error, 'No se pudo eliminar la búsqueda.'));
    }
  }, [profile, updateActiveProfile]);

  const clearSearchHistory = useCallback(async () => {
    if (!profile) return;

    try {
      await updateActiveProfile({ ...profile, searchHistory: [] });
    } catch (error) {
      setAuthError(getErrorMessage(error, 'No se pudo limpiar el historial.'));
    }
  }, [profile, updateActiveProfile]);

  const sendResetEmail = useCallback(async () => {
    throw new Error('La recuperación de contraseña se gestiona desde Firebase Auth, no desde Firestore.');
  }, []);

  const clearAuthError = useCallback(() => setAuthError(null), []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      loading,
      authError,
      register,
      login,
      logout,
      recordSearch,
      toggleFavorite,
      removeSearchHistoryItem,
      clearSearchHistory,
      sendResetEmail,
      clearAuthError,
    }),
    [
      user,
      profile,
      loading,
      authError,
      register,
      login,
      logout,
      recordSearch,
      toggleFavorite,
      removeSearchHistoryItem,
      clearSearchHistory,
      sendResetEmail,
      clearAuthError,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
