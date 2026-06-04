import { useState, useEffect } from 'react';
import './index.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './pages/public/About';
import History from './pages/public/History';
import Brothers from './pages/public/Brothers';
import Newsletter from './pages/public/Newsletter';
import Contact from './pages/public/Contact';
import Footer from './components/Footer';
import Archive from './pages/public/Archive';
import './pages/public/Archive.css';
import AdminLogin from './pages/admin/AdminLogin';
import ArchiveUpload from './pages/admin/ArchiveUpload';
import BrothersManager from './pages/admin/BrothersManager';
import ProtectedAdminRoute from './pages/admin/ProtectedAdminRoute';

export default function App() {
  const [page, setPage] = useState('home');

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;

      if (hash === '#archive') {
        setPage('archive');
      } else if (hash === '#admin-login') {
        setPage('admin-login');
      } else if (hash === '#admin-upload') {
        setPage('admin-upload');
      } else if (hash === '#admin-brothers') {
        setPage('admin-brothers');
      } else {
        setPage('home');
      }
    };

    window.addEventListener('hashchange', handleHash);
    handleHash();

    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  if (page === 'archive') {
    return (
      <>
        <Navbar />
        <Archive />
        <Footer />
      </>
    );
  }

  if (page === 'admin-login') {
    return (
      <>
        <Navbar />
        <AdminLogin />
        <Footer />
      </>
    );
  }

  if (page === 'admin-upload') {
    return <ArchiveUpload />;
  }

  if (page === 'admin-brothers') {
  return (
    <ProtectedAdminRoute>
      <BrothersManager />
    </ProtectedAdminRoute>
  );
}


  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <History />
        <Brothers />
        <Newsletter />
        <Contact />
      </main>
      <Footer />
    </>
  );
}