import { createContext, useState, useEffect } from 'react';
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    if (storedToken && storedUsername) {
      setUser({ token: storedToken, username: storedUsername });
    }
    else {
      setUser(null); // asegura que el estado esté limpio si falta algo
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUser(null);
  };
  
  const login = (token, username) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);

    setUser({ token, username });
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

