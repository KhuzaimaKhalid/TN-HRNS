// pages/track.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import {
  TrackTimeline,
  TaskDetailView,
  SubmissionView,
  InterviewScheduleView,
  InterviewResultsView,
  FinalDecisionView,
} from '@/components/tracker';

export default function Track() {
  const router = useRouter();
  const [view, setView] = useState('timeline'); // timeline | task | submission | interview | results | decision

  // Mock candidate data – replace with real API data later
  const [candidate] = useState({
    id: 1,
    name: 'Ayesha Khan',
    role: 'AI Engineer Intern',
    appliedDate: '2nd June 2026',
    submittedDate: '02 Jun 2026',
    taskAssignedDate: '05 Jun 2026',
    taskAssigned: true,
    taskSubmittedDate: '08 Jun 2026',
    taskSubmitted: true,
    interviewDate: '12 Jun 2026, 10:00 AM',
    interviewScheduled: true,
    interviewClearedDate: '15 Jun 2026',
    interviewCleared: true,
    decision: 'Selected', // Selected | Rejected | Waiting list | null
    decisionReason: null,
    taskStatus: 'Pending',
  });

  const renderView = () => {
    switch (view) {
      case 'timeline':
        return (
          <TrackTimeline
            candidate={candidate}
            onViewTask={() => setView('task')}
            onViewSubmission={() => setView('submission')}
            onViewInterview={() => setView('interview')}
            onViewResults={() => setView('results')}
            onBack={() => router.push('/dashboard')}
          />
        );
      case 'task':
        return (
          <TaskDetailView
            candidate={candidate}
            onBack={() => setView('timeline')}
            onSubmit={(data) => {
              console.log('Task submitted:', data);
              alert('Task submitted successfully!');
              setView('timeline');
            }}
          />
        );
      case 'submission':
        return (
          <SubmissionView
            candidate={candidate}
            onBack={() => setView('timeline')}
          />
        );
      case 'interview':
        return (
          <InterviewScheduleView
            candidate={candidate}
            onBack={() => setView('timeline')}
          />
        );
      case 'results':
        return (
          <InterviewResultsView
            candidate={candidate}
            onBack={() => setView('timeline')}
          />
        );
      case 'decision':
        return (
          <FinalDecisionView
            candidate={candidate}
            onBack={() => setView('timeline')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div style={{ padding: '40px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        {renderView()}
      </div>
    </Layout>
  );
}