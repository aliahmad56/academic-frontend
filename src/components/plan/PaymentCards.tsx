import { translate } from "../../utils/i18n";

function PaymentCards({
  type,
  price,
  title,
  btntext,
  platform,
  handleStoreInfo,
  selectedLanguage,
}: any) {
  const handleOnButtonClick = () => {
    handleStoreInfo();
  };

  return (
    <div>
      <div className="w-full md:w-[356px] md:h-[320px] h-auto bg-white border border-[#1DAEDE] rounded-md">
        {/* Translate 'Free', 'Pro' etc. */}
        <p className="text-[#1DAEDE] font-poppins text-center pt-4 font-[300]">
          {platform}
        </p>
        <p className="text-[#DE1D1D] font-poppins text-center py-4">
          {translate(type, selectedLanguage)}
        </p>
        <div className="flex items-center justify-center">
          <p className="text-[#484848] font-poppins text-[32px] font-[500]">
            $
          </p>
          <p className="text-[#484848] font-[700] text-[64px]">{price}</p>
          {/* Translate 'month' only if it's 'Pro' */}
        </div>
        {/* Translate 'No credit card required' */}
        <p className="text-[#828282] text-[14px] font-[400] font-poppins text-center">
          {translate(title, selectedLanguage)}
        </p>
        <div className="flex items-center justify-center mt-6">
          <div
            onClick={handleOnButtonClick}
            className="w-full md:w-[308px] h-[48px] mx-4 md:max-0 bg-[#1DAEDE] flex items-center justify-center rounded-md gap-4 cursor-pointer"
          >
            <p className="text-white text-[12px] md:text-[14px]">
              {translate(btntext, selectedLanguage)}
            </p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-5 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </div>
        </div>

        {/* Loop through free plans */}
        {/* <div className="flex items-center gap-4 mt-[50px] justify-center "></div>
        <div className="flex items-center gap-4 mt-4 justify-center  px-4 md:px-0 py-4 md:py-0"></div> */}
      </div>
    </div>
  );
}

export default PaymentCards;
