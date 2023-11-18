"use client";
import useLoadingAndError from "../../hooks/useLoadingAndError";
import { SessionUserProps } from "../dashboard/DashboardCard";
import LoadingScreen from "../loading/LoadingScreen";
import RecordsCard from "./RecordsCard";

const RecordsUI: React.FC<SessionUserProps> = ({ user }) => {
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
        orgId={user.organization ?? ""}
      />
    </>
  );
};

export default RecordsUI;
