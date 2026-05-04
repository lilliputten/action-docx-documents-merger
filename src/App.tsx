import { HelmetProvider } from 'react-helmet-async';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { TailwindIndicator } from '@/blocks/TailwindIndicator';
import { isDev } from '@/config';
import { CreateDocPage, MainPage } from '@/pages';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/create" element={<CreateDocPage />} />
    </Routes>
  );
}

const __showIndicator = true && isDev;

function App() {
  return (
    <HelmetProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
      <ToastContainer />
      {__showIndicator && <TailwindIndicator />}
    </HelmetProvider>
  );
}

export default App;
