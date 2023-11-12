import { Dispatch, SetStateAction } from "react";
import { DateRange } from "react-date-range";

interface DateRangePickerProps {
  dateState: {
    startDate: Date | undefined;
    endDate: Date | undefined;
    key: string;
  }[];
  setDateState: Dispatch<
    SetStateAction<
      {
        startDate: Date | undefined;
        endDate: Date | undefined;
        key: string;
      }[]
    >
  >;
}

const DateRangePicker = ({ dateState, setDateState }: DateRangePickerProps) => {
  // TODO: Rid of any type
  const handleSelect = (ranges: any) => {
    const { startDate, endDate } = ranges.selection;
    setDateState([{ startDate, endDate, key: "selection" }]);
  };

  return (
    <DateRange
      editableDateInputs={true}
      onChange={handleSelect}
      moveRangeOnFirstSelection={false}
      ranges={dateState}
    />
  );
};

export default DateRangePicker;
