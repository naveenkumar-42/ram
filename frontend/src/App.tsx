import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { Shop } from './pages/Shop';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <Router>
      <CartProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Shop />} />
            <Route path="/admin" element={<Dashboard />} />
          </Routes>
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;
