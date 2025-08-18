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
  Pagination,
  CardMedia,
} from "@mui/material";
import topics from "../../public/data/topics.json"; // make sure topics.json exists
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function DatasetOverview() {
  const [gradeFilter, setGradeFilter] = useState("All");
  const [codeFilter, setCodeFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const topicsPerPage = 8; // change this for more/less per page

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

  // Paginate
  const startIndex = (page - 1) * topicsPerPage;
  const paginatedTopics = filteredTopics.slice(
    startIndex,
    startIndex + topicsPerPage
  );

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "var(--color-bg)", py: 4 }}>
      {/* Dark/Light Mode Toggle */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 2, mr: 4 }}>
        <Button
          variant="outlined"
          onClick={() => setDarkMode((prev) => !prev)}
          sx={{
            borderColor: 'var(--color-accent)',
            color: 'var(--color-accent)',
            fontWeight: 600,
            borderRadius: 2,
            textTransform: 'none',
            px: 2.5,
            py: 1,
            '&:hover': {
              borderColor: 'var(--color-accent-dark)',
              color: 'var(--color-accent-dark)',
              background: 'rgba(25, 118, 210, 0.08)',
            },
          }}
        >
          {darkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </Button>
      </Box>
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
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // reset to first page when searching
          }}
          sx={{ flexGrow: 1, minWidth: 200 }}
          size="small"
        />
      </Box>

      {/* Topic Grid */}
      <Box sx={{
        width: '90vw',
        maxWidth: 1400,
        mx: "auto",
        display: "flex",
        flexWrap: "wrap",
        gap: 4,
        justifyContent: "center",
        bgcolor: 'transparent',
        minHeight: '100vh',
        py: 6,
      }}>
        {paginatedTopics.map((topic, index) => (
          <Box key={index} sx={{ width: '90%', maxWidth: 420, mb: 4, display: "flex", justifyContent: 'center', animation: 'fadeIn 0.7s', animationDelay: `${index * 0.05}s`, animationFillMode: 'backwards' }}>
            <Card
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: 'stretch',
                flexGrow: 1,
                width: '100%',
                height: 320,
                borderRadius: 4,
                boxShadow: 'var(--color-shadow)',
                transition: "transform 0.2s, box-shadow 0.2s",
                cursor: 'pointer',
                bgcolor: 'var(--color-card)',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-6px) scale(1.03)',
                  boxShadow: 'var(--color-shadow-hover)',
                },
              }}
              onClick={() => navigate(`/topic/${topic.code}`)}
            >
              {/* Accent bar */}
              <Box sx={{ width: 8, bgcolor: 'var(--color-accent)', borderTopLeftRadius: 16, borderBottomLeftRadius: 16 }} />
              <CardContent sx={{ flexGrow: 1, overflow: "hidden", p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ color: "var(--color-accent)", fontWeight: 700, fontSize: 22, letterSpacing: 0.5 }}
                  >
                    {topic.code}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 2,
                      color: "var(--color-text)",
                      fontSize: 17,
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {topic.topic}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    display="block"
                    sx={{ mt: 1, color: "var(--color-muted)", fontSize: 15 }}
                  >
                    Grade: {topic.grade}
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      bgcolor: "var(--color-accent)",
                      color: "var(--color-card)",
                      fontWeight: 600,
                      borderRadius: 2,
                      textTransform: "none",
                      boxShadow: 2,
                      mt: 2,
                      fontSize: 16,
                      py: 1.2,
                      letterSpacing: 0.5,
                      '&:hover': {
                        bgcolor: "var(--color-accent-dark)",
                      },
                    }}
                  >
                    View Students
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
      {/* Pagination */}
      {filteredTopics.length > topicsPerPage && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={Math.ceil(filteredTopics.length / topicsPerPage)}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
}

export default DatasetOverview;
