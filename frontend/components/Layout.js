import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <div className="layout-wrapper" style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      width: '100%',
      maxWidth: '100%',
    }}>
      <main style={{
        flex: 1,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 24px',
        width: '100%',
        maxWidth: '100%',
      }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}