import { useEffect, useState } from "react";
import { getLastSundayTwoWeeksPrior } from "../utils/dateUtils";

const useDateRange = () => {
  const [dateState, setDateState] = useState<
    Array<{
      startDate: Date | undefined;
      endDate: Date | undefined;
      key: string;
    }>
  >([
    {
      startDate: undefined,
      endDate: undefined,
      key: "selection",
    },
  ]);

  const { startDate, endDate } = dateState[0];

  useEffect(() => {
    if (!startDate) {
      const lastSunday = getLastSundayTwoWeeksPrior();
      setDateState((prevState) => [{ ...prevState[0], startDate: lastSunday }]);
    }
    if (!endDate) {
      setDateState((prevState) => [{ ...prevState[0], endDate: new Date() }]);
    }
  }, [startDate, endDate]);

  return { dateState, setDateState };
};

export default useDateRange;
