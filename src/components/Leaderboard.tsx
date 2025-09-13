// src/components/Leaderboard.tsx
import { useState, useEffect } from 'react';
import { fetchLeaderboard, LeaderboardEntry } from '@/lib/profile';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeaderboard = async () => {
      setLoading(true);
      try {
        const data = await fetchLeaderboard(10);
        setLeaderboard(data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboard();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
      <ul className="space-y-2">
        {leaderboard.map((entry, index) => (
          <li key={entry.id} className="p-2 bg-card rounded-lg shadow-card">
            <div className="flex justify-between items-center">
              <span className="font-medium">
                #{index + 1} {entry.profiles?.username || 'Unknown User'}
              </span>
              <span className="text-primary font-bold">{entry.points} points</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;