import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { translate } from "../../utils/i18n";

import { storePlanInfo } from "../../redux/checkoutSlice";
import { selectLanguage } from "../../redux/languageSlice";

import PaymentCards from "./PaymentCards";
import AxiosInterceptor from "../../AxiosInterceptor";
import Loader from "../common/Loader";

function Plan() {
  const selectedLanguage = useSelector(selectLanguage);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [redirectLoading, setRedirectLoading] = useState(false);
  const [plans, setPlans] = useState([]);

  const plansMethods = async () => {
    setRedirectLoading(true);
    try {
      const response = await AxiosInterceptor.SECURE_API.get(
        `/user/show-plans`
      );
      setPlans(response.data.plans);
    } catch (error) {
      console.error("Failed to fetch plans", error);
    } finally {
      setRedirectLoading(false);
    }
  };

  useEffect(() => {
    plansMethods();
  }, []);

  const handleStoreInfo = (plan: any) => {
    dispatch(storePlanInfo(plan));

    navigate("/checkout");
  };

  return (
    <div>
      {redirectLoading && <Loader />}
      <div className="h-auto w-auto ">
        <div className="bg-white p-8">
          <p className="text-[#484848] font-poppins text-[24px] font-[500]">
            {translate("Choose Your Plan", selectedLanguage)}
          </p>
          <p className="text-[#828282] text-[14px] font-poppins font-[400]">
            {translate(
              "Get Started with a Plan That Fits Your Needs",
              selectedLanguage
            )}
          </p>

          {/* <div className="py-6"> */}
          {/* <p className="text-[#484848] text-[16px] font-poppins font-[400]">
            {translate("Choose storage", selectedLanguage)}
          </p> */}
          {/* <div className="relative w-full"> */}
          {/* <div
              onClick={handleDropdownClick}
              className="flex items-center cursor-pointer justify-between mt-4 border border-[#1DAEDE] rounded-md h-12 px-4"
            >
              <p className="text-gray-600 font-poppins text-sm font-normal">
                {translate(selectedOption, selectedLanguage) !==
                translate("Select", selectedLanguage) ? (
                  <>
                    {translate(selectedOption, selectedLanguage)}{" "}
                    {translate("GB", selectedLanguage)}{" "}
                  </>
                ) : (
                  translate("Select", selectedLanguage)
                )}
              </p>

              <img src={DownIcon} alt="Dropdown Icon" />
            </div> */}
          {/* {(isOpen || isAnimating) && (
              <div
                className={`absolute bg-white overflow-y-scroll h-[100px] top-[40px] py-2 z-50 flex flex-col cursor-pointer justify-between border border-t-0 border-[#1DAEDE] rounded-b-md w-full ${
                  isOpen ? "animate-slideDown" : "animate-slideUp"
                }`}
              >
                {plans?.map((ele: any, index: number) => (
                  <div
                    onClick={() => {
                      setSelectedOption(ele?.name);
                      setIsOpen(false);
                    }}
                    key={index}
                    className="py-1 flex items-center cursor-pointer gap-2 px-4 hover:bg-custom-light-blue"
                  >
                    <p className="text-sm text-gray-600 font-normal">
                      {ele?.name} {translate("GB", selectedLanguage)}{" "}
                    </p>
                  </div>
                ))}
              </div>
            )} */}
          {/* </div> */}
          {/* {error && (
            <p className="text-red-600 text-sm mt-2">
              {translate(error, selectedLanguage)}
            </p>
          )}{" "} */}
          {/* Display error message */}
          {/* </div> */}

          <div className="my-10">
            {plans.map((plan: any, index: number) => (
              <div
                key={index}
                className="flex flex-col mt-8 md:flex-row items-center justify-center gap-8 flex-wrap"
              >
                <div>
                  <PaymentCards
                    selectedLanguage={selectedLanguage}
                    type={plan.planName}
                    price={plan.planBudget}
                    title={translate(
                      "Stripe credit card required",
                      selectedLanguage
                    )}
                    btntext="Procced to Checkout"
                    freePlans={plan.storageLimit}
                    platform={plan.platform}
                    handleStoreInfo={() => handleStoreInfo(plan)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Plan;
