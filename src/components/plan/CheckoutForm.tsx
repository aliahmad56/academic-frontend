import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import AxiosInterceptor from "../../AxiosInterceptor";
import { translate } from "../../utils/i18n";

import { clearInfo, selectCheckout } from "../../redux/checkoutSlice";
import { selectAuth, updateUserProfile } from "../../redux/authSlice";

interface CheckoutFormProps {
  validateFields: () => boolean;
  fullName: string;
  country: string;
  handleRedirecting: (value: boolean) => void; // Updated the return type to void
  selectedLanguage: string;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  validateFields,
  fullName,
  handleRedirecting,
  selectedLanguage,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();

  // State for handling errors for each Stripe element
  const [cardError, setCardError] = useState<string | null>(null);
  const [expiryError, setExpiryError] = useState<string | null>(null);
  const [cvcError, setCvcError] = useState<string | null>(null);

  const navigate = useNavigate();
  const user = useSelector(selectAuth);
  const checkout = useSelector(selectCheckout);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    handleRedirecting(true);

    if (!validateFields()) {
      handleRedirecting(false);
      return;
    }

    if (!elements || !stripe) {
      console.error("Stripe or Elements not loaded");
      handleRedirecting(false);
      return;
    }

    const cardElement = elements.getElement(CardNumberElement);

    if (!cardElement) {
      console.error("CardElement not found");
      handleRedirecting(false);
      return;
    }

    // Create payment method
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
      billing_details: {
        name: fullName,
      },
    });

    if (error) {
      console.error(`Payment method creation failed: ${error.message}`);
      handleRedirecting(false);
      return;
    }

    const userEmail = user.email;
    const data = {
      storageLimit: checkout.storageLimit,
      email: userEmail,
      paymentMethodId: paymentMethod?.id,
      priceId: checkout?.priceId,
    };

    try {
      const response = await AxiosInterceptor.SECURE_API.post(
        "/user/create-subscription",
        data
      );
      toast.success("Subscribed successfully");

      // Assuming the updated user profile comes back in the response
      const updatedUserProfile = response.data.user; // Adjust this according to the actual response structure

      // Dispatch the action to update the user profile in the Redux store
      dispatch(updateUserProfile(updatedUserProfile));

      handleRedirecting(false);
      dispatch(clearInfo());
      navigate("/");
    } catch (error) {
      //@ts-ignore
      if (error?.response?.status === 401) {
        toast.error(
          "Guest user restriction, please login with an actual email"
        );
      } else {
        //@ts-ignore

        toast.error(
          translate("You have already active subscription", selectedLanguage)
        );
      }
      handleRedirecting(false);
      console.log(`Subscription failed: ${error}`);
    }
  };

  // Handle changes and errors for each element
  const handleCardChange = (event: any) => {
    setCardError(event.error ? "Your card number is incomplete" : null);
  };

  const handleExpiryChange = (event: any) => {
    setExpiryError(event.error ? "Your card expiry date is incomplete" : null);
  };

  const handleCvcChange = (event: any) => {
    setCvcError(event.error ? "Your card security code is incomplete" : null);
  };

  return (
    <div>
      <h2 className="font-poppins text-xl mt-6 mb-6">
        {translate("Add Details Below", selectedLanguage)}
      </h2>
      <form onSubmit={handleSubmit}>
        {/* Grid Layout for Card Number, Expiration Date, Security Code, and Cardholder */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card Number */}
          <div className="flex flex-col justify-start gap-2">
            <label className="text-gray-500 font-[400]">
              {" "}
              {translate("Card Number", selectedLanguage)}
            </label>
            <div className="border border-[#D0D0D0] p-[0.8rem] rounded-md font-poppins">
              <CardNumberElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "black",
                      "::placeholder": {
                        color: "#aab7c4",
                      },
                    },
                    invalid: {
                      fontFamily: "Poppins",
                      color: "#fa755a",
                      iconColor: "#fa755a",
                    },
                  },
                }}
                onChange={handleCardChange}
              />
            </div>
            {cardError && (
              <p className="text-red-500 text-sm mt-1">
                {translate(cardError, selectedLanguage)}
              </p>
            )}
          </div>

          {/* Expiration Date */}
          <div className="flex flex-col justify-start gap-2">
            <label className="text-gray-500 font-[400]">
              {" "}
              {translate("Expiration Date", selectedLanguage)}
            </label>
            <div className="border border-[#D0D0D0] p-[0.8rem] rounded-md">
              <CardExpiryElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "black",
                      "::placeholder": {
                        color: "#aab7c4",
                      },
                    },
                    invalid: {
                      fontFamily: "Poppins",
                      color: "#fa755a",
                      iconColor: "#fa755a",
                    },
                  },
                }}
                onChange={handleExpiryChange}
              />
            </div>
            {expiryError && (
              <p className="text-red-500 text-sm mt-1">
                {translate(expiryError, selectedLanguage)}
              </p>
            )}
          </div>

          {/* Security Code */}
          <div className="flex flex-col justify-start gap-2">
            <label className="text-gray-500 font-[400]">
              {" "}
              {translate("Security Code", selectedLanguage)}
            </label>
            <div className="border border-[#D0D0D0] p-[0.8rem] rounded-md">
              <CardCvcElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "black",
                      "::placeholder": {
                        color: "#aab7c4",
                      },
                    },
                    invalid: {
                      fontFamily: "Poppins",
                      color: "#fa755a",
                      iconColor: "#fa755a",
                    },
                  },
                }}
                onChange={handleCvcChange}
              />
            </div>
            {cvcError && (
              <p className="text-red-500 text-sm mt-1">
                {translate(cvcError, selectedLanguage)}
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mt-4">
          <button
            type="submit"
            className="bg-[#1DAEDE] cursor-pointer flex items-center justify-center rounded-md h-12 w-[200px]"
            disabled={!stripe || !elements}
          >
            <p className="text-white">
              {translate("Confirm and Pay", selectedLanguage)}
            </p>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutForm;
