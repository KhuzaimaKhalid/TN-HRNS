import { useRouter } from 'next/router';
import Footer from '@/components/Footer';
import JobApplication from '@/components/JobApplication';

export default function Apply() {
  const router = useRouter();

  return (
    <div className="auth-page">
      <div className="auth-wrapper">
        <JobApplication />
      </div>
      <Footer />
    </div>
  );
}