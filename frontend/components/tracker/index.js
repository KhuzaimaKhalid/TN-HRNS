// components/tracker/index.js
import { useState, useEffect } from 'react';
import { taskAPI } from '../../services/api';

import TrackTimeline from './TrackTimeline';
import TaskDetailView from './TaskDetailView';
import SubmissionView from './SubmissionView';
import InterviewScheduleView from './InterviewScheduleView';
import InterviewResultsView from './InterviewResultsView';
import FinalDecisionView from './FinalDecisionView';

export {
  TrackTimeline,
  TaskDetailView,
  SubmissionView,
  InterviewScheduleView,
  InterviewResultsView,
  FinalDecisionView
};

export default function ApplicationTracker({ applicationData, onBackToDashboard }) {
  const [candidate, setCandidate] = useState(applicationData || {});
  const [activeView, setActiveView] = useState('timeline');
  const [loading, setLoading] = useState(false);

  const candidateId = 
    applicationData?.candidate_id || 
    applicationData?.id || 
    applicationData?.candidate?.id || 
    applicationData?.candidate?.candidate_id;

  useEffect(() => {
    if (applicationData) {
      setCandidate(applicationData);
    }
  }, [applicationData]);

  // Fetch verified Submission properties and apply safely
  useEffect(() => {
    if (!candidateId) {
      console.warn("Could not find candidateId in applicationData:", applicationData);
      return;
    }

    taskAPI.getSubmission(candidateId)
      .then((res) => {
        if (res.success && res.data) {
          setCandidate(prev => ({
            ...prev,
            taskSubmitted: true,
            taskSubmittedDate: res.data.task_submitted_date,
            task_submitted_date: res.data.task_submitted_date,
            task_attachments: res.data.task_attachments || [],
            task_links: res.data.task_links || [],
            task_comments: res.data.task_comments || res.data.comments || ""
          }));
        }
      })
      .catch((err) => {
        console.error("Error syncing task submission into timeline:", err);
      });
  }, [candidateId, applicationData]);

  const handleTaskSubmit = async (taskFormData) => {
    setLoading(true);
    try {
      const response = await taskAPI.submit(taskFormData);
      if (response && response.success) {
        const subData = response.data?.submission || {};
        setCandidate(prev => ({
          ...prev,
          taskSubmitted: true,
          task_submitted_date: subData.created_at || new Date().toISOString(),
          taskSubmittedDate: subData.created_at || new Date().toISOString(),
          // Default fallbacks to prevent screen crashes on empty submits
          task_attachments: [],
          task_links: [],
          task_comments: subData.comments || "N/A"
        }));
        setActiveView('timeline');
      }
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!candidate || Object.keys(candidate).length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', fontFamily: "'Poppins', sans-serif" }}>
        <p style={{ color: '#666666' }}>Loading application details...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100%', width: '100%' }}>
      {activeView === 'timeline' && (
        <TrackTimeline
          candidate={candidate}
          onViewTask={() => setActiveView('task')}
          onViewSubmission={() => setActiveView('submission')}
          onViewInterview={() => setActiveView('interview')}
          onViewResults={() => setActiveView('results')}
          onBack={onBackToDashboard}
        />
      )}

      {activeView === 'task' && (
        <TaskDetailView
          candidate={candidate}
          onBack={() => setActiveView('timeline')}
          onSubmit={handleTaskSubmit}
          isSubmitting={loading}
        />
      )}

      {activeView === 'submission' && (
        <SubmissionView
          candidate={candidate}
          onBack={() => setActiveView('timeline')}
        />
      )}

      {activeView === 'interview' && (
        <InterviewScheduleView
          candidate={candidate}
          onBack={() => setActiveView('timeline')}
        />
      )}

      {activeView === 'results' && (
        <InterviewResultsView
          candidate={candidate}
          onBack={() => setActiveView('timeline')}
        />
      )}

      {activeView === 'decision' && (
        <FinalDecisionView
          candidate={candidate}
          onBack={() => setActiveView('timeline')}
        />
      )}
    </div>
  );
}