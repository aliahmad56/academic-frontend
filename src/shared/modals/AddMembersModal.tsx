import React, { useState } from "react";

interface AddMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: string[];
  onAdd: (selectedMembers: string[]) => void;
}

const AddMembersModal: React.FC<AddMembersModalProps> = ({ 
  isOpen, 
  onClose, 
  members,
  onAdd 
}) => {
  const [search, setSearch] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const toggleMember = (member: string) => {
    if (selectedMembers.includes(member)) {
      setSelectedMembers(selectedMembers.filter((m) => m !== member));
    } else {
      setSelectedMembers([...selectedMembers, member]);
    }
  };

  const handleSubmit = () => {
    onAdd(selectedMembers);
    setSelectedMembers([]); // Reset selected members
    setSearch(""); // Reset search
    onClose();
  };

  const filteredMembers = members?.filter((member) =>
    member.toLowerCase().includes(search.toLowerCase())
  ) || [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-96 p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Add Members</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 font-bold"
          >
            ✕
          </button>
        </div>

        <p className="text-gray-600 mb-4">
          Expand your group's network by inviting new members.
        </p>

        <div className="relative mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search members"
            className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {selectedMembers.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedMembers.map((member) => (
              <div
                key={member}
                className="bg-blue-500 text-white px-3 py-1 rounded-full flex items-center gap-2"
              >
                {member}
                <button
                  onClick={() => toggleMember(member)}
                  className="text-sm text-white hover:text-red-500"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="overflow-y-auto max-h-60 mb-4">
          {filteredMembers.length > 0 ? (
            filteredMembers.map((member) => (
              <div
                key={member}
                className="flex items-center justify-between p-2 border-b hover:bg-gray-100 cursor-pointer"
                onClick={() => toggleMember(member)}
              >
                <span>{member}</span>
                {selectedMembers.includes(member) && (
                  <span className="text-blue-500">✓</span>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">
              {search ? "No members found" : "No members available"}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={selectedMembers.length === 0}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Members
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMembersModal;