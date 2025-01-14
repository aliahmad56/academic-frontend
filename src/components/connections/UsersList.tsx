// src/components/UsersList.tsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { fetchUserList, followUser } from "../../redux/userListSlice";

interface UsersListProps {
  searchQuery: string;
}

function UsersList({ searchQuery }: UsersListProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { users, isLoading, error } = useSelector(
    (state: RootState) => state.userList
  );

  useEffect(() => {
    dispatch(fetchUserList());
  }, [dispatch]);

  const handleFollowUser = (id: string) => {
    try {
      const body = { followingId: id };
      console.log("The body is ", body);
      dispatch(followUser(body));
    } catch (error) {
      console.log("the error is :", error);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  // if (error) {
  //   return <div className="text-red-500 text-center py-4">{error}</div>;
  // }

  return (
    <div>
      {filteredUsers.map((user) => (
        <div
          key={user._id}
          className="flex justify-between items-center py-4 border-b last:border-b-0"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              {user.profilepic && user.profilepic !== "null" ? (
                <img
                  src={user.profilepic}
                  alt={`${user.name}'s profile`}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-gray-600 font-semibold text-lg select-none">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </span>
              )}
            </div>
            <p className="text-gray-700 font-medium">{user.name}</p>
          </div>
          <button
            className="text-[#1DAEDE] border border-[#1DAEDE] rounded-lg py-1 px-3 text-sm hover:bg-[#1DAEDE] hover:text-white transition"
            onClick={() => handleFollowUser(user._id)}
          >
            Follow
          </button>
        </div>
      ))}
      {filteredUsers.length === 0 && !isLoading && !error && (
        <div className="text-center py-4 text-gray-500">
          No users found matching your search.
        </div>
      )}
    </div>
  );
}

export default UsersList;
