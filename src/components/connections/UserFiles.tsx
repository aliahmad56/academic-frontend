import MoreVertIcon from "@mui/icons-material/MoreVert";
import logoImage from "../../assets/images/logo.png";
import fileImage from "../../assets/icons/Files.png";
import { useNavigate } from "react-router-dom";

function UserFiles() {
  const navigate = useNavigate()
  return (

    <div className="bg-white p-6 rounded-lg shadow mb-6 min-h-screen">
    {/* Profile Header */}
    <div className="flex flex-col md:flex-row justify-between items-center">
      <div className="flex gap-8 items-center">
        <div className="flex gap-4 items-center">
          {/* Profile Image */}
          <div className="w-[60px] h-[60px] rounded-[50%] overflow-hidden">
            <img
              src={logoImage}
              alt="Profile Pic"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Profile Info */}
          <div>
            <p className="text-[20px] font-medium leading-tight">Waqar</p>
            <p className="text-[14px] text-gray-500">Researcher</p>
          </div>
        </div>
        {/* Follower Stats */}
        <div className="flex item gap-4 text-[#1DAEDE] mt-4 md:mt-0">
          <p className="text-[14px] cursor-pointer hover:underline">
            50 Followers
          </p>
          <p className="text-[14px] cursor-pointer hover:underline">
            20 Following
          </p>
        </div>
      </div>
      {/* Buttons */}
      <div className="flex gap-2 mt-4 md:mt-0">
        <button className="text-[#1DAEDE] border border-[#1DAEDE] rounded-lg py-1 px-3 text-sm lg:text-md lg:p-3 hover:bg-[#1DAEDE] hover:text-white transition" onClick={()=>navigate("/connections")}>
          View Connections
        </button>
        <button className="bg-[#1DAEDE] text-white rounded-lg py-1 px-3 text-sm lg:text-md lg:p-3">
          Edit Profile Picture
        </button>
      </div>
    </div>
    {/* Recent Files Section */}
    <div className="mt-6">
      <p className="text-[24px] font-medium mb-2">
        Recent Files <span className="text-gray-400 text-[24px]">(05)</span>
      </p>
      <ul>
        {[
          'Research Guideline',
          'Proposals',
          'Documents',
          'Instructions',
          'Supervisors',
        ].map((file, index) => (
          <li
            key={index}
            className="flex justify-between items-center py-2 border-b border-gray-200"
          >
            <div className="flex items-center gap-2 px-4">
              <img
                src={fileImage}
                alt="File Icon"
                className="w-6 h-6" // Adjust the size as needed
              />
              <p className="text-gray-700 text-sm py-4 font-bold">{file}</p>
            </div>
            <MoreVertIcon />
          </li>
        ))}
      </ul>
    </div>
  </div>
  );
}

export default UserFiles;
