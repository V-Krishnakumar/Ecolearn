// src/components/Leaderboard.tsx
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('leaderboard')
        .select(`
          points,
          profiles (username)
        `)
        .order('points', { ascending: false });

      if (error) {
        console.error('Error fetching leaderboard:', error);
      } else {
        setLeaderboard(data || []);
      }
      setLoading(false);
    };

    fetchLeaderboard();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
      <ul className="space-y-2">
        {leaderboard.map((entry, index) => (
          <li key={index} className="p-2 bg-card rounded-lg shadow-card">
            {entry.profiles.username}: {entry.points} points
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;