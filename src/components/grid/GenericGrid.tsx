import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import {
  ColDef,
  GridApi,
  GridReadyEvent,
  RowSelectedEvent,
} from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";
import { useEffect, useRef, useState } from "react";
import {
  GRID_PAGINATION_PAGE_SIZE_OPTIONS,
  INITIAL_PAGINATION_PAGE_SIZE,
} from "../../../constants/sizes";

interface GenericGridProps<T> {
  rowData: T[];
  columnDefs: ColDef[];
  onRowSelected: (data: T) => void;
  idField: keyof T;
  allowMultipleSelection?: boolean;
}

const GenericGrid = <T extends object>({
  rowData,
  columnDefs,
  onRowSelected,
  idField,
  allowMultipleSelection = false,
}: GenericGridProps<T>) => {
  const gridRef = useRef<AgGridReact>(null);
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [paginationPageSize, setPaginationPageSize] = useState(
    INITIAL_PAGINATION_PAGE_SIZE,
  );

  useEffect(() => {
    const handleResize = () => gridApi?.sizeColumnsToFit();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [gridApi, idField]);

  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);
    params.api.sizeColumnsToFit();
  };

  const handleRowSelection = (event: RowSelectedEvent) => {
    if (event.node.isSelected()) {
      const selectedData = rowData.find(
        (data) => data[idField] === event.data[idField],
      );
      if (selectedData) onRowSelected(selectedData);
    }
  };

  const handlePageSizeChange = (event: SelectChangeEvent<number>) => {
    const newSize = parseInt(event.target.value as string, 10);
    setPaginationPageSize(newSize);
    if (gridApi) {
      gridApi.paginationSetPageSize(newSize);
    }
  };

  return (
    <Box className="ag-theme-alpine" sx={{ width: "70vw", height: "100%" }}>
      <AgGridReact
        rowSelection={allowMultipleSelection ? "multiple" : "single"}
        onRowSelected={handleRowSelection}
        onGridReady={onGridReady}
        rowData={rowData}
        columnDefs={columnDefs}
        ref={gridRef}
        animateRows={true}
        pagination={true}
        paginationPageSize={paginationPageSize}
      />
      <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
        <FormControl variant="standard" sx={{ minWidth: 120, my: 2 }}>
          <InputLabel id="pagination-page-size-label">Page Size</InputLabel>
          <Select
            labelId="pagination-page-size-label"
            id="pagination-page-size"
            value={paginationPageSize}
            label="Page Size"
            onChange={handlePageSizeChange}
          >
            {GRID_PAGINATION_PAGE_SIZE_OPTIONS.map((size) => (
              <MenuItem key={size} value={size}>
                {size}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

export default GenericGrid;
