import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <div className="layout-wrapper">
      {/* Header removed – portal mode */}
      <main>{children}</main>
      <Footer />
    </div>
  );
}