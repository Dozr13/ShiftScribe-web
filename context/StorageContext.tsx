import { getStorage } from 'firebase/storage';
import { createContext, useContext } from 'react';
import { FIREBASE_STORAGE } from '../lib/Firebase';

interface StorageContextType {
  storage: ReturnType<typeof getStorage> | null;
}

const StorageContext = createContext<StorageContextType | null>(null);

export const useStorage = () => useContext(StorageContext);

const StorageContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <StorageContext.Provider value={{ storage: FIREBASE_STORAGE }}>
      {children}
    </StorageContext.Provider>
  );
};

export default StorageContextProvider;
