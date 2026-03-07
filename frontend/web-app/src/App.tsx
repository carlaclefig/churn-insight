import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useTheme } from './hooks/useTheme';
import Navbar from './components/ui/Navbar';
import Home from './pages/Home';
import CustomerDetail from './pages/CustomerDetail';
import Dashboard from './pages/Dashboard';

export default function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        <Navbar theme={theme} toggleTheme={toggleTheme} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/"             element={<Home />} />
            <Route path="/customer/:id" element={<CustomerDetail />} />
            <Route path="/dashboard"    element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}