import './App.css';
import AppRoutes from './routes/AppRoutes';
import Navigation from './components/Navigation';
import { AuthProvider } from './context/AuthContext';
import { useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();
  const pathname = location?.pathname || '/';

  // Routes already wrapped by StudentLayout (they have their own header/sidebar)
  const isStudentShellRoute =
    pathname === '/dashboard' ||
    pathname === '/news-feed' ||
    pathname === '/blog' ||
    pathname === '/classroom';

  return (
    <AuthProvider>
      {!isStudentShellRoute && <Navigation />}
      <main className="app-main">
        <AppRoutes />
      </main>
    </AuthProvider>
  );
}

export default App;
