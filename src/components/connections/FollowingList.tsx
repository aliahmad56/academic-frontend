import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { fetchFollowing, unfollowUser } from "../../redux/followingSlice";

interface FollowingListProps {
  searchQuery: string;
}

function FollowingList({ searchQuery }: FollowingListProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { following, isLoading, error } = useSelector(
    (state: RootState) => state.following
  );

  useEffect(() => {
    dispatch(fetchFollowing());
  }, [dispatch]);

  const handleUnfollow = async (userId: string) => {
    try {
      await dispatch(unfollowUser(userId)).unwrap();
    } catch (err) {
      console.error('Failed to unfollow user:', err);
    }
  };

  const filteredFollowing = following.filter((item) =>
    item.following.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  return (
    <div>
      {filteredFollowing.map((item) => (
        <div
          key={item.following._id}
          className="flex justify-between items-center py-4 border-b last:border-b-0"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              {item.following.name.charAt(0)}
            </div>
            <p className="text-gray-700 font-medium">{item.following.name}</p>
          </div>
          <button
            className="text-[#1DAEDE] border border-[#1DAEDE] rounded-lg py-1 px-3 text-sm hover:bg-[#1DAEDE] hover:text-white transition"
            onClick={() => handleUnfollow(item.following._id)}
          >
            Unfollow
          </button>
        </div>
      ))}
      {filteredFollowing.length === 0 && !isLoading && !error && (
        <div className="text-center py-4 text-gray-500">
          No following users found matching your search.
        </div>
      )}
    </div>
  );
}

export default FollowingList;
