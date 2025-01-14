// // import React from "react";

// function RegistrationFormInput({
//   id,
//   label,
//   type,
//   options,
//   required,
//   icon,
// }: any) {
//   return (
//     <>
//       <div>
//         <label className="text-md block mb-1" htmlFor={id}>
//           {label}
//           {required && <span className="text-red-500"> *</span>}
//         </label>
//         {type === "select" ? (
//           <select id={id} className="input-field w-full bg-white p-3">
//             {options?.map((option: string, index: number) => (
//               <option key={index} value={option}>
//                 {option}
//               </option>
//             ))}
//           </select>
//         ) : (
//           <div className="relative flex items-center">
//             {icon && (
//               <img
//                 src={icon}
//                 alt="icon"
//                 className="absolute inset-y-0 top-2.5 left-3 w-5 h-5"
//               />
//             )}
//             <input
//               id={id}
//               type={type}
//               placeholder={label}
//               className="input-field w-full pl-10 p-2 "
//             />
//           </div>
//         )}
//       </div>
//     </>
//   );
// }

// export default RegistrationFormInput;

function RegistrationFormInput({
  id,
  label,
  type,
  required,
  icon,
  value,
  onChange,
  onBlur,
  options,
  placeHolderText,
}: any) {
  return (
    <div>
      <label className="text-md block mb-1" htmlFor={id}>
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      {type === "select" ? (
        <select
          id={id}
          name={id}
          className="input-field w-full bg-white p-3"
          value={value}
          onChange={onChange}
          onBlur={onBlur}
        >
          <option value="" disabled>
            {placeHolderText}
          </option>
          {options?.map((option: string, index: number) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <div className="relative flex items-center">
          {icon && (
            <img
              src={icon}
              alt="icon"
              className="absolute inset-y-0 top-2.5 left-3 w-5 h-5"
            />
          )}
          <input
            id={id}
            name={id}
            type={type}
            placeholder={label}
            className="input-field w-full pl-10 p-2"
            value={value}
            onChange={onChange}
            onBlur={onBlur}
          />
        </div>
      )}
    </div>
  );
}

export default RegistrationFormInput;
