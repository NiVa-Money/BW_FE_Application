// import React from "react";
// import CircularProgress from "@mui/material/CircularProgress";

// interface LoaderProps {
//   loading: boolean;
//   className?: string;
// }

// const Loader: React.FC<LoaderProps> = ({ loading, className }) => {
//   if (!loading) return null;

//   return (
//     <div
//       className={`fixed inset-0 flex justify-center items-center bg-white bg-opacity-50 z-10 ${className}`}
//     >
//       <CircularProgress />
//     </div>
//   );
// };

// export default Loader;


import React from "react";


interface LoaderProps {
  loading: boolean;
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({ loading, className }) => {
  if (!loading) return null;

  return (
    <div
      className={`fixed inset-0 flex justify-center items-center bg-white bg-opacity-50 z-10 ${className}`}
    >
      <img src="/loader/botwot-loader-light.gif" alt="Loading..." />
    </div>
  );
};

export default Loader;