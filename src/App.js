import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import LoginForm from './components/StartApp/Login/loginForm';
import RegisterForm from './components/StartApp/Register/registerForm';
import Companies from './pages/companies';

function App() {
  return (
    
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/companies" element={<Companies />} />
        </Routes>
      </Router>
  );
}

export default App;