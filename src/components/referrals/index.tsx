import { useSelector } from "react-redux";

import { translate } from "../../utils/i18n";
import { selectLanguage } from "../../redux/languageSlice";

import TrialPeriodBanner from "../../assets/images/trial_banner.png";
import { selectAuth } from "../../redux/authSlice";
import { useState } from "react";

function Referrals() {
  const [isCopy, setIsCopy] = useState(false);

  const profile = useSelector(selectAuth);

  const code = profile.userProfile?.referralCode;
  const referralLink = `https://aca-space.com/signup?referralCode=${code}`;
  const selectedLanguage = useSelector(selectLanguage);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setIsCopy(true);
      setTimeout(() => setIsCopy(false), 1000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };
  return (
    <div className="h-auto w-auto ">
      <div className="bg-white sm:p-[1.5rem] p-[1rem] h-[100vh] flex flex-col gap-10 overflow-auto relative">
        <div className="flex w-full flex-col bg-[#1DAEDE]  bg-opacity-[5%] p-[3rem] gap-[1rem]">
          <h2 className="sm:text-3xl font-semibold text-[#484848] sm:w-[67%] w-[95%] text-lg">
            {translate("Refer Friends & Earn Rewards", selectedLanguage)}
          </h2>
          <p className="font-500 font-poppins text-[20px] text-center text-red-600 sm:hidden block w-[95%]">
            {translate("Free Trial Period", selectedLanguage)}
          </p>
          <p className="text-[#828282] font-poppins text-[16px] mt-2  w-3/4">
            {translate("By sharing this link", selectedLanguage)}{" "}
            {translate(
              "you can help others discover our services",
              selectedLanguage
            )}{" "}
            {translate(
              "and enjoy the benefits of seamless collaboration",
              selectedLanguage
            )}{" "}
            {translate("and efficient storage management", selectedLanguage)}.
          </p>
        </div>
        <div className="absolute  sm:right-[12%] right-[8%]">
          <img
            src={TrialPeriodBanner}
            className="sm:w-[9rem] sm:h-[8rem]  w-[3rem] h-[9rem]"
          />
          <div className="flex flex-col absolute top-4 items-center justify-center text-white w-full">
            <p className=" font-poppins text-[20px] font-[500] sm:block hidden">
              {" "}
              {translate("FREE", selectedLanguage)}
            </p>
            <p className=" font-poppins text-[16px] font-[500] sm:block hidden  ">
              {" "}
              {translate("Trial Period", selectedLanguage)}
            </p>
          </div>
        </div>
        <div className="flex justify-between items-center w-full mx-auto gap-8 sm:flex-row flex-col ">
          <input
            disabled
            type="text"
            value={referralLink}
            readOnly
            className="w-full flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none rounded-md text-gray-500 font-poppins text-[14px] font-400 h-[50px]"
          />
          <button
            onClick={handleCopyLink}
            className="w-full bg-[#1DAEDE] text-white py-2 px-4 rounded-r-md hover:bg-[#1b9bc1] focus:outline-none rounded-md sm:w-[160px] h-[50px]"
          >
            {isCopy
              ? translate("Copied", selectedLanguage)
              : translate("Copy link", selectedLanguage)}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Referrals;
