import Footer from '@/components/Footer';
import TrackApplication from '@/components/TrackApplication';

export default function Track() {
  // In future, fetch candidate data by email from API
  // For now, we pass mock data as prop
  const mockCandidate = {
    name: 'Ayesha Khan',
    role: 'AI Engineer Intern',
    appliedDate: '2nd June 2026',
    statuses: [
      { stage: 'Submitted', date: '02 Jun 2026', description: 'Application received' },
      { stage: 'Under Review', date: '06 Jun 2026', description: 'Your profile is being reviewed' },
      { stage: 'Interview Scheduled', date: '10 Jun 2026', description: 'Interview scheduled for 18 Jun' },
      { stage: 'Selected', date: null, description: 'Decision pending' },
    ],
    interview: {
      date: '18 Jun 2026',
      day: 'Tuesday',
      time: '04:00 PM',
      meetLink: 'https://meet.google.com/abc-tgibc-nwl',
    },
    finalStatus: 'Interview Scheduled',
  };

  return (
    <div className="auth-page">
      <div className="auth-wrapper">
        <TrackApplication candidate={mockCandidate} />
      </div>
      <Footer />
    </div>
  );
}