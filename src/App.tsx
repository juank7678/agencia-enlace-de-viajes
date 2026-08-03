import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Marquee } from './components/Marquee';
import { Destinations } from './components/Destinations';
import { Promotions } from './components/Promotions';
import { Posters } from './components/Posters';
import { Experiences } from './components/Experiences';
import { CTASection } from './components/CTASection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AdminModal } from './components/AdminModal';
import { DestinationModal } from './components/DestinationModal';
import { Lightbox } from './components/Lightbox';
import { MobileStickyBar } from './components/MobileStickyBar';
import { Toast } from './components/Toast';

import { Destination, Poster, Promotion } from './types';
import {
  getPromotionsFromSupabase,
  createPromotionInSupabase,
  deletePromotionFromSupabase,
  getPostersFromSupabase,
  createPosterInSupabase,
  deletePosterFromSupabase,
} from './services/api';
import { setAdminToken, getAdminToken, clearAdminToken, isAdminTokenValid } from './lib/auth';

export default function App() {
  // Supabase state
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [posters, setPosters] = useState<Poster[]>([]);
  const [promosLoading, setPromosLoading] = useState<boolean>(true);
  const [postersLoading, setPostersLoading] = useState<boolean>(true);

  // Admin auth state
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return isAdminTokenValid();
    } catch (err) {
      console.error('Error checking admin token:', err);
      return false;
    }
  });

  // Banner text
  const [bannerText, setBannerText] = useState<string>(() => {
    return (
      localStorage.getItem('enlace_banner_text') ||
      '🌟 <strong>OFERTA ESPECIAL:</strong> 20% de descuento en paquetes al Caribe Colombiano · Código: <strong>CARIBE2026</strong> · Válido hasta el 31 de agosto'
    );
  });

  // Modals & Popups
  const [adminModalOpen, setAdminModalOpen] = useState<boolean>(false);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [lightboxData, setLightboxData] = useState<{ src: string; title: string } | null>(null);

  // Toast Notification System
  const [toast, setToast] = useState<{
    show: boolean;
    title: string;
    message: string;
    type: 'success' | 'error';
  }>({
    show: false,
    title: '',
    message: '',
    type: 'success',
  });

  const showToastNotification = (title: string, message: string, type: 'success' | 'error' = 'success') => {
    setToast({
      show: true,
      title,
      message,
      type,
    });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 4000);
  };

  // Initial Supabase Data Fetching (Fase 1)
  useEffect(() => {
    async function loadData() {
      setPromosLoading(true);
      setPostersLoading(true);

      const [promosData, postersData] = await Promise.all([
        getPromotionsFromSupabase(),
        getPostersFromSupabase(),
      ]);

      setPromotions(promosData);
      setPromosLoading(false);

      setPosters(postersData);
      setPostersLoading(false);
    }

    loadData();
  }, []);

  // Admin Login Handler
  const handleAdminLogin = (passcode: string): boolean => {
    const correctPasscode = import.meta.env.VITE_ADMIN_PASSCODE || 'EnlaceSeguro2026';
    const isValid = passcode.trim() === correctPasscode;

    if (isValid) {
      try {
        const token = btoa(passcode + Date.now());
        setAdminToken(token);
        setIsAdmin(true);
        showToastNotification('✅ Acceso Concedido', 'Modo de administración activado.');
        return true;
      } catch (err) {
        console.error('Error setting admin token:', err);
        showToastNotification('Error', 'No se pudo iniciar sesión de admin.', 'error');
        return false;
      }
    } else {
      showToastNotification('❌ Acceso Denegado', 'Contraseña incorrecta.', 'error');
      return false;
    }
  };

  const handleAdminLogout = () => {
    try {
      clearAdminToken();
      setIsAdmin(false);
      showToastNotification('Sesión cerrada', 'Modo de administración bloqueado.');
    } catch (err) {
      console.error('Error logging out:', err);
      setIsAdmin(false);
    }
  };

  // Promotions Management (Supabase REST)
  const handleAddPromotion = async (promoData: {
    title: string;
    description: string;
    price: string;
    badge: string;
    category: string;
    image: string;
  }) => {
    const { promotion } = await createPromotionInSupabase(promoData);
    if (promotion) {
      setPromotions((prev) => [promotion, ...prev]);
    }
  };

  const handleDeletePromotion = async (id: string | number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta promoción de Supabase?')) return;
    await deletePromotionFromSupabase(id);
    setPromotions((prev) => prev.filter((p) => String(p.id) !== String(id)));
    showToastNotification('Promoción eliminada', 'La promoción fue removida correctamente.');
  };

  // Posters Management (Supabase REST)
  const handleAddPoster = async (posterData: {
    title: string;
    folder: string;
    image: string;
  }) => {
    const { poster } = await createPosterInSupabase(posterData);
    if (poster) {
      setPosters((prev) => [poster, ...prev]);
    }
  };

  const handleDeletePoster = async (id: string | number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este poster de Supabase?')) return;
    await deletePosterFromSupabase(id);
    setPosters((prev) => prev.filter((p) => String(p.id) !== String(id)));
    showToastNotification('Poster eliminado', 'La publicación fue eliminada correctamente.');
  };

  // Banner Update
  const handleUpdateBanner = (text: string) => {
    setBannerText(text);
    localStorage.setItem('enlace_banner_text', text);
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] text-slate-900 font-sans antialiased selection:bg-orange-500 selection:text-white">
      {/* Toast Overlay */}
      <Toast
        show={toast.show}
        title={toast.title}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      />

      {/* Navigation Bar (Fase 5: Official Logo Integration) */}
      <Navbar
        onOpenAdmin={() => setAdminModalOpen(true)}
        isAdmin={isAdmin}
        bannerText={bannerText}
      />

      {/* Hero Section */}
      <Hero />

      {/* Continuous Marquee Ticker */}
      <Marquee />

      {/* Destinations Section */}
      <Destinations
        onSelectDestination={(dest) => setSelectedDestination(dest)}
      />

      {/* Promotions Section (Fase 1 & Fase 3: Supabase connected + Public clean view) */}
      <Promotions
        promotions={promotions}
        isLoading={promosLoading}
        isAdmin={isAdmin}
        onDeletePromo={handleDeletePromotion}
        onOpenAddPromoModal={() => setAdminModalOpen(true)}
      />

      {/* Posters Section (Fase 1 & Fase 3: Supabase connected + Public clean view) */}
      <Posters
        posters={posters}
        isLoading={postersLoading}
        isAdmin={isAdmin}
        onSelectImage={(src, title) => setLightboxData({ src, title })}
        onDeletePoster={handleDeletePoster}
        onOpenUploadPosterModal={() => setAdminModalOpen(true)}
      />

      {/* Travel Experiences */}
      <Experiences />

      {/* Custom Tailored Trip Request */}
      <CTASection />

      {/* Contact Section (Fase 2: Connected to Supabase contacts table) */}
      <ContactSection onShowToast={showToastNotification} />

      {/* Footer (Fase 5) */}
      <Footer />

      {/* Sticky Bottom Bar for Mobile Conversion */}
      <MobileStickyBar />

      {/* Admin Panel & Password Authentication Modal (Fase 4) */}
      <AdminModal
        isOpen={adminModalOpen}
        isAdmin={isAdmin}
        onClose={() => setAdminModalOpen(false)}
        onLogin={handleAdminLogin}
        onLogout={handleAdminLogout}
        onAddPromotion={handleAddPromotion}
        onAddPoster={handleAddPoster}
        onUpdateBanner={handleUpdateBanner}
        onShowToast={showToastNotification}
      />

      {/* Destination Detail Popup Modal */}
      <DestinationModal
        destination={selectedDestination}
        onClose={() => setSelectedDestination(null)}
      />

      {/* Fullscreen Poster Lightbox */}
      <Lightbox
        imageSrc={lightboxData?.src || null}
        title={lightboxData?.title || ''}
        onClose={() => setLightboxData(null)}
      />
    </div>
  );
}
