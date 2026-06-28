import Footer from '@/components/Footer';
import InterviewDetails from '@/components/InterviewDetails';

export default function Interview() {
  // In future, fetch interview data by application ID from API
  const mockInterview = {
    date: '18 Jun 2026',
    day: 'Tuesday',
    time: '04:00 PM - 05:00 PM',
    meetLink: 'https://meet.google.com/abc-tgibc-nwl',
    interviewer: 'Mr. Ahmad',
    notes: 'Please have your portfolio ready.',
  };

  return (
    <div className="auth-page">
      <div className="auth-wrapper">
        <InterviewDetails interview={mockInterview} />
      </div>
      <Footer />
    </div>
  );
}