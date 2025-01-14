import { useFormik } from "formik";
import {
  updateSettings,
  resetState,
  SettingsPayload,
  fetchSettings,
} from "../../redux/settingsFormSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { useEffect } from "react";

// interface SettingsPayload {
//   readingHistory: boolean;
//   emailPreferences: {
//     preferenceKey: boolean;
//     frequency: string;
//     emailLanguage: string;
//   };
//   notifications: {
//     notificationKey: boolean;
//     notificationLanguage: string;
//   };
//   resercherPassword: string;
// }

interface FormValues {
  oldPassword: string; // User input, not sent to API
  newPassword: string; // User input, not sent to API
  resercherPassword: string; // Confirm password, sent to API
  readingHistory: boolean;
  emailPreferences: {
    preferenceKey: boolean;
    frequency: string;
    emailLanguage: string;
  };
  notifications: {
    notificationKey: boolean;
    notificationLanguage: string;
  };
}

const Settings = () => {
  const dispatch: AppDispatch = useDispatch();
  const { isLoading, UserSettings } = useSelector(
    (state: RootState) => state.settings
  );
  if (isLoading) {
    console.log("first");
  }

  // Reset the state when component unmounts
  useEffect(() => {
    dispatch(fetchSettings()); // Fetch when component mounts

    return () => {
      dispatch(resetState()); // Only reset when unmounting
    };
  }, [dispatch]);

  const formik = useFormik<FormValues>({
    enableReinitialize: true, // This ensures form reinitializes when initialValues change
    initialValues: UserSettings
      ? {
          oldPassword: "",
          newPassword: "",
          resercherPassword: "",
          readingHistory: UserSettings.readingHistory,
          emailPreferences: {
            preferenceKey: UserSettings.emailPreferences.preferenceKey,
            frequency: UserSettings.emailPreferences.frequency,
            emailLanguage: UserSettings.emailPreferences.emailLanguage,
          },
          notifications: {
            notificationKey: UserSettings.notifications.notificationKey,
            notificationLanguage:
              UserSettings.notifications.notificationLanguage,
          },
        }
      : {
          oldPassword: "",
          newPassword: "",
          resercherPassword: "",
          readingHistory: false,
          emailPreferences: {
            preferenceKey: false,
            frequency: "",
            emailLanguage: "",
          },
          notifications: {
            notificationKey: false,
            notificationLanguage: "",
          },
        },
    onSubmit: (values, {resetForm}) => {
      // Check if passwords match and are not empty
      console.log(values);
      if (
        values.newPassword &&
        values.newPassword === values.resercherPassword
      ) {
        // Create properly typed API payload
        const apiPayload: SettingsPayload = {
          readingHistory: values.readingHistory,
          emailPreferences: values.emailPreferences,
          notifications: values.notifications,
          resercherPassword: values.newPassword,
        };

        dispatch(updateSettings(apiPayload))
          .unwrap()
          .then(() => {
            console.log("Settings updated successfully");
            // Handle success (e.g., show success message)
            resetForm();
            dispatch(fetchSettings());
          })
          .catch((err) => {
            console.error("Error updating settings:", err);
            // Handle error (e.g., show error message)
          });
      } else {
        // Handle password mismatch error
        console.error("Passwords don't match or are empty");
      }
    },
  });

  return (
    <div className="flex">
      <div className="space-y-8 w-full">
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Settings</h2>

              <p className="text-gray-500">
                Customize your experience and manage your preferences to tailor
                the application to your needs.
              </p>
              <h2 className="text-[22px] font-medium mt-4">
                Track Reading History
              </h2>
              <div className="flex items-center justify-between">
                <p className="text-gray-500">
                  Manage your preferences for personalized recommendations.
                </p>

                <div className="flex items-center mt-4">
                  <label className="inline-flex relative items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="readingHistory"
                      checked={formik.values.readingHistory}
                      onChange={() =>
                        formik.setFieldValue(
                          "readingHistory",
                          !formik.values.readingHistory
                        )
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-[22px] font-medium mb-4">
                Email Notification Preferences
              </h2>
              <div className="flex items-center justify-between">
                <div className="text-gray-500">
                  <label
                    htmlFor="emailPreferences.frequency"
                    className="block text-gray-500"
                  >
                    Choose frequency
                  </label>
                  <div className="mt-2">
                    <select
                      id="emailPreferences.frequency"
                      name="emailPreferences.frequency"
                      value={formik.values.emailPreferences.frequency}
                      onChange={formik.handleChange}
                      className="bg-gray-200 rounded-lg py-2 px-4 text-gray-500 w-full"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center">
                  <label
                    className="inline-flex relative items-center cursor-pointer"
                    htmlFor="emailPreferences.preferenceKey"
                  >
                    <input
                      type="checkbox"
                      id="emailPreferences.preferenceKey"
                      checked={formik.values.emailPreferences.preferenceKey}
                      onChange={() =>
                        formik.setFieldValue(
                          "emailPreferences.preferenceKey",
                          !formik.values.emailPreferences.preferenceKey
                        )
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray -700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <h2 className=" text-[22px] font-medium mb-4 mt-5 ">
                Choose Language
              </h2>
              <div className="flex items-center justify-between">
                <div className="text-gray-500">
                  <label
                    htmlFor="emailPreferences.emailLanguage"
                    className="block text-gray-500"
                  >
                    Preferred Language
                  </label>
                  <select
                    id="emailPreferences.emailLanguage"
                    name="emailPreferences.emailLanguage"
                    value={formik.values.emailPreferences.emailLanguage}
                    onChange={formik.handleChange}
                    className="bg-gray-200 rounded-lg py-2 px-4 text-gray-500 w-full mt-2"
                  >
                    <option value="english">English</option>
                    <option value="chinese">Chinese</option>
                    <option value="spanish">Spanish</option>
                    <option value="hindi">Hindi</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-2xl font-bold mb-4">Notifications</h2>
            <h6 className="text-md font-normal mb-4 text-gray-500">
              Configure your preferences for receiving in-app notifications for
              suggested papers.
            </h6>
            <div className="flex items-center justify-between">
              <div className="">
                <p>Choose language</p>
                <div className="mt-2">
                  <select
                    id="notifications.notificationLanguage"
                    name="notifications.notificationLanguage"
                    value={formik.values.notifications.notificationLanguage}
                    onChange={formik.handleChange}
                    className="bg-gray-200 rounded-lg py-2 px-4 text-gray-500 w-full"
                  >
                    <option value="english">English</option>
                    <option value="chinese">Chinese</option>
                    <option value="spanish">Spanish</option>
                    <option value="hindi">Hindi</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center">
                <label className="inline-flex relative items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="notifications.notificationKey"
                    checked={formik.values.notifications.notificationKey}
                    onChange={() =>
                      formik.setFieldValue(
                        "notifications.notificationKey",
                        !formik.values.notifications.notificationKey
                      )
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-2xl font-bold mb-4">Change Password</h2>
            <h6 className="text-md font-normal mb-4 text-gray-500">
              Secure your account by updating your password and ensure the
              safety of your account information.
            </h6>

            <div className="mb-4">
              <label
                htmlFor="passwords.oldPassword"
                className="block mb-2 text-base font-normal"
              >
                Enter old password
              </label>
              <input
                type="password"
                id="passwords.oldPassword"
                name="oldPassword"
                value={formik.values.oldPassword}
                onChange={formik.handleChange}
                className="bg-white input-field w-full"
                placeholder="Password"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="passwords.newPassword"
                  className="block mb-2 text-base font-normal"
                >
                  Enter new password
                </label>
                <input
                  type="password"
                  id="passwords.newPassword"
                  name="newPassword"
                  value={formik.values.newPassword}
                  onChange={formik.handleChange}
                  className="bg-white input-field w-full"
                  placeholder="Password"
                />
              </div>

              <div>
                <label
                  htmlFor="passwords.confirmPassword"
                  className="block mb-2 text-base font-normal"
                >
                  Confirm new password
                </label>
                <input
                  type="password"
                  id="passwords.confirmPassword"
                  name="resercherPassword"
                  value={formik.values.resercherPassword}
                  onChange={formik.handleChange}
                  className="bg-white input-field w-full"
                  placeholder="Password"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6 gap-4">
            <button
              type="button"
              onClick={() => formik.resetForm()}
              className="text-red-500 border border-red-500 px-4 py-2 rounded-lg hover:bg-red-50"
            >
              Reset changes
            </button>
            <button
              type="submit"
              className="bg-[#1DAEDE] text-white px-4 py-2 rounded-lg hover:bg-[#31c3f3]"
            >
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Settings;
