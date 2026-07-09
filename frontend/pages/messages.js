import { useEffect, useState } from 'react';
import HRLayout from '@/components/HRLayout';
import HRPageLayout from '@/components/HRPageLayout';
import { messageAPI } from '@/services/api'; // 👈 Import your API layer

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const colors = {
    primary: '#007A7C',
    border: '#020a14',
    textDark: '#1A1A1A',
    textGray: '#666666',
  };

  // ─── Fetch real database messages on load ───────────────────
  useEffect(() => {
    const fetchInbox = async () => {
      try {
        setLoading(true);
        const res = await messageAPI.getInbox();
        // Since your Postman response shows: { status: "success", messages: [...] }
        if (res && res.messages) {
          setMessages(res.messages);
        }
      } catch (err) {
        console.error("Failed to load messages:", err);
        setError("Could not retrieve messages from backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchInbox();
  }, []);

  return (
    <HRLayout>
      <HRPageLayout title="Messages">
        <div style={{ background: 'white', border: `1px solid ${colors.border}`, borderRadius: '16px', padding: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: colors.textDark, marginBottom: '16px' }}>Inbox</h2>
          
          {loading && <p style={{ color: colors.textGray }}>Loading messages...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          
          {!loading && !error && messages.length === 0 && (
            <p style={{ color: colors.textGray }}>Your inbox is empty.</p>
          )}

          {!loading && !error && messages.map((msg, idx) => (
            <div key={msg.message_id || idx} style={{ padding: '16px 0', borderBottom: idx < messages.length - 1 ? `1px solid ${colors.border}` : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* Check your DB field 'is_read'. If false, show the unread badge */}
                {!msg.is_read && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: colors.primary }}></div>}
                <div>
                  {/* Shows actual sender identity id or matching text */}
                  <h4 style={{ margin: 0, fontSize: '15px', fontWeight: !msg.is_read ? 600 : 400, color: colors.textDark }}>
                    Sender ID: {msg.sender_id}
                  </h4>
                  <p style={{ margin: '4px 0 0 0', fontSize: '14px', fontWeight: 600, color: colors.textDark }}>{msg.subject}</p>
                  <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: colors.textGray }}>{msg.body}</p>
                </div>
              </div>
              <span style={{ fontSize: '12px', color: colors.textGray }}>
                {new Date(msg.created_at).toLocaleDateString()}
              </span>
            </div>
          ))}
          
          <div style={{ marginTop: '16px', textAlign: 'center' }}>
            <button style={{ background: 'transparent', border: `1px solid ${colors.border}`, padding: '8px 24px', borderRadius: '6px', cursor: 'pointer', fontFamily: "'Poppins', sans-serif", color: colors.textDark }}>
              View All Messages
            </button>
          </div>
        </div>
      </HRPageLayout>
    </HRLayout>
  );
}