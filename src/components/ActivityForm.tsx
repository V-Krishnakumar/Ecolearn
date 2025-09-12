// src/components/ActivityForm.tsx
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

const ActivityForm = () => {
  const [type, setType] = useState('');
  const [points, setPoints] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('Please log in to submit an activity.');
      return;
    }

    const { error: activityError } = await supabase
      .from('activities')
      .insert({ user_id: user.id, type, points });

    if (activityError) {
      console.error('Error adding activity:', activityError);
      return;
    }

    // Update leaderboard points
    const { error: leaderboardError } = await supabase.rpc('increment_points', {
      user_id_param: user.id,
      points_param: points
    });

    if (leaderboardError) {
      console.error('Error updating leaderboard:', leaderboardError);
    } else {
      alert('Activity logged and points updated!');
      setType('');
      setPoints(0);
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
        <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded">
          Submit
        </button>
      </form>
    </div>
  );
};

export default ActivityForm;