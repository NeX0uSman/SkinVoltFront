import Layout from "./Layout/Layout";
import { Routes, Route } from 'react-router-dom';
import AdminPage from './AdminPage.jsx';
import ClientPage from './ClientPage/ClientPage.jsx';
import ProductPage from "./ProductPage/ProductPage.jsx";
import AdminLoginPage from "./AdminLoginPage/AdminLoginPage.jsx";
import AdminRegisterPage from "./AdminRegisterPage/AdminRegisterPage.jsx";
import ClientRegisterPage from './ClientAuth/ClientRegister/ClientRegisterPage.jsx';
import ClientLoginPage from "./ClientAuth/ClientLoginPage/ClientLoginPage.jsx";
import ProtectedRoute from "./CheckTokens/ProtectedRoute.jsx";
import LandingPage from "./LandingPage/LandingPage.jsx";
import BackgroundEffect from "./TOOLS/BackgroundEffect.jsx";
import ClientInventory from "./ClientInventory/ClientInventory.jsx";

function App() {
  return (
    <>
      <BackgroundEffect />
      <Routes>
        <Route path="/" element={<Layout />}>

          {/* 🌐 Главная страница */}
          <Route index element={<LandingPage />} />

          {/* 🔓 Открытые страницы */}
          <Route path="admin/login" element={<AdminLoginPage />} />
          <Route path="admin/register" element={<AdminRegisterPage />} />
          <Route path="client/register" element={<ClientRegisterPage />} />
          <Route path="client/login" element={<ClientLoginPage />} />

          {/* 👤 Клиентская часть */}
          <Route path="client" element={
            <ProtectedRoute requiredRole="client">
              <ClientPage />
            </ProtectedRoute>
          } />

          <Route path="client/product/:id" element={
            <ProtectedRoute requiredRole="client">
              <ProductPage />
            </ProtectedRoute>
          } />

          <Route path="clientInventory" element={
            <ProtectedRoute requiredRole="client">
              <ClientInventory />
            </ProtectedRoute>
          } />

          {/* 👨‍💼 Админская страница */}
          <Route path="admin" element={
            <ProtectedRoute requiredRole="admin">
              <AdminPage />
            </ProtectedRoute>
          } />

        </Route>
      </Routes>
    </>
  );
}

export default App;