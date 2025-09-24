// src/components/ActivityForm.tsx
import { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { createActivity, updateLeaderboard } from '@/lib/profile';

const ActivityForm = () => {
  const { user } = useUser();
  const [type, setType] = useState('');
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (!user) {
        alert('Please log in to submit an activity.');
        return;
      }

      // Create activity
      const activityResult = await createActivity(user.id, type, points);
      if (!activityResult.success) {
        alert(`Error adding activity: ${activityResult.error}`);
        return;
      }

      // Update leaderboard
      const leaderboardResult = await updateLeaderboard(user.id, points);
      if (!leaderboardResult.success) {
        console.error('Error updating leaderboard:', leaderboardResult.error);
        alert('Activity logged but leaderboard update failed.');
        return;
      }

      alert('Activity logged and points updated!');
      setType('');
      setPoints(0);
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Log Activity</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={type}
          onChange={(e) => setType(e.target.value)}
          placeholder="Activity type (e.g., quiz)"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          value={points}
          onChange={(e) => setPoints(Number(e.target.value))}
          placeholder="Points"
          className="w-full p-2 border rounded"
          required
        />
        <button 
          type="submit" 
          disabled={loading}
          className="px-4 py-2 bg-primary text-primary-foreground rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default ActivityForm;
