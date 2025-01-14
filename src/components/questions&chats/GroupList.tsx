import threeDots from "../../assets/icons/three_dots.svg";
import addGroup from "../../assets/icons/addGroup.svg";
import { useNavigate } from "react-router-dom";

function GroupList() {
  const navigate = useNavigate();

  const items = [
    {
      id: 1,
      title: "Tech Innovators Hub",
      description:
        "A community for tech enthusiasts to discuss the latest innovations and trends in technology",
      icon: "T",
      color: "bg-green-500",
    },
    {
      id: 2,
      title: "Health & Wellness Circle",
      description:
        "Explore holistic approaches to health and well-being, share resources, and support each other's wellness journey",
      icon: "H",
      color: "bg-purple-500",
    },
    {
      id: 3,
      title: "The Quantum Entangled",
      description:
        "Discussing the mind-bending world of quantum mechanics and its implications.",
      icon: "Q",
      color: "bg-yellow-500",
    },
  ];

  const handleGroupClick = ():any => {
    // Navigate to the Q&A page
    navigate("/qnc/chats/group");
  };
  // const handleGroupClick = (group: any) => {
  //   setSelectedGroup(group);
  // };

  // if (selectedGroup) {
  //   return (
  //     <div className="h-screen bg-gray-50">
  //       <GroupChat
  //         group={selectedGroup}
  //         onBack={() => setSelectedGroup(null)}
  //       />
  //     </div>
  //   );
  // }

  return (
    <div className="max-w-full min-h-screen bg-white">
      <div className="p-6">
        <div className="flex justify-between mb-5">
          <p className="text-2xl">3 Groups</p>
          <button className="border border-primary-blue py-3 px-10 text-primary-blue rounded-lg flex items-center gap-2">
            <img src={addGroup} alt="" />
            Create new group
          </button>
        </div>
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center p-4 bg-white rounded-lg shadow border hover:border-blue-500 hover:shadow-md transition cursor-pointer mb-4"
            onClick={handleGroupClick}
          >
            <div
              className={`flex items-center justify-center w-12 h-12 text-white font-bold text-xl rounded-full ${item.color}`}
            >
              {item.icon}
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">
                {item.title}
              </h3>
              <p className="text-sm text-gray-500">{item.description}</p>
            </div>
            <div className="ml-auto">
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <img src={threeDots} alt="" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GroupList;
