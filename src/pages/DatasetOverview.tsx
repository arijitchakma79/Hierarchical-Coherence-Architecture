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
              <MenuItem key={g} value={g}>{g}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 160 }} size="small">
          <InputLabel>NGSS Code</InputLabel>
          <Select value={codeFilter} onChange={(e) => setCodeFilter(e.target.value)} label="NGSS Code">
            {codes.map((c) => (
              <MenuItem key={c} value={c}>{c}</MenuItem>
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
      {/* Removed the List HCA_Dataset Files button and status messages */}

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
          <Card
            key={idx}
            sx={{
              width: 320,
              minHeight: 200,
              borderRadius: 4,
              boxShadow: 'var(--color-shadow)',
              bgcolor: 'var(--color-card)',
              p: 2,
              cursor: "pointer",
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'stretch',
              position: 'relative',
              overflow: 'hidden',
              transition: 'transform 0.2s, box-shadow 0.2s',
              animation: 'fadeIn 0.7s',
              animationDelay: `${idx * 0.05}s`,
              animationFillMode: 'backwards',
              '&:hover': {
                transform: 'translateY(-6px) scale(1.03)',
                boxShadow: 'var(--color-shadow-hover)',
              },
            }}
            onClick={() => navigate(`/topic/${topic.code}`)}
          >
            {/* Accent bar for card */}
            <Box sx={{ width: 6, bgcolor: 'var(--color-accent)', borderTopLeftRadius: 16, borderBottomLeftRadius: 16, mr: 2 }} />
            <CardContent sx={{ flexGrow: 1, overflow: "hidden", p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
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
              </Box>
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
