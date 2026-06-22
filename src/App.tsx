import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import ProductsPage from './components/ProductsPage';
import ProductPage from './components/ProductPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/:id" element={<ProductPage />} />
    </Routes>
  );
}
