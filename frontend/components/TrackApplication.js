import { useState, useEffect } from 'react';
import { 
  TrackTimeline, 
  SubmissionView, 
  TaskDetailView, 
  InterviewScheduleView, 
  InterviewResultsView, 
  FinalDecisionView 
} from '@/components/tracker'; 
import { applicationAPI, uploadAPI } from '@/services/api'; // ✅ Integrated uploadAPI

export default function TrackApplication({ email, onBack }) {
  // --- Navigation & View State ---
  const [activeView, setActiveView] = useState('timeline');
  const [candidateData, setCandidateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch candidate tracking data on mount
  useEffect(() => {
    async function fetchTrackingDetails() {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch status using the email of the logged-in candidate
        const response = await applicationAPI.getStatusByEmail(email);
        if (response && response.success) {
          setCandidateData(response.data);
        } else {
          setError('Failed to load tracking details.');
        }
      } catch (err) {
        console.error('Error fetching tracker details:', err);
        setError(err.message || 'An error occurred while fetching tracking data.');
      } finally {
        setLoading(false);
      }
    }

    if (email) {
      fetchTrackingDetails();
    }
  }, [email]);

  // --- Handle Task Submissions ---
  // --- Handle Task Submissions ---
  const handleTaskSubmit = async (submissionPayload) => {
    try {
      setLoading(true);
      setError(null);

      let uploadedFileUrls = [];

      // 1. Upload files by mapping them to the specific onboarding keys expected by the database
      if (submissionPayload.files && submissionPayload.files.length > 0) {
        const docPayload = {};
        
        // Map files to onboarding slots to prevent validation failures
        if (submissionPayload.files[0]) docPayload['resume'] = submissionPayload.files[0];
        if (submissionPayload.files[1]) docPayload['cnicFront'] = submissionPayload.files[1];
        if (submissionPayload.files[2]) docPayload['cnicBack'] = submissionPayload.files[2];

        // Only upload if all three required onboarding files are supplied
        if (docPayload['resume'] && docPayload['cnicFront'] && docPayload['cnicBack']) {
          const fileUploadResponse = await uploadAPI.uploadDocuments(docPayload);
          if (fileUploadResponse && fileUploadResponse.status === 'success') {
            const docs = fileUploadResponse.document;
            uploadedFileUrls = [docs.cv_path, docs.cnic_front_path, docs.cnic_back_path];
          } else {
            throw new Error(fileUploadResponse?.message || 'Failed to complete document uploads.');
          }
        }
      }

      // 2. Format details to transition application state to "Task Submitted" 
      const submissionData = {
        applied_position: candidateData?.position || 'AI Engineer Intern',
        task_links: submissionPayload.link ? [{ label: 'Repository Link', url: submissionPayload.link }] : [],
        task_comments: submissionPayload.comments || '',
        task_attachments: uploadedFileUrls,
        status: 'Task Submitted' // Update application status stage
      };

      // 3. Post to submit-application
      const submitResponse = await applicationAPI.submit(submissionData.applied_position);

      if (!submitResponse || !submitResponse.success) {
        throw new Error('Failed to record submission status in the application.');
      }

      // 4. Force state-sync refresh to pull updated stages on the timeline
      const refreshResponse = await applicationAPI.getStatusByEmail(email);
      if (refreshResponse && refreshResponse.success) {
        setCandidateData(refreshResponse.data);
      }
      
      // Go back to the timeline tracker UI
      setActiveView('timeline');
    } catch (err) {
      console.error('Submission failed:', err);
      alert(err.message || 'Error occurred while saving your task submission.');
    } finally {
      setLoading(false);
    }
  };

  // --- Loader and Error Handlers ---
  if (loading && activeView === 'timeline') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px', color: '#007A7C', fontFamily: "'Poppins', sans-serif" }}>
        <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i> Loading application details...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', fontFamily: "'Poppins', sans-serif" }}>
        <p style={{ color: '#dc3545' }}>{error}</p>
        <button 
          onClick={onBack} 
          style={{ background: '#007A7C', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  // --- View Router ---
  switch (activeView) {
    case 'view_task':
      return (
        <TaskDetailView 
          candidate={candidateData} 
          onBack={() => setActiveView('timeline')} 
          onSubmit={handleTaskSubmit} // ✅ Wire callback here
        />
      );

    case 'view_submission':
      return (
        <SubmissionView 
          candidate={candidateData} 
          onBack={() => setActiveView('timeline')} 
        />
      );

    case 'view_interview':
      return (
        <InterviewScheduleView 
          candidate={candidateData} 
          onBack={() => setActiveView('timeline')} 
        />
      );

    case 'view_results':
      return (
        <InterviewResultsView 
          candidate={candidateData} 
          onBack={() => setActiveView('timeline')} 
        />
      );

    case 'view_decision':
      return (
        <FinalDecisionView 
          candidate={candidateData} 
          onBack={() => setActiveView('timeline')} 
        />
      );

    case 'timeline':
    default:
      return (
        <TrackTimeline
          candidate={candidateData}
          onViewTask={() => setActiveView('view_task')}
          onViewSubmission={() => setActiveView('view_submission')}
          onViewInterview={() => setActiveView('view_interview')}
          onViewResults={() => setActiveView('view_results')}
          onBack={onBack}
        />
      );
  }
}