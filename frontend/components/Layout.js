// components/Layout.js
export default function Layout({ children }) {
  return (
    <div className="layout-wrapper" style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#effbfb',
    }}>
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}>
        {children}
      </main>
    </div>
  );
}