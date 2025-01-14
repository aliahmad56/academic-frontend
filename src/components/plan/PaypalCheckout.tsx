import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import AxiosInterceptor from "../../AxiosInterceptor";
import { translate } from "../../utils/i18n";

import { selectAuth } from "../../redux/authSlice";
import { selectCheckout } from "../../redux/checkoutSlice";

interface PayPalCheckoutFormProps {
  validateFields: () => boolean;
  fullName: string;
  country?: string;
  handleRedirecting: (value: boolean) => void;
  selectedLanguage: string;
}

const PayPalCheckoutForm: React.FC<PayPalCheckoutFormProps> = ({
  validateFields,
  fullName,
  handleRedirecting,
  selectedLanguage,
}) => {
  const user = useSelector(selectAuth);
  const paypalCheckout = useSelector(selectCheckout);

  const [payerEmail, setPayerEmail] = useState<string>(user?.email || "");

  const handlePayerEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPayerEmail(e.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    handleRedirecting(true);

    if (!validateFields()) {
      handleRedirecting(false);
      return;
    }

    const data = {
      storageLimit: paypalCheckout.storageLimit,
      plan_id: paypalCheckout.planId, // Use the plan_id from the PayPal checkout state
      subscriber: {
        name: {
          given_name: fullName.split(" ")[0],
          surname: fullName.split(" ").slice(1).join(" ") || "",
        },
        email_address: payerEmail || user?.email, // Use the entered payer email or the user's email
      },
    };

    try {
      const response = await AxiosInterceptor.SECURE_API.post(
        "/user/create-subscription-paypal",
        data
      );

      const subscription = response.data.subscription;

      if (subscription.status === "APPROVAL_PENDING") {
        const approvalUrl = subscription.links.find(
          (link: any) => link.rel === "approve"
        ).href;

        // Redirect to the approval link in the same tab
        window.location.href = approvalUrl;
      } else {
        toast.error("Failed to initiate PayPal payment");
        handleRedirecting(false);
      }
    } catch (error) {
      console.error(`PayPal subscription creation failed: ${error}`);
      toast.error("Failed to create PayPal subscription");
      handleRedirecting(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Payer Email */}
          <div className="flex flex-col justify-start gap-2">
            <label className="text-gray-500 font-[400]">
              {" "}
              {translate("Payer Email", selectedLanguage)}
            </label>
            <input
              type="email"
              value={payerEmail}
              onChange={handlePayerEmailChange}
              className="border border-[#D0D0D0] p-[0.7rem] w-full rounded-md"
              placeholder="email@example.com"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mt-4">
          <button
            type="submit"
            className="bg-[#1DAEDE] cursor-pointer flex items-center justify-center rounded-md h-12 w-[200px]"
          >
            <p className="text-white">
              {" "}
              {translate("Pay with PayPal", selectedLanguage)}
            </p>
          </button>
        </div>
      </form>
    </div>
  );
};

export default PayPalCheckoutForm;
