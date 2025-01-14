import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import RegistrationFormInput from "./RegistrationFormInput";
import { submitRegistration } from "../../redux/registrationSlice";
import { AppDispatch } from "../../redux/store";

import userIcon from "../../assets/icons/user.svg";
import calenderIcon from "../../assets/icons/calender.svg";
import emailIcon from "../../assets/icons/email.svg";
import phoneIcon from "../../assets/icons/phone.svg";
import addressIcon from "../../assets/icons/address.svg";
import affiliationIcon from "../../assets/icons/affiliation.svg";
import heartIcon from "../../assets/icons/heart.svg";
import publicationIcon from "../../assets/icons/publications.svg";
import academicIcon from "../../assets/icons/acadmc.svg";
import membershipIcon from "../../assets/icons/membership.svg";
import { number } from "yup";

function ResearcherRegistration() {
  const dispatch: AppDispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      gender: "",
      DOB: "",
      email: "",
      phone: "",
      address: "",
      affiliation: "",
      researchInterests: "",
      language: "",
      academicQualification: "",
      researchPublication: "",
      membership: "",
    },
    onSubmit: (values) => {
      // Dispatch the API call through the async thunk
      dispatch(submitRegistration(values));
      console.log("Form submitted", values); // For logging the form submission values
    },
  });
  return (
    <div className="bg-white sm:p-[1.5rem] p-[1rem] h-[100vh] flex flex-col gap-10 rounded-lg  overflow-auto relative">
      {/* Form */}
      <div className="flex-1 bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Researcher Registration</h1>
        <p className="text-md text-gray-600 mb-8">
          Please complete the following fields.
        </p>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Personal Details */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Personal Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RegistrationFormInput
                id={"firstName"}
                label={"First Name"}
                type={"text"}
                required={true}
                icon={userIcon}
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />

              <RegistrationFormInput
                id={"lastName"}
                label={"Last Name"}
                type={"text"}
                required={true}
                icon={userIcon}
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />

              <RegistrationFormInput
                id="gender"
                label="Gender"
                type="select"
                options={["Female", "Male"]}
                required={false}
                value={formik.values.gender}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeHolderText={"Select Gender"}

              />

              <RegistrationFormInput
                id={"DOB"}
                label={"Date of Birth"}
                type={"date"}
                required={false}
                icon={calenderIcon}
                value={formik.values.DOB}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RegistrationFormInput
                id={"email"}
                label={"Email Address"}
                type={"email"}
                required={true}
                icon={emailIcon}
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />

              <RegistrationFormInput
                id={"phone"}
                label={"Phone Number"}
                type={number}
                required={false}
                icon={phoneIcon}
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            <div className="col-span-2 mt-4">
              <RegistrationFormInput
                id={"address"}
                label={"Address"}
                type={"text"}
                required={false}
                icon={addressIcon}
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
          </div>

          {/* Research Interests */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Research Interests</h2>
            <div className="grid grid-cols-1 gap-4">
              <RegistrationFormInput
                id={"affiliation"}
                label={"Affiliation"}
                type={"text"}
                required={true}
                icon={affiliationIcon}
                value={formik.values.affiliation}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />

              <RegistrationFormInput
                id={"researchInterests"}
                label={"Research Interests"}
                type={"text"}
                required={true}
                icon={heartIcon}
                value={formik.values.researchInterests}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <RegistrationFormInput
                id="language"
                label="Preferred Language"
                type="select"
                options={["English", "Chinese"]}
                required={true}
                value={formik.values.language}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeHolderText={"Select Preferred Language"}
              />
            </div>
          </div>

          {/* Qualifications */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Qualifications</h2>
            <div className="grid grid-cols-1 gap-4">
              <RegistrationFormInput
                id={"academicQualification"}
                label={"Academic Qualifications"}
                type={"text"}
                required={false}
                icon={academicIcon}
                value={formik.values.academicQualification}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />

              <RegistrationFormInput
                id={"researchPublication"}
                label={"Research Publications"}
                type={"text"}
                required={false}
                icon={publicationIcon}
                value={formik.values.researchPublication}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />

              <RegistrationFormInput
                id={"membership"}
                label={" Professional Memberships"}
                type={"text"}
                required={false}
                icon={membershipIcon}
                value={formik.values.membership}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-[#1DAEDE] text-white rounded-lg hover:bg-[#4dd0fc]"
              // disabled={formik.isSubmitting}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResearcherRegistration;
