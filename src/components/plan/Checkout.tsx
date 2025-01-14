import { useState } from "react";
import { useSelector } from "react-redux";
import { CountryDropdown } from "react-country-region-selector"; // You can use any country selection library

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { translate } from "../../utils/i18n";

import { selectLanguage } from "../../redux/languageSlice";
import { selectCheckout } from "../../redux/checkoutSlice";

import CheckoutForm from "./CheckoutForm";
import Loader from "../common/Loader";
import PayPalCheckout from "./PaypalCheckout"; // Import PayPalCheckout component

import CardIcon from "../../assets/images/cards.png";
import PayPalIcon from "../../assets/images/paypal.png";
import WeChatIcon from "../../assets/images/wechat_icon.png";

const stripePromise = loadStripe(import.meta.env.VITE_APP_STRIPE_CLIENT_ID);

function Checkout() {
  const selectedLanguage = useSelector(selectLanguage);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("card");
  const [errors, setErrors] = useState({ fullName: "", country: "" });
  const [country, setCountry] = useState("");
  const [fullName, setFullName] = useState("");
  const [redirectLoading, setRedirectLoading] = useState(false);

  const checkoutState = useSelector(selectCheckout);

  const handleRadioChange = (e: any) => {
    setSelectedPaymentMethod(e.target.value);
  };

  const validateFields = () => {
    let isValid = true;
    const newErrors = { fullName: "", country: "" };

    if (!fullName) {
      newErrors.fullName = translate("Full Name is required", selectedLanguage);
      isValid = false;
    }

    if (!country) {
      newErrors.country = translate("Country is required", selectedLanguage);
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const options = {
    // Add your Stripe options here
  };

  return (
    <div className="h-auto w-auto">
      {redirectLoading && <Loader />}
      <div className="bg-white p-8">
        <p className="text-[#484848] font-poppins text-[24px] font-[500]">
          {translate("Checkout", selectedLanguage)}
        </p>
        <p className="text-[#828282] text-[14px] font-poppins font-[400]">
          {translate(
            "We offer multiple payment methods to ensure a seamless upgrade experience",
            selectedLanguage
          )}
        </p>

        <div className="mt-8 w-full">
          <p className="text-[#484848] font-poppins font-[600] text-xl mb-4">
            {translate("Billing Information", selectedLanguage)}
          </p>

          {/* Billing Information Input Fields */}
          <div className="flex items-center gap-4 w-full sm:flex-row flex-col">
            <div className="flex flex-col w-full gap-2">
              <label className="text-[#484848] text-base">
                {translate("Full Name", selectedLanguage)}
              </label>
              <div className="flex items-center border border-gray-300 hover:border-[#1DAEDE] rounded-md h-12 w-full">
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="w-full outline-none border-none px-3 py-2"
                  placeholder={translate("Full Name", selectedLanguage)}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              {errors.fullName && (
                <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>
              )}
            </div>
            <div className="flex flex-col w-full gap-2">
              <label>{translate("Country", selectedLanguage)}</label>
              <CountryDropdown
                value={country}
                onChange={(val) => setCountry(val)}
                classes="h-12 w-full border border-gray-300 rounded-md px-3"
              />
              {errors.country && (
                <p className="text-red-600 text-sm mt-1">{errors.country}</p>
              )}
            </div>
          </div>

          {/* Order Details */}
          <div className="bg-[#1DAEDE0D] rounded-md my-8 p-6">
            <p className="text-[#484848] font-poppins text-[16px] font-[500]">
              {translate("Order Details", selectedLanguage)}
            </p>
            <p className="text-[#DE1D1D] font-poppins text-[14px] font-[400] py-2">
              {checkoutState.planName} {translate("Plan", selectedLanguage)}
            </p>
            <div className="flex items-center gap-3">
              <p className="text-[#484848] font-poppins text-[14px] font-[500]">
                {translate("Monthly subscription", selectedLanguage)}
              </p>
              <p className="text-[#828282] font-poppins text-[14px] font-[500]">
                ${checkoutState.planBudget.toFixed(2)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-[#484848] font-poppins text-[14px] font-[500]">
                {translate("Storage Limit", selectedLanguage)}
              </p>
              <p className="text-[#828282] font-poppins text-[14px] font-[500]">
                {checkoutState.storageLimit.toFixed(2)}
              </p>
            </div>
            <div className="border-b w-full py-2" />
            <div className="flex items-center gap-[100px] mt-4 justify-between">
              <p className="text-[#1DAEDE] font-poppins text-[14px] font-[500]">
                {translate("Total", selectedLanguage)}
              </p>
              <p className="text-[#1DAEDE] font-poppins text-[14px] font-[500] ">
                {translate("Total", selectedLanguage)} ${" "}
                <span className="font-semibold">
                  {" "}
                  {checkoutState.planBudget.toFixed(2)}
                </span>
              </p>
            </div>
          </div>

          {/* Payment Options */}
          <div>
            <p className="text-[#484848] font-poppins font-[600] text-[16px] pb-6">
              {translate("Payment Method", selectedLanguage)}
            </p>
            {/* Stripe */}
            <div
              style={{
                display: checkoutState.platform === "stripe" ? "flex" : "none",
              }}
              className=" items-center gap-6 py-2 w-full border-b-[1px] border-gray-300 pb-4"
            >
              <div
                className={`w-[20px] h-[20px] border ${
                  selectedPaymentMethod === "card"
                    ? "border-[#1DAEDE]"
                    : "border-gray-400"
                } rounded-full relative`}
              >
                <input
                  className="custom-radio w-[20px] h-[20px] border border-[#1DAEDE] text-[#1DAEDE]"
                  type="radio"
                  value="card"
                  checked={selectedPaymentMethod === "card"}
                  onChange={handleRadioChange}
                />
              </div>
              <div className="flex items-center gap-4">
                <p className="text-[#484848] text-[14px] font-poppins">
                  {translate("Credit", selectedLanguage)} /{" "}
                  {translate("Debit Card", selectedLanguage)}
                </p>
                <img src={CardIcon} alt="Credit/Debit Card Icon" />
              </div>
            </div>
            {/* Paypal */}
            <div
              style={{
                display: checkoutState.platform === "paypal" ? "flex" : "none",
              }}
              className=" items-center gap-6 py-4 w-full border-b-[1px] border-gray-300 pb-4"
            >
              <div
                className={`w-[20px] h-[20px] border ${
                  selectedPaymentMethod === "paypal"
                    ? "border-[#1DAEDE]"
                    : "border-gray-400"
                } rounded-full relative`}
              >
                <input
                  className="custom-radio w-[20px] h-[20px] border border-[#1DAEDE] text-[#1DAEDE]"
                  type="radio"
                  value="paypal"
                  checked={selectedPaymentMethod === "paypal"}
                  onChange={handleRadioChange}
                />
              </div>
              <div className="flex items-center gap-2">
                <img src={PayPalIcon} alt="PayPal Icon" />
              </div>
            </div>
            {/* Wechat */}
            <div
              style={{ display: "none" }}
              className=" flex items-center gap-6 py-4"
            >
              <div
                className={`w-[20px] h-[20px] border ${
                  selectedPaymentMethod === "wechat"
                    ? "border-[#1DAEDE]"
                    : "border-gray-400"
                } rounded-full relative`}
              >
                <input
                  className="custom-radio w-[20px] h-[20px] border border-[#1DAEDE] text-[#1DAEDE]"
                  type="radio"
                  value="wechat"
                  checked={selectedPaymentMethod === "wechat"}
                  onChange={handleRadioChange}
                />
              </div>
              <div className="flex items-center gap-2">
                <img src={WeChatIcon} alt="WeChat Icon" />
              </div>
            </div>
          </div>

          {/* Integrate Payment Methods */}
          <div className="pt-4">
            {selectedPaymentMethod === "card" && (
              <Elements stripe={stripePromise} options={options}>
                <CheckoutForm
                  validateFields={validateFields}
                  fullName={fullName}
                  country={country}
                  handleRedirecting={setRedirectLoading}
                  selectedLanguage={selectedLanguage}
                />
              </Elements>
            )}

            {selectedPaymentMethod === "paypal" && (
              <PayPalCheckout
                validateFields={validateFields}
                fullName={fullName}
                country={country}
                handleRedirecting={setRedirectLoading}
                selectedLanguage={selectedLanguage}
              />
            )}

            {selectedPaymentMethod === "wechat" && (
              <p>{translate("WeChat Payment Method", selectedLanguage)}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
