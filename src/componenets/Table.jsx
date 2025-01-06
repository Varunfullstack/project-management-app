import PropTypes from "prop-types";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Typography,
  Stack,
} from "@mui/material";

const DataTable = ({ columns, data }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (isMobile) {
    return (
      <Box sx={{ width: "100%" }}>
        <Stack spacing={2}>
          {data.map((row) => (
            <Card key={row.id}>
              <CardContent>
                {columns.map((column) => (
                  <Box
                    key={column.id}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Typography variant="subtitle2" color="text.secondary">
                      {column.label}:
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent:
                          column.align === "center" ? "center" : "flex-end",
                      }}
                    >
                      {column.render ? column.render(row) : row[column.id]}
                    </Box>
                  </Box>
                ))}
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <TableContainer component={Paper} sx={{ width: "100%", mb: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="data table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "rgba(0, 0, 0, 0.04)" }}>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || "left"}
                  sx={{
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    "&:last-child": {
                      paddingRight: 3,
                    },
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow
                key={row.id || index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                {columns.map((column) => (
                  <TableCell
                    key={`${row.id}-${column.id}`}
                    align={column.align || "left"}
                  >
                    {column.render ? column.render(row) : row[column.id]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

DataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      align: PropTypes.oneOf(["left", "center", "right"]),
      render: PropTypes.func,
    })
  ).isRequired,
  data: PropTypes.array.isRequired,
  title: PropTypes.string,
};

export default DataTable;
