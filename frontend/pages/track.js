import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { applicationAPI, taskAPI } from '@/services/api';

import TrackTimeline from '@/components/tracker/TrackTimeline';
import TaskDetailView from '@/components/tracker/TaskDetailView';
import SubmissionView from '@/components/tracker/SubmissionView';
import InterviewScheduleView from '@/components/tracker/InterviewScheduleView';
import InterviewResultsView from '@/components/tracker/InterviewResultsView';
import FinalDecisionView from '@/components/tracker/FinalDecisionView';

function mapDashboardToCandidate(raw) {
  const currentStatus = raw.status?.current || 'Submitted';

  const taskAssigned = ['Task Assigned', 'Task Submitted', 'Interview Scheduled', 'Interview Cleared', 'Selected', 'Rejected'].includes(currentStatus);
  const taskSubmitted = ['Task Submitted', 'Interview Scheduled', 'Interview Cleared', 'Selected', 'Rejected'].includes(currentStatus);
  const interviewScheduled = ['Interview Scheduled', 'Interview Cleared', 'Selected', 'Rejected'].includes(currentStatus);
  const interviewCleared = ['Interview Cleared', 'Selected', 'Rejected'].includes(currentStatus);

  let decision = null;
  if (['Selected', 'Rejected', 'Waiting list'].includes(currentStatus)) {
    decision = currentStatus;
  }

  return {
    id: raw.candidate_id || raw.id || raw.candidateId,
    candidate_id: raw.candidate_id || raw.id || raw.candidateId,
    application_id: raw.application_id || raw.applicationId,
    name: raw.name,
    role: raw.status?.position,
    appliedDate: raw.status?.appliedDate,
    submittedDate: raw.status?.appliedDate,
    taskAssigned,
    taskSubmitted,
    interviewScheduled,
    interviewCleared,
    interviewDate: raw.interview ? `${raw.interview.date}, ${raw.interview.time}` : null,
    decision,
    decisionReason: null,
    interview: raw.interview
      ? {
          date: raw.interview.date,
          day: raw.interview.day,
          time: raw.interview.time,
          meetLink: raw.interview.meetLink || null,
          interviewer: raw.interview.interviewer || null,
          notes: raw.interview.notes || null,
        }
      : null,
    submission_title: null,
    task_submitted_date: null,
    task_attachments: [],
    task_links: [],
    task_comments: '',
    taskStatus: currentStatus,
  };
}

export default function Track() {
  const router = useRouter();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [view, setView] = useState('timeline');

  async function fetchData() {
    try {
      const response = await applicationAPI.getAll();
      if ((response.status === 'success' || response.success) && response.data) {
        const mapped = mapDashboardToCandidate(response.data);
        setCandidate(mapped);

        // Fetch the real task submission (dashboard endpoint doesn't include
        // this) so "Task Submitted" shows the actual date instead of the
        // TrackTimeline component's hardcoded placeholder fallback.
        if (mapped.taskSubmitted && mapped.candidate_id) {
          try {
            const subRes = await taskAPI.getSubmission(mapped.candidate_id);
            if (subRes?.success && subRes.data) {
              const rawDate = subRes.data.task_submitted_date;
              const formattedDate = rawDate
                ? new Date(rawDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                : null;
              setCandidate(prev => ({
                ...prev,
                taskSubmittedDate: formattedDate,
                task_submitted_date: rawDate,
                submission_title: subRes.data.submission_title || null,
                task_attachments: subRes.data.task_attachments || [],
                task_links: subRes.data.task_links || [],
                task_comments: subRes.data.task_comments || '',
              }));
            }
          } catch (subErr) {
            console.error('Error fetching real task submission date:', subErr);
          }
        }
      } else {
        setError('Failed to load application data.');
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const goBack = () => setView('timeline');
  const handleViewTask = () => setView('task');
  const handleViewSubmission = () => setView('submission');
  const handleViewInterview = () => setView('interview');
  const handleViewResults = () => setView('results');

  // pages/track.js

  const handleSubmitWork = async (submissionData) => {
    setSubmitting(true);
    try {
      // Use the candidate submit method, NOT the HR create method!
      const response = await taskAPI.submit(submissionData);
      if (response) {
        // Refresh the dashboard status after successful submission
        await fetchData();
        setView('timeline');
      }
    } catch (error) {
      console.error("Failed uploading task to backend:", error);
      alert(error.message || "Error submitting task. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#effbfb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading your application status…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', background: '#effbfb', padding: '40px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ maxWidth: '500px', textAlign: 'center', color: '#c0392b' }}>
          <h2>Oops!</h2>
          <p>{error}</p>
          <button
            onClick={() => router.push('/dashboard')}
            style={{ marginTop: '16px', padding: '10px 24px', background: '#007A7C', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div style={{ minHeight: '100vh', background: '#effbfb', padding: '40px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ maxWidth: '500px', textAlign: 'center' }}>
          <h2>No application found</h2>
          <p>You haven’t applied to any position yet.</p>
          <button
            onClick={() => router.push('/apply')}
            style={{ marginTop: '16px', padding: '10px 24px', background: '#007A7C', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
          >
            Apply Now
          </button>
        </div>
      </div>
    );
  }

  const commonProps = { candidate, onBack: goBack };

  switch (view) {
    case 'timeline':
      return (
        <div style={{ padding: '40px 20px', background: '#effbfb', minHeight: '100vh' }}>
          <TrackTimeline
            candidate={candidate}
            onViewTask={handleViewTask}
            onViewSubmission={handleViewSubmission}
            onViewInterview={handleViewInterview}
            onViewResults={handleViewResults}
            onBack={() => router.push('/dashboard')}
          />
        </div>
      );
    case 'task':
      return (
        <div style={{ padding: '40px 20px', background: '#effbfb', minHeight: '100vh' }}>
          <TaskDetailView 
            {...commonProps} 
            onSubmit={handleSubmitWork} 
            isSubmitting={submitting} 
          />
        </div>
      );
    case 'submission':
      return (
        <div style={{ padding: '40px 20px', background: '#effbfb', minHeight: '100vh' }}>
          <SubmissionView {...commonProps} />
        </div>
      );
    case 'interview':
      return (
        <div style={{ padding: '40px 20px', background: '#effbfb', minHeight: '100vh' }}>
          <InterviewScheduleView {...commonProps} />
        </div>
      );
    case 'results':
      return (
        <div style={{ padding: '40px 20px', background: '#effbfb', minHeight: '100vh' }}>
          <InterviewResultsView {...commonProps} />
        </div>
      );
    case 'decision':
      return (
        <div style={{ padding: '40px 20px', background: '#effbfb', minHeight: '100vh' }}>
          <FinalDecisionView {...commonProps} />
        </div>
      );
    default:
      return <div>Unknown view</div>;
  }
}