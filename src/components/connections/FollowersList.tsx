import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { fetchFollowers, removeFollower } from '../../redux/followersSlice';

interface FollowersListProps {
  searchQuery: string;
}

function FollowersList({ searchQuery }: FollowersListProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { followers, isLoading, error } = useSelector((state: RootState) => state.followers);

  useEffect(() => {
    dispatch(fetchFollowers());
  }, [dispatch]);

  const handleRemoveFollower = async (userId: string) => {
    try {
      await dispatch(removeFollower(userId)).unwrap();
    } catch (err) {
      console.error('Failed to remove follower:', err);
    }
}

  const filteredFollowers = followers.filter((follower) =>
    follower.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  return (
    <div>
      {filteredFollowers.map((follower) => (
        <div
          key={follower._id}
          className="flex justify-between items-center py-4 border-b last:border-b-0"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              {follower.name.charAt(0)}
            </div>
            <p className="text-gray-700 font-medium">{follower.name}</p>
          </div>
          <button className="text-[#1DAEDE] border border-[#1DAEDE] rounded-lg py-1 px-3 text-sm hover:bg-[#1DAEDE] hover:text-white transition" onClick={() => handleRemoveFollower(follower._id)}>
            Remove
          </button>
        </div>
      ))}
      {filteredFollowers.length === 0 && !isLoading && !error && (
        <div className="text-center py-4 text-gray-500">
          No followers found matching your search.
        </div>
      )}
    </div>
  );
}

export default FollowersList;

