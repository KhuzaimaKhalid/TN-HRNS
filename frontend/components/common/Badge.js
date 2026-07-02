// components/common/Badge.js
export default function Badge({ status }) {
  const safeStatus = status || 'N/A';
  const getClass = (s) => {
    const map = {
      'Selected': 'selected',
      'Rejected': 'rejected',
      'Interview': 'interview',
      'Shortlisted': 'shortlisted',
      'Submitted': 'submitted',
      'Interview Scheduled': 'interview',
      'N/A': 'submitted'
    };
    return `status-badge ${map[s] || 'submitted'}`;
  };
  return <span className={getClass(safeStatus)}>{safeStatus}</span>;
}