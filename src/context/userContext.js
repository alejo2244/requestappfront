import { createContext, useState, useEffect } from 'react';
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');
    const storedRolId = localStorage.getItem('rolId');
    const storedUsername = localStorage.getItem('username');
    if (storedToken && storedUsername && storedUserId && storedRolId) {
      setUser({ token: storedToken, username: storedUsername, userId: Number(storedUserId), rolId: Number(storedRolId) });
    }
    else {
      setUser(null); // asegura que el estado esté limpio si falta algo
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    localStorage.removeItem('rolId');
    setUser(null);
  };
  
  const login = (token, username, userId, rolId) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    localStorage.setItem('rolId', rolId);
    localStorage.setItem('userId', userId);

    setUser({ token, username, userId, rolId });
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

