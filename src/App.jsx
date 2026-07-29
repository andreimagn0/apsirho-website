import { useEffect, useState } from 'react';
import './index.css';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';

import About from './pages/public/About';
import History from './pages/public/History';
import Brothers from './pages/public/Brothers';
import Newsletter from './pages/public/Newsletter';
import Contact from './pages/public/Contact';
import Archive from './pages/public/Archive';
import './pages/public/Archive.css';

import AdminLogin from './pages/admin/AdminLogin';
import ForgotPassword from './pages/admin/ForgotPassword';
import UpdatePassword from './pages/admin/UpdatePassword';

import ArchiveUpload from './pages/admin/ArchiveUpload';
import BrothersManager from './pages/admin/BrothersManager';
import ProtectedAdminRoute from './pages/admin/ProtectedAdminRoute';
import ClassesManager from './pages/admin/ClassesManager';
import ExecBoardManager from './pages/admin/ExecBoardManager';
import NewsletterManager from './pages/admin/NewsletterManager';

export default function App() {
  const [page, setPage] = useState('home');

  useEffect(() => {
    function handleLocationChange() {
      const queryParameters = new URLSearchParams(
        window.location.search
      );

      const isPasswordRecovery =
        queryParameters.get('password-recovery') === 'true';

      /*
       * The recovery query parameter takes priority because Supabase may
       * temporarily use the URL hash to restore the recovery session.
       */
      if (isPasswordRecovery) {
        setPage('update-password');
        return;
      }

      const hash = window.location.hash;

      if (hash === '#archive') {
        setPage('archive');
      } else if (hash === '#portal') {
        setPage('admin-login');
      } else if (hash === '#forgot-password') {
        setPage('forgot-password');
      } else if (hash === '#update-password') {
        setPage('update-password');
      } else if (hash === '#admin-brothers') {
        setPage('admin-brothers');
      } else if (hash === '#admin-classes') {
        setPage('admin-classes');
      } else if (hash === '#admin-eboard') {
        setPage('admin-eboard');
      } else if (hash === '#admin-archives') {
        setPage('admin-archives');
      } else if (hash === '#admin-newsletter') {
        setPage('admin-newsletter');
      } else {
        setPage('home');
      }
    }

    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);

    handleLocationChange();

    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
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

  if (page === 'portal') {
    return (
      <>
        <Navbar />
        <AdminLogin />
        <Footer />
      </>
    );
  }

  if (page === 'forgot-password') {
    return (
      <>
        <Navbar />
        <ForgotPassword />
        <Footer />
      </>
    );
  }

  if (page === 'update-password') {
    return (
      <>
        <Navbar />
        <UpdatePassword />
        <Footer />
      </>
    );
  }

  if (page === 'admin-brothers') {
    return (
      <ProtectedAdminRoute>
        <BrothersManager />
      </ProtectedAdminRoute>
    );
  }

  if (page === 'admin-classes') {
    return (
      <ProtectedAdminRoute>
        <ClassesManager />
      </ProtectedAdminRoute>
    );
  }

  if (page === 'admin-eboard') {
    return (
      <ProtectedAdminRoute>
        <ExecBoardManager />
      </ProtectedAdminRoute>
    );
  }

  if (page === 'admin-archives') {
    return (
      <ProtectedAdminRoute>
        <ArchiveUpload />
      </ProtectedAdminRoute>
    );
  }

  if (page === 'admin-newsletter') {
    return (
      <ProtectedAdminRoute>
        <NewsletterManager />
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