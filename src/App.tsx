import React, { useState, useMemo } from "react";
import {
  Container,
  Typography,
  TextField,
  Autocomplete,
  Box,
  createFilterOptions,
  createTheme,
  ThemeProvider,
  CssBaseline,
  Paper,
  Fade,
  Zoom,
  Chip,
  Button,
  Badge,
} from "@mui/material";
import { Rocket, SearchOff, FilterList } from "@mui/icons-material";
import CommandTable from "./components/CommandTable";
import allCommands from "./commands.json";

// Define the Command interface
interface Command {
  id: string;
  name: string;
  usage: string;
  example: string;
  labels: string[];
  description: string;
  prompt: string;
}

// Create a modern theme with gradient colors
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#6366f1",
      light: "#818cf8",
      dark: "#4f46e5",
    },
    secondary: {
      main: "#ec4899",
      light: "#f472b6",
      dark: "#db2777",
    },
    background: {
      default: "#f8fafc",
      paper: "#ffffff",
    },
    text: {
      primary: "#1e293b",
      secondary: "#64748b",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 700,
      background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: "0 4px 12px rgba(99, 102, 241, 0.15)",
            },
            "&.Mui-focused": {
              boxShadow: "0 4px 20px rgba(99, 102, 241, 0.25)",
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        },
      },
    },
  },
});

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [showContent, setShowContent] = useState(false);

  React.useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setShowContent(true), 100);
  }, []);

  const allLabels = useMemo(() => {
    const labelsSet = new Set<string>();
    allCommands.forEach((command) => {
      command.labels.forEach((label) => labelsSet.add(label));
    });
    return Array.from(labelsSet);
  }, []);

  const filteredCommands = useMemo(() => {
    return allCommands.filter((command) => {
      const searchTermLower = searchTerm.toLowerCase();

      const matchesSearchTerm =
        searchTerm === "" ||
        command.name.toLowerCase().includes(searchTermLower) ||
        command.description.toLowerCase().includes(searchTermLower) ||
        command.prompt.toLowerCase().includes(searchTermLower);

      const matchesLabels =
        selectedLabels.length === 0 ||
        selectedLabels.every((label) => command.labels.includes(label));

      return matchesSearchTerm && matchesLabels;
    });
  }, [searchTerm, selectedLabels]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)",
            zIndex: 0,
          },
        }}
      >
        <Container
          maxWidth="lg"
          sx={{ pt: 4, pb: 8, position: "relative", zIndex: 1 }}
        >
          {/* Header Section */}
          <Fade in={showContent} timeout={1000}>
            <Box>
              {/* GitHub Star Button */}
              <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
                <a
                  href="https://github.com/gemini-cli-ext/commands"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="https://img.shields.io/github/stars/gemini-cli-ext/commands?style=social"
                    alt="GitHub Stars"
                  />
                </a>
              </Box>

              {/* Hero Section */}
              <Box sx={{ textAlign: "center", mb: 6 }}>
                <Zoom in={showContent} timeout={1200}>
                  <Box>
                    <Badge
                      badgeContent={allCommands.length}
                      sx={{
                        "& .MuiBadge-badge": {
                          backgroundColor: "#fbbf24",
                          color: "#1e293b",
                          fontSize: "0.9rem",
                          fontWeight: 700,
                          height: "28px",
                          minWidth: "28px",
                          borderRadius: "14px",
                          border: "2px solid rgba(255, 255, 255, 0.9)",
                          right: -8,
                          top: -8,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 2,
                          mb: 2,
                          p: 2,
                          borderRadius: "20px",
                          background: "rgba(255, 255, 255, 0.1)",
                          backdropFilter: "blur(10px)",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          position: "relative",
                        }}
                      >
                        <Rocket sx={{ fontSize: 40, color: "#fbbf24" }} />
                        <Typography
                          variant="h3"
                          component="h1"
                          sx={{
                            fontSize: { xs: "2rem", md: "3rem" },
                            textAlign: "left",
                          }}
                        >
                          Gemini CLI Commands Hub
                        </Typography>
                      </Box>
                    </Badge>
                  </Box>
                </Zoom>

                <Typography
                  variant="h6"
                  sx={{
                    color: "rgba(255, 255, 255, 0.9)",
                    maxWidth: 600,
                    mx: "auto",
                    fontSize: { xs: "1.1rem", md: "1.25rem" },
                    fontWeight: 400,
                    lineHeight: 1.6,
                  }}
                >
                  Discover and share powerful AI-powered commands for your
                  terminal workflow
                </Typography>
              </Box>
            </Box>
          </Fade>

          {/* Search Section */}
          <Fade in={showContent} timeout={1400}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: "20px 20px 0 0",
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderBottom: "none",
                mb: 0,
              }}
            >
              <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                <TextField
                  label="Search commands..."
                  variant="outlined"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{
                    flexGrow: 1,
                    minWidth: "280px",
                    "& .MuiInputLabel-root": {
                      color: "#64748b",
                    },
                  }}
                  placeholder="Try 'git', 'commit', 'deploy'..."
                />
                <Autocomplete
                  multiple
                  id="labels-filter"
                  options={allLabels}
                  value={selectedLabels}
                  onChange={(event, newValue) => {
                    setSelectedLabels(newValue);
                  }}
                  filterOptions={createFilterOptions()}
                  getOptionLabel={(option) => option}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Filter by tags"
                      placeholder="Select tags..."
                      sx={{
                        "& .MuiInputLabel-root": {
                          color: "#64748b",
                        },
                      }}
                    />
                  )}
                  sx={{ flexGrow: 1, minWidth: "280px" }}
                />
              </Box>
            </Paper>
          </Fade>

          {/* Commands Table or Empty State */}
          <Fade in={showContent} timeout={1600}>
            <Box>
              {filteredCommands.length > 0 ? (
                <CommandTable commands={filteredCommands as Command[]} />
              ) : (
                <Paper
                  elevation={0}
                  sx={{
                    p: 6,
                    textAlign: "center",
                    borderRadius: "0 0 20px 20px",
                    background: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderTop: "none",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 3,
                    }}
                  >
                    <Box
                      sx={{
                        p: 3,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #f3f4f6, #e5e7eb)",
                        color: "#9ca3af",
                      }}
                    >
                      <SearchOff sx={{ fontSize: 48 }} />
                    </Box>

                    <Box>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 600,
                          color: "#374151",
                          mb: 1,
                        }}
                      >
                        No Commands Found
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: "#6b7280",
                          maxWidth: 500,
                          mx: "auto",
                          lineHeight: 1.6,
                          mb: 2,
                        }}
                      >
                        {searchTerm || selectedLabels.length > 0
                          ? "Try adjusting your search terms or filters to find the commands you're looking for."
                          : "It looks like there are no commands available right now."}
                      </Typography>

                      {!searchTerm && selectedLabels.length === 0 && (
                        <Box sx={{ mt: 3 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              color: "#374151",
                              fontWeight: 600,
                              mb: 2,
                            }}
                          >
                            🚀 Create Your Own Commands
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#6b7280",
                              maxWidth: 600,
                              mx: "auto",
                              lineHeight: 1.6,
                              mb: 3,
                            }}
                          >
                            Follow our best practice workflow to create and
                            share your own AI-powered commands:
                          </Typography>

                          <Box
                            sx={{
                              textAlign: "left",
                              maxWidth: 600,
                              mx: "auto",
                            }}
                          >
                            <Typography
                              variant="subtitle2"
                              sx={{ color: "#374151", fontWeight: 600, mb: 1 }}
                            >
                              1️⃣ Install the command generator:
                            </Typography>
                            <Paper
                              sx={{
                                p: 2,
                                mb: 2,
                                backgroundColor: "#1e293b",
                                color: "#e2e8f0",
                                borderRadius: "8px",
                                fontFamily: "monospace",
                                fontSize: "0.9rem",
                                overflow: "auto",
                              }}
                            >
                              <code>
                                curl -o ~/.gemini/commands/new-command.toml
                                https://gemini-cli-ext.github.io/commands/new-command.toml
                              </code>
                            </Paper>

                            <Typography
                              variant="subtitle2"
                              sx={{ color: "#374151", fontWeight: 600, mb: 1 }}
                            >
                              2️⃣ Generate your command:
                            </Typography>
                            <Paper
                              sx={{
                                p: 2,
                                mb: 2,
                                backgroundColor: "#0f172a",
                                color: "#94a3b8",
                                borderRadius: "8px",
                                fontFamily: "monospace",
                                fontSize: "0.9rem",
                                overflow: "auto",
                              }}
                            >
                              <code>
                                /new-command "create a git squash command that
                                takes a number N and squashes the last N
                                commits"
                              </code>
                            </Paper>

                            <Typography
                              variant="subtitle2"
                              sx={{ color: "#374151", fontWeight: 600, mb: 1 }}
                            >
                              3️⃣ Refine and share:
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: "#6b7280",
                                lineHeight: 1.6,
                                fontStyle: "italic",
                              }}
                            >
                              Edit the generated TOML file, then contribute it
                              back to this repository via Pull Request!
                            </Typography>
                          </Box>
                        </Box>
                      )}
                    </Box>

                    {(searchTerm || selectedLabels.length > 0) && (
                      <Box
                        sx={{
                          display: "flex",
                          gap: 2,
                          flexWrap: "wrap",
                          justifyContent: "center",
                        }}
                      >
                        {searchTerm && (
                          <Chip
                            label={`Search: "${searchTerm}"`}
                            onDelete={() => setSearchTerm("")}
                            color="primary"
                            variant="outlined"
                            sx={{ fontWeight: 500 }}
                          />
                        )}
                        {selectedLabels.map((label) => (
                          <Chip
                            key={label}
                            label={label}
                            onDelete={() =>
                              setSelectedLabels(
                                selectedLabels.filter((l) => l !== label),
                              )
                            }
                            color="secondary"
                            variant="outlined"
                            icon={<FilterList sx={{ fontSize: 16 }} />}
                            sx={{ fontWeight: 500 }}
                          />
                        ))}
                      </Box>
                    )}

                    {(searchTerm || selectedLabels.length > 0) && (
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setSearchTerm("");
                          setSelectedLabels([]);
                        }}
                        sx={{
                          borderRadius: "25px",
                          px: 3,
                          py: 1,
                          fontWeight: 600,
                          borderColor: "#d1d5db",
                          color: "#6b7280",
                          "&:hover": {
                            borderColor: "#9ca3af",
                            backgroundColor: "#f9fafb",
                          },
                        }}
                      >
                        Clear All Filters
                      </Button>
                    )}
                  </Box>
                </Paper>
              )}
            </Box>
          </Fade>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default App;
