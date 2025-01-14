import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { selectLanguage } from "../../redux/languageSlice";
import { translate } from "../../utils/i18n";
import { bytesToGB } from "../../utils/FileSize";

import { selectAuth } from "../../redux/authSlice";

import UpgradePlanIcon from "../../assets/icons/UpgradePlan.svg";

const plans = [
  {
    planName: "Free Plan",
    subscriptionType: "Monthly Subscription",
    price: "$0.00",
    expiryDate: "OCT 1, 2024",
    usedStorage: 3.1,
    totalStorage: 10,
  },
  // Add more plans here if needed
];

function StorageManagement() {
  const [usedPercentage, setUsedPercentage] = useState(0);
  const selectedLanguage = useSelector(selectLanguage);
  const user = useSelector(selectAuth);

  useEffect(() => {
    const usedStorageInBytes = user?.userProfile?.usedStorage || 0;
    const storageLimitInBytes = user?.userProfile?.storageLimit || 1; // Default to 1 to avoid division by zero

    // Convert bytes to GB using the bytesToGB function
    const usedStorageInGB = parseFloat(bytesToGB(usedStorageInBytes));
    const storageLimitInGB = parseFloat(bytesToGB(storageLimitInBytes));

    // Calculate the percentage of used storage
    const percentage = (usedStorageInGB / storageLimitInGB) * 100;
    setUsedPercentage(percentage);
  }, [
    user?.userProfile?.usedStorage,
    user?.userProfile?.storageLimit,
    user?.userProfile?.subscriptionStatus,
  ]);

  return (
    <div className="h-auto w-auto">
      <div className="bg-white p-[2rem] h-[100vh] flex flex-col gap-10 overflow-auto relative">
        {plans.map((plan, index) => (
          <div key={index} className="flex flex-col justify-start gap-6">
            <div className="flex flex-col justify-start gap-[1rem]">
              <p className="text-[#484848] font-poppins text-2xl font-[600]">
                {translate("Storage", selectedLanguage)}
              </p>
              <p className="text-[#828282] font-poppins text-sm">
                {translate(
                  "You can easily view detailed information about your storage usage and manage your files effectively",
                  selectedLanguage
                )}
              </p>
            </div>
            <div className="flex w-full flex-col bg-[#1DAEDE] bg-opacity-[5%] p-[2rem] gap-[0.5rem] justify-start">
              <p className="font-500 font-poppins text-[20px] text-red-600">
                {plan.planName}
              </p>
              <div className="flex gap-[1rem] items-center">
                <p className="font-poppins text-[16px] text-[#484848]">
                  {plan.subscriptionType}
                </p>
                <p className="font-poppins text-[#1DAEDE] text-[16px]">
                  {plan.price}
                </p>
              </div>
              <p className="font-poppins font-[400] text-[14px] text-[#828282]">
                {translate("Subscription expiry", selectedLanguage)}:
                {plan.expiryDate}
              </p>
            </div>

            <div className="w-full mx-auto">
              <div className="flex items-end mb-2">
                <span className="text-gray-600 font-medium text-sm">
                  {user.isGuest === true ? 0 : usedPercentage || 0}{" "}
                  {translate("GB", selectedLanguage)}
                </span>
                <span className="text-gray-400 text-sm mx-1">of</span>
                <span className="text-gray-600 text-sm font-medium">
                  {user.isGuest === true
                    ? 0
                    : user?.userProfile?.storageLimit || 0}{" "}
                  {translate("GB", selectedLanguage)}
                </span>
                <span className="text-gray-400 text-sm ml-1">
                  {translate("used", selectedLanguage)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-[2000ms] ease-in-out ${
                    usedPercentage >= 80
                      ? "bg-red-500"
                      : usedPercentage >= 60
                      ? "bg-yellow-500"
                      : "bg-[#1DAEDE]"
                  }`}
                  style={{
                    width: `${user.isGuest ? 0 : usedPercentage}%`,
                  }}
                />
              </div>
            </div>

            <div className="flex flex-col items-center justify-center border-[#1DAEDE] border-[1px] w-[160px] h-[50px] rounded-md">
              <Link to={"/plan"} className="flex gap-2 items-center">
                <img
                  className="h-6 w-6 shrink-0"
                  src={UpgradePlanIcon}
                  alt="Upgrade Plan"
                />
                <p className="font-poppins text-sm font-[400]">
                  {translate("Upgrade Plan", selectedLanguage)}{" "}
                </p>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StorageManagement;
