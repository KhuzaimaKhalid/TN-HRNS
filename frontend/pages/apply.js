import { useRouter } from 'next/router';
import Footer from '@/components/Footer';
import JobApplication from '@/components/JobApplication';
// ❌ import Background from '@/components/Background'; ← delete this

export default function Apply() {
  const router = useRouter();

  const handleClose = () => router.push('/');
  const handleNavigate = (path) => router.push(path);

  return (
    <div className="auth-page">
      {/* ❌ <Background /> ← delete this */}
      <div className="auth-wrapper">
        <JobApplication onClose={handleClose} onNavigate={handleNavigate} />
      </div>
      <Footer />
    </div>
  );
}