import { useState, useEffect } from "react";
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
} from "@mui/material";
import topics from "../../public/data/topics.json"; // adjust path if needed
import { useNavigate } from "react-router-dom";
import { initGoogleDrive, requestAccessToken, listHcaDatasetFiles } from "../api/g_drive";

function DatasetOverview() {
  const [gradeFilter, setGradeFilter] = useState("All");
  const [codeFilter, setCodeFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [files, setFiles] = useState<any[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [filesError, setFilesError] = useState<string | null>(null);

  const topicsPerPage = 8;

  // Initialize Google OAuth once
  useEffect(() => {
    // add your client id here
    initGoogleDrive(
      "155955343784-6irmopfiamnaukf3unegefssusqus4i8.apps.googleusercontent.com",
      "https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/drive.file"
    );
  }, []);

  useEffect(() => {
    if (darkMode) document.body.classList.add("dark-mode");
    else document.body.classList.remove("dark-mode");
  }, [darkMode]);

  const grades = ["All", ...new Set(topics.map((t) => t.grade))];
  const codes = ["All", ...new Set(topics.map((t) => t.code))];

  const filteredTopics = topics.filter((t) => {
    const matchesGrade = gradeFilter === "All" || t.grade === gradeFilter;
    const matchesCode = codeFilter === "All" || t.code === codeFilter;
    const matchesSearch =
      search === "" ||
      t.topic.toLowerCase().includes(search.toLowerCase()) ||
      t.code.toLowerCase().includes(search.toLowerCase());
    return matchesGrade && matchesCode && matchesSearch;
  });

  const startIndex = (page - 1) * topicsPerPage;
  const paginatedTopics = filteredTopics.slice(startIndex, startIndex + topicsPerPage);

  async function handleListFiles() {
    setLoadingFiles(true);
    setFilesError(null);
    try {
      requestAccessToken(
        async (token) => {
          try {
            const driveFiles = await listHcaDatasetFiles();
            setFiles(driveFiles);
            setLoadingFiles(false);
          } catch (err: any) {
            setFilesError(err.message);
            setLoadingFiles(false);
          }
        },
        (err) => {
          setFilesError(err);
          setLoadingFiles(false);
        }
      );
    } catch (err: any) {
      setFilesError("Error connecting to Google Drive.");
      setLoadingFiles(false);
    }
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "var(--color-bg)", py: 4 }}>
      {/* Dark/Light Mode Toggle */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mr: 4 }}>
        <Button variant="outlined" onClick={() => setDarkMode((p) => !p)}>
          {darkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </Button>
      </Box>

      {/* Filters */}
      <Box sx={{ display: "flex", gap: 2, mb: 4, flexWrap: "wrap", px: 3, py: 2 }}>
        <FormControl sx={{ minWidth: 120 }} size="small">
          <InputLabel>Grade</InputLabel>
          <Select value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)} label="Grade">
            {grades.map((g) => (
              <MenuItem key={g} value={g}>
                {g}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 160 }} size="small">
          <InputLabel>NGSS Code</InputLabel>
          <Select value={codeFilter} onChange={(e) => setCodeFilter(e.target.value)} label="NGSS Code">
            {codes.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Search Topic or Code"
          variant="outlined"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          sx={{ flexGrow: 1, minWidth: 200 }}
          size="small"
        />
      </Box>

      {/* Google Drive File Listing */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3, mx: 4 }}>
        <Button variant="contained" onClick={handleListFiles}>
          List HCA_Dataset Files
        </Button>
        {loadingFiles && <Typography>Loading files...</Typography>}
        {filesError && <Typography color="error">{filesError}</Typography>}
      </Box>

      {files.length > 0 && (
        <Box sx={{ mx: 4, mb: 4, p: 2 }}>
          <Typography variant="h6">Files in HCA_Dataset:</Typography>
          <ul>
            {files.map((file) => (
              <li key={file.id}>
                {file.name} <small>({file.mimeType})</small>
              </li>
            ))}
          </ul>
        </Box>
      )}

      {/* Topics Grid */}
      <Box sx={{ width: "90vw", mx: "auto", display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center", py: 6 }}>
        {paginatedTopics.map((topic, idx) => (
          <Card key={idx} sx={{ width: 300, p: 2, cursor: "pointer" }} onClick={() => navigate(`/topic/${topic.code}`)}>
            <CardContent>
              <Typography variant="h6">{topic.code}</Typography>
              <Typography variant="body2">{topic.topic}</Typography>
              <Typography variant="caption">Grade: {topic.grade}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {filteredTopics.length > topicsPerPage && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination count={Math.ceil(filteredTopics.length / topicsPerPage)} page={page} onChange={(e, val) => setPage(val)} />
        </Box>
      )}
    </Box>
  );
}

export default DatasetOverview;
