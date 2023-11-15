"use client";
import useLoadingAndError from "../../hooks/useLoadingAndError";
import LoadingScreen from "../loading/LoadingScreen";
import RecordsCard from "./RecordsCard";

const RecordsUI = () => {
  const { isLoading, error, startLoading, stopLoading, handleError } =
    useLoadingAndError();

  return (
    <>
      {isLoading && <LoadingScreen />}
      {error && <p>Error: {error}</p>}
      <RecordsCard
        startLoading={startLoading}
        stopLoading={startLoading}
        handleError={handleError}
      />
    </>
  );
};

export default RecordsUI;
