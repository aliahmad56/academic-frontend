// import React, { useRef, useEffect } from "react";
// import editIcon from "../../assets/icons/Edit.svg";
// import deleteIcon from "../../assets/icons/delete.svg";
// import addIcon from "../../assets/icons/addMember.svg";
// import exitIcon from "../../assets/icons/exit.svg";

// interface GroupDotsMenuProps {
//   handleEditModal: () => void;
//   handleAddModal: () => void;
//   handleExitModal: () => void;
//   handleDeleteModal: () => void;
//   closeMenu :()=> void;
// }

// const GroupDotsMenu: React.FC<GroupDotsMenuProps> = ({
//   handleEditModal,
//   handleAddModal,
//   handleExitModal,
//   handleDeleteModal,
//   closeMenu
// }) => {
//   const menuRef = useRef<HTMLDivElement>(null);

//   const menuItems = [
//     {
//       icon: editIcon,
//       label: "Edit",
//       action: handleEditModal,
//       className: "text-gray-700",
//     },
//     {
//       icon: deleteIcon,
//       label: "Delete",
//       action: handleDeleteModal,
//       className: "text-gray-700",
//     },
//     {
//       icon: addIcon,
//       label: "Add member",
//       action: handleAddModal,
//       className: "text-gray-700",
//     },
//     {
//       icon: exitIcon,
//       label: "Exit group",
//       action : handleExitModal,
//       className: "text-red-600",
//     },
//   ];

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
//         closeMenu(); // Close the menu if clicked outside
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);

//     // Cleanup the event listener when the component is unmounted
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [closeMenu]);
  

//   return (
//     <div className="bg-white rounded-lg shadow-lg border border-gray-200 w-64 py-2">
//       {/* Menu Items */}
//       <div className="flex flex-col">
//         {menuItems.map((item, index) => (
//           <button
//             key={index}
//             className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 w-full text-left"
//             onClick={item.action}
//           >
//             <img src={item.icon} alt={item.label} className="w-5 h-5" />
//             <span className={item.className}>{item.label}</span>
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default GroupDotsMenu;



import React, { useRef, useEffect } from "react";
import editIcon from "../../assets/icons/Edit.svg";
import deleteIcon from "../../assets/icons/delete.svg";
import addIcon from "../../assets/icons/addMember.svg";
import exitIcon from "../../assets/icons/exit.svg";

interface GroupDotsMenuProps {
  handleEditModal: () => void;
  handleAddModal: () => void;
  handleExitModal: () => void;
  handleDeleteModal: () => void;
  closeMenu: () => void;
}

const GroupDotsMenu: React.FC<GroupDotsMenuProps> = ({
  handleEditModal,
  handleAddModal,
  handleExitModal,
  handleDeleteModal,
  closeMenu,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  const menuItems = [
    {
      icon: editIcon,
      label: "Edit",
      action: handleEditModal,
      className: "text-gray-700",
    },
    {
      icon: deleteIcon,
      label: "Delete",
      action: handleDeleteModal,
      className: "text-gray-700",
    },
    {
      icon: addIcon,
      label: "Add member",
      action: handleAddModal,
      className: "text-gray-700",
    },
    {
      icon: exitIcon,
      label: "Exit group",
      action: handleExitModal,
      className: "text-red-600",
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click happened outside the menu
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu(); // Close the menu if clicked outside
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeMenu]);

  return (
    <div ref={menuRef} className="bg-white rounded-lg shadow-lg border border-gray-200 w-64 py-2">
      <div className="flex flex-col">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 w-full text-left"
            onClick={() => {
              item.action(); // Execute the specific action for the item
              closeMenu(); // Close the menu after action
            }}
          >
            <img src={item.icon} alt={item.label} className="w-5 h-5" />
            <span className={item.className}>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default GroupDotsMenu;
