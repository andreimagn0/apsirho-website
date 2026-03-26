import { useState, useEffect } from 'react';
import './index.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import History from './components/History';
import Brothers from './components/Brothers';
import Newsletter from './components/Newsletter';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Archive from './pages/Archive';
import './pages/Archive.css';
import AdminLogin from './pages/AdminLogin';
import ArchiveUpload from './pages/ArchiveUpload';

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
    return (
      <>
        <Navbar />
        <ArchiveUpload />
        <Footer />
      </>
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