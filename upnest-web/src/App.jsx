import './App.css';
import AppRoutes from './routes/AppRoutes';
import Navigation from './components/Navigation';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Navigation />
      <main className="app-main">
        <AppRoutes />
      </main>
    </AuthProvider>
  );
}

export default App;
