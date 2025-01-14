import crossIcon from "../../assets/icons/cross.svg";

interface GroupActionsModalProps {
  actionModalIsOpen: boolean;
  title : string;
  description : string;
  closeModal:()=>void;
}

function GroupActionsModal({ actionModalIsOpen, title, description, closeModal }: GroupActionsModalProps) {
  return (
    actionModalIsOpen && (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-[800px] p-10 shadow-lg relative">
          <h4 className="text-2xl font-medium">{title}</h4>
          <p className="text-base mt-2">
          {description}
          </p>

          <div className="flex gap-7 justify-center mt-6">
            <button className="font-medium border px-14 py-2.5 rounded-lg text-[#DE1D1D] border-[#DE1D1D] hover:bg-[#DE1D1D] hover:text-white">
              No
            </button>
            <button className="font-medium border px-14 py-2.5 rounded-lg bg-primary-blue text-white border-primary-blue hover:bg-blue-500 hover:border-blue-700">
              Yes
            </button>
          </div>

          <img
            src={crossIcon}
            alt="Close"
            className="absolute -top-4 -right-4 w-10 h-10 cursor-pointer hover:opacity-80"
            onClick={()=>closeModal()}
          />
        </div>
      </div>
    )
  );
}

export default GroupActionsModal;
