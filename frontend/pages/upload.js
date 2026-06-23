import Footer from '@/components/Footer';
import DocumentUpload from '@/components/DocumentUpload';

export default function Upload() {
  return (
    <div className="auth-page">
      <div className="auth-wrapper">
        <DocumentUpload />
      </div>
      <Footer />
    </div>
  );
}