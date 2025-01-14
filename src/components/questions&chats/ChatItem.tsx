
import deleteIcon from "../../assets/icons/del.svg";

// Chat item component
const ChatItem = ({ name, message, unreadCount, time }: any) => (
  <div className="border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
    <div className="flex items-start gap-3 p-4">
      <div className="w-10 h-10 rounded-full bg-gray-300" />
      <div className="flex-1">
        <div className="flex flex-col justify-between items-right">
          <h3 className="font-medium">{name}</h3>
          <p className="text-xs text-gray-500">{time}</p>
        </div>
        <p className="text-sm text-gray-500 mt-1">{message}</p>
      </div>
      <div className="">
            {unreadCount > 0 && (
              <span className="bg-primary-blue text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
              </span>
             
            )}
             <div className="mt-4 ml-0.5">
                <button>
                    <img src={deleteIcon} alt="Bin" />
                </button>
              </div>
          </div>
    </div>
  </div>

  
);

export default ChatItem;
