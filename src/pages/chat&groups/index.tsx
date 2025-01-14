import QuestionsAndChats from "../../components/layout/questions&chats";
import CenterImage from "../../assets/images/Frame.png";

function MainChatPage() {
  return (
    <QuestionsAndChats>
      <div className="flex flex-col items-center justify-center mt-4 pt-14">
        <img
          src={CenterImage}
          alt="centered illustration"
          className="w-[500px] h-auto mb-4"
        />
        <p className="text-gray-600 text-center text-lg sm:text-base md:text-xl lg:text-2xl w-[60%]">
          Start connecting and exploring by initiating a chat or joining an
          interest group
          <br/>
          to engage with others.
        </p>
      </div>
    </QuestionsAndChats>
  );
}

export default MainChatPage;