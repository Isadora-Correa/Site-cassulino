import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Função dummy para não quebrar o APP.jsx
  const navigateToLogin = () => {
    console.log("Redirecionando para login...");
  };

  return (
    <AuthContext.Provider value={{ 
      isLoadingAuth, 
      isLoadingPublicSettings, 
      authError, 
      navigateToLogin,
      user: { name: 'User' } 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);