import React, { useEffect, useRef } from "react";

const ErrorMessage = ({ error, errorDuration }) => {
  const errorRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      errorRef.current && errorRef.current.classList.add("error-appear");
    }, 1);
    setTimeout(() => {
      errorRef.current && errorRef.current.classList.remove("error-appear");
    }, errorDuration);
  }, [errorDuration]);
  return <p ref={errorRef}>{error.msg}</p>;
};

export default ErrorMessage;
