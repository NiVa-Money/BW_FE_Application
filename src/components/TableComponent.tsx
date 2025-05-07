/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Stack,
} from "@mui/material";
import { COLORS } from "../constants/index";
import { camelCaseToWords } from "../hooks/functions";

interface TableProps {
  headers: string[];
  rows: any;
  rowsPerPage?: number;
  width?: string | number;
  height?: string | number;
}

const CommonTable: React.FC<TableProps> = ({
  headers,
  rows,
  rowsPerPage = 7,
  width = "100%",
}) => {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(rows.length / rowsPerPage);

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  return (
    <div style={{ width }} className="overflow-hidden">
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: "8px",
        }}
      >
        <Table stickyHeader sx={{ minWidth: 650 }} size="small">
          {/* Always render Table Header */}
          <TableHead>
            <TableRow>
              {headers.map((header, index) => (
                <TableCell key={index} sx={{ color: COLORS.GRAY }}>
                  {camelCaseToWords(header)}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={headers.length}
                  sx={{ height: "62px", textAlign: 'center' }}
                >
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              rows
                .slice((page - 1) * rowsPerPage, page * rowsPerPage)
                .map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {headers.map((header, colIndex) => (
                      <TableCell
                        key={colIndex}
                        sx={{ borderBottom: "0px solid #E0E0E0", textAlign: 'center' }}
                      >
                        {row[header]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ✅ Pagination only appears if rows exist */}
      {totalPages > 1 && rows.length > 0 && (
        <Stack spacing={2} className="flex mt-2 justify-center items-center">
          <Pagination
            size="small"
            count={totalPages}
            color="primary"
            page={page}
            onChange={handlePageChange}
          />
        </Stack>
      )}
    </div>
  );
};

export default CommonTable;
