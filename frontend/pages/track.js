import { useRouter } from 'next/router';
import Footer from '@/components/Footer';
import TrackApplication from '@/components/TrackApplication';
// ❌ import Background from '@/components/Background'; ← delete this

export default function Track() {
  const router = useRouter();

  const handleClose = () => router.push('/');
  const handleNavigate = (path) => router.push(path);

  return (
    <div className="auth-page">
      {/* ❌ <Background /> ← delete this */}
      <div className="auth-wrapper">
        <TrackApplication onClose={handleClose} onNavigate={handleNavigate} />
      </div>
      <Footer />
    </div>
  );
}