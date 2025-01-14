import { useState } from "react";
const EditGroupModal = ({ isOpen, onClose, group }:any) => {
  const [groupName, setGroupName] = useState(group.name);
  const [visibility, setVisibility] = useState(group.visibility);
  const [members] = useState(group.members);
  const handleVisibilityChange = (e:any) => {
    setVisibility(e.target.value);
  };
  return (
    isOpen && (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-[600px] p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Edit Group</h2>
            <button
              onClick={onClose}
              className="text-red-500 font-bold hover:text-red-700"
            >
              ✕
            </button>
          </div>
          <div className="flex flex-col items-center mb-4">
            <div className="w-16 h-16 bg-purple-500 text-white text-3xl flex items-center justify-center rounded-full">
              {group.name.charAt(0)}
            </div>
            <p className="mt-2 text-gray-600">{`${group.name} . ${group.members.length} members`}</p>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Group Name"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-primary-blue text-white px-4 py-2 rounded hover:bg-blue-600">
              Save name
            </button>
          </div>
          <div className="mb-4">
            <label className="block font-medium text-gray-700 mb-2">
              Group Visibility
            </label>
            <select
              value={visibility}
              onChange={handleVisibilityChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Public">Public</option>
              <option value="Private">Private</option>
              <option value="Only Invitation">Only Invitation</option>
            </select>
          </div>
          <div className="mb-4">
            <h3 className="font-medium text-gray-700 mb-2">Group Members</h3>
            <div className="space-y-2">
              {members.map((member :any, index:number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 border-b hover:bg-gray-100"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span>{member.name}</span>
                  </div>
                  {member.role === "Admin" && (
                    <span className="text-sm text-red-500 font-semibold">
                      Admin
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <button className="bg-primary-blue text-white w-full py-2 rounded hover:bg-blue-600">
            Add new member
          </button>
        </div>
      </div>
    )
  );
};
export default EditGroupModal;
