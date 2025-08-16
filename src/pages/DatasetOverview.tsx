import { useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TextField,
  Box,
} from "@mui/material";
import topics from "../../public/data/topics.json"; // make sure topics.json exists

function DatasetOverview() {
  const [gradeFilter, setGradeFilter] = useState("All");
  const [codeFilter, setCodeFilter] = useState("All");
  const [search, setSearch] = useState("");

  // Extract unique grades & codes
  const grades = ["All", ...new Set(topics.map((t) => t.grade))];
  const codes = ["All", ...new Set(topics.map((t) => t.code))];

  // Apply filters
  const filteredTopics = topics.filter((t) => {
    const matchesGrade = gradeFilter === "All" || t.grade === gradeFilter;
    const matchesCode = codeFilter === "All" || t.code === codeFilter;
    const matchesSearch =
      search === "" ||
      t.topic.toLowerCase().includes(search.toLowerCase()) ||
      t.code.toLowerCase().includes(search.toLowerCase());

    return matchesGrade && matchesCode && matchesSearch;
  });

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fa", py: 4 }}>
      {/* Filters */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 4,
          flexWrap: "wrap",
          alignItems: "center",
          bgcolor: "white",
          borderRadius: 2,
          boxShadow: 1,
          px: 3,
          py: 2,
        }}
      >
        {/* Grade filter */}
        <FormControl sx={{ minWidth: 120 }} size="small">
          <InputLabel>Grade</InputLabel>
          <Select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            label="Grade"
          >
            {grades.map((g) => (
              <MenuItem key={g} value={g}>
                {g}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Code filter */}
        <FormControl sx={{ minWidth: 160 }} size="small">
          <InputLabel>NGSS Code</InputLabel>
          <Select
            value={codeFilter}
            onChange={(e) => setCodeFilter(e.target.value)}
            label="NGSS Code"
          >
            {codes.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Search filter */}
        <TextField
          label="Search Topic or Code"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flexGrow: 1, minWidth: 200 }}
          size="small"
        />
      </Box>

      {/* Topic List (each full width row) */}
      <Box sx={{ maxWidth: 900, mx: "auto" }}>
        {filteredTopics.map((topic, index) => (
          <Card
            key={index}
            sx={{
              width: "100%",
              mb: 3,
              borderRadius: 2,
              boxShadow: 3,
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 6,
              },
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: "#1976d2", fontWeight: 600 }}
              >
                {topic.code}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1.5, color: "#333" }}>
                {topic.topic}
              </Typography>
              <Typography
                variant="caption"
                display="block"
                sx={{ mt: 1, color: "#888" }}
              >
                Grade: {topic.grade}
              </Typography>
            </CardContent>
            <Box sx={{ px: 2, pb: 2 }}>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  bgcolor: "#1976d2",
                  color: "white",
                  fontWeight: 500,
                  borderRadius: 2,
                  textTransform: "none",
                  boxShadow: 1,
                  "&:hover": {
                    bgcolor: "#115293",
                  },
                }}
              >
                View Students
              </Button>
            </Box>
          </Card>
        ))}
      </Box>
    </Box>
  );
}

export default DatasetOverview;
