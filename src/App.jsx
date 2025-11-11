import Layout from "./Layout/Layout";
import { Routes, Route } from 'react-router-dom';
import AdminPage from './AdminPage.jsx'
import ClientPage from './ClientPage/ClientPage.jsx'
import ProductPage from "./ProductPage/ProductPage.jsx";
import AdminLoginPage from "./AdminLoginPage/AdminLoginPage.jsx";
import ClientRegisterPage from './ClientAuth/ClientRegister/ClientRegisterPage.jsx'
import ClientLoginPage from "./ClientAuth/ClientLoginPage/ClientLoginPage.jsx";
import ClientRoute from "./CheckTokens/ClientToken.jsx";
import AdminRoute from "./CheckTokens/AdminToken.jsx";
import LandingPage from "./LandingPage/LandingPage.jsx";
import TestThree from './TEST/threetest.jsx';
import BackgroundEffect from "./TOOLS/BackgroundEffect.jsx";
import ClientInventory from "./ClientInventory/ClientInventory.jsx";
function App() {
  return (
    <>
      <BackgroundEffect />
      <Routes>
        {/* Layout применяется ко ВСЕМ маршрутам */}
        <Route path="/" element={<Layout />}>
          {/* 🌐 Главная страница */}
          <Route index element={<LandingPage />} />

          {/* 🔓 Открытые страницы */}
          <Route path="admin/login" element={<AdminLoginPage />} />
          <Route path="client/register" element={<ClientRegisterPage />} />
          <Route path="client/login" element={<ClientLoginPage />} />

          {/* 👤 Клиентская часть */}
          <Route path="client" element={
            <ClientRoute>
              <ClientPage />
            </ClientRoute>
          } />

          <Route path="client/product/:id" element={
            <ClientRoute>
              <ProductPage />
            </ClientRoute>
          } />

          <Route path="clientInventory" element={
            <ClientRoute>
              <ClientInventory />
            </ClientRoute>
          } />

          {/* 👨‍💼 Админская страница */}
          <Route path="admin" element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          } />
        </Route>
      </Routes>
    </>
  );
}

export default App;
