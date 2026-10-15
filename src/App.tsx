import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
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
import type { AdminTarget } from './components/AdminModal';
import { DestinationModal } from './components/DestinationModal';
import { Lightbox } from './components/Lightbox';
import { MobileStickyBar } from './components/MobileStickyBar';
import { Toast } from './components/Toast';

import { Destination, Poster, Promotion } from './types';
import { useSiteContent } from './hooks/useSiteContent';
import { useAdminSession } from './hooks/useAdminSession';

// El panel admin solo lo usa el dueño: se descarga al abrirlo por primera vez.
const AdminModal = lazy(() => import('./components/AdminModal').then((m) => ({ default: m.AdminModal })));

type ToastState = { show: boolean; title: string; message: string; type: 'success' | 'error' };

export default function App() {
  const content = useSiteContent();
  const admin = useAdminSession();

  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [adminTarget, setAdminTarget] = useState<AdminTarget>({ kind: 'promotion' });
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [lightboxData, setLightboxData] = useState<{ src: string; title: string } | null>(null);

  const [toast, setToast] = useState<ToastState>({ show: false, title: '', message: '', type: 'success' });
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const showToast = useCallback((title: string, message: string, type: 'success' | 'error' = 'success') => {
    clearTimeout(toastTimer.current);
    setToast({ show: true, title, message, type });
    toastTimer.current = setTimeout(() => setToast((prev) => ({ ...prev, show: false })), type === 'error' ? 7000 : 4000);
  }, []);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const openAdmin = useCallback((target: AdminTarget = { kind: 'promotion' }) => {
    setAdminTarget(target);
    setAdminModalOpen(true);
  }, []);
  const closeAdmin = useCallback(() => setAdminModalOpen(false), []);

  const handleLogout = async () => {
    await admin.logout();
    showToast('✅ Sesión cerrada', 'Has salido del panel de administración.');
  };

  const handleDeletePromotion = async (promo: Promotion) => {
    if (!window.confirm(`¿Eliminar la promoción "${promo.title}"?`)) return;
    const err = await content.removePromotion(promo.id);
    if (err) showToast('❌ No se eliminó', err, 'error');
    else showToast('Promoción eliminada', `"${promo.title}" ya no está publicada.`);
  };

  const handleDeletePoster = async (poster: Poster) => {
    if (!window.confirm(`¿Eliminar el poster "${poster.title}"?`)) return;
    const err = await content.removePoster(poster.id);
    if (err) showToast('❌ No se eliminó', err, 'error');
    else showToast('Poster eliminado', `"${poster.title}" ya no está publicado.`);
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] text-slate-900 font-sans antialiased selection:bg-orange-500 selection:text-white">
      <Toast
        show={toast.show}
        title={toast.title}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      />

      <Navbar
        onOpenAdmin={() => openAdmin()}
        onEditBanner={() => openAdmin({ kind: 'banner' })}
        isAdmin={admin.isAdmin}
        bannerText={content.bannerText}
      />

      <Hero />
      <Marquee />
      <Destinations onSelectDestination={setSelectedDestination} />

      <Promotions
        promotions={content.promotions}
        isLoading={content.promosLoading}
        isAdmin={admin.isAdmin}
        offline={content.offline}
        onRetry={content.reload}
        onDeletePromo={handleDeletePromotion}
        onEditPromo={(item) => openAdmin({ kind: 'promotion', item })}
        onOpenAddPromoModal={() => openAdmin({ kind: 'promotion' })}
      />

      <Posters
        posters={content.posters}
        isLoading={content.postersLoading}
        isAdmin={admin.isAdmin}
        onSelectImage={(src, title) => setLightboxData({ src, title })}
        onDeletePoster={handleDeletePoster}
        onEditPoster={(item) => openAdmin({ kind: 'poster', item })}
        onOpenUploadPosterModal={() => openAdmin({ kind: 'poster' })}
      />

      <Experiences />
      <CTASection />
      <ContactSection onShowToast={showToast} />
      <Footer />
      <MobileStickyBar />

      {adminModalOpen && (
        <Suspense fallback={null}>
          <AdminModal
            isOpen={adminModalOpen}
            isAdmin={admin.isAdmin}
            email={admin.email}
            target={adminTarget}
            bannerText={content.bannerText}
            onClose={closeAdmin}
            onChangeTarget={setAdminTarget}
            onLogin={admin.login}
            onLogout={handleLogout}
            onSavePromotion={content.savePromotion}
            onSavePoster={content.savePoster}
            onSaveBanner={content.updateBanner}
            onShowToast={showToast}
          />
        </Suspense>
      )}

      <DestinationModal destination={selectedDestination} onClose={() => setSelectedDestination(null)} />

      <Lightbox
        imageSrc={lightboxData?.src || null}
        title={lightboxData?.title || ''}
        onClose={() => setLightboxData(null)}
      />
    </div>
  );
}
