import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  IconButton,
  Tooltip,
  DialogActions,
  Button,
  Card,
  CardContent,
  Fade,
  Slide,
  useMediaQuery,
  useTheme,
  Stack,
  Divider,
  Alert,
} from "@mui/material";
import {
  ContentCopy,
  Download,
  Code,
  PlayArrow,
  Terminal,
  CheckCircle,
  Launch,
  Tag,
} from "@mui/icons-material";
import ReactMarkdown from "react-markdown";

// Command interface
interface Command {
  id: string;
  name: string;
  usage: string;
  example: string;
  labels: string[];
  description: string;
  prompt: string;
}

interface CommandTableProps {
  commands: Command[];
}

const Transition = React.forwardRef(function Transition(
  props: any,
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CommandTable: React.FC<CommandTableProps> = ({ commands }) => {
  const [selectedCommand, setSelectedCommand] = useState<Command | null>(null);
  const [open, setOpen] = useState(false);
  const [promptCopied, setPromptCopied] = useState(false);
  const [installCopied, setInstallCopied] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleRowClick = (command: Command) => {
    setSelectedCommand(command);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCommand(null);
    setPromptCopied(false);
    setInstallCopied(false);
  };

  const handleCopyPrompt = async () => {
    if (selectedCommand?.prompt) {
      await navigator.clipboard.writeText(selectedCommand.prompt);
      setPromptCopied(true);
      setTimeout(() => setPromptCopied(false), 2000);
    }
  };

  const handleCopyInstall = async () => {
    if (selectedCommand) {
      const installScript = `
# Create directory if it doesn't exist
mkdir -p ~/.gemini/commands/

# Download the command
curl -o ~/.gemini/commands/${selectedCommand.id}.toml ${window.location.href}/commands/${selectedCommand.id}.toml

echo "Command '${selectedCommand.name}' installed successfully!"
      `.trim();
      await navigator.clipboard.writeText(installScript);
      setInstallCopied(true);
      setTimeout(() => setInstallCopied(false), 2000);
    }
  };

  const getLabelColor = (label: string) => {
    const colors = [
      { bg: "#e0f2fe", color: "#0369a1" }, // blue
      { bg: "#f0fdf4", color: "#15803d" }, // green
      { bg: "#fef3c7", color: "#d97706" }, // yellow
      { bg: "#fce7f3", color: "#be185d" }, // pink
      { bg: "#f3e8ff", color: "#7c3aed" }, // purple
      { bg: "#fff1f2", color: "#dc2626" }, // red
    ];
    const hash = label.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  if (isMobile) {
    // Mobile Card Layout
    return (
      <>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderTop: "none",
            borderRadius: "0 0 20px 20px",
            p: 3,
          }}
        >
          {commands.map((command, index) => (
            <Box key={command.id}>
              <Fade in timeout={300 + index * 100}>
                <Card
                  sx={{
                    cursor: "pointer",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    border: "1px solid rgba(0, 0, 0, 0.08)",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 12px 40px rgba(0, 0, 0, 0.12)",
                      borderColor: theme.palette.primary.main,
                    },
                  }}
                  onClick={() => handleRowClick(command)}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}
                    >
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: "8px",
                          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                          color: "white",
                          minWidth: "fit-content",
                        }}
                      >
                        <Terminal sx={{ fontSize: 20 }} />
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 600, mb: 1, color: "#1e293b" }}
                        >
                          {command.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "#64748b", mb: 2, lineHeight: 1.6 }}
                        >
                          {command.description}
                        </Typography>
                        <Stack
                          direction="row"
                          spacing={1}
                          flexWrap="wrap"
                          gap={1}
                        >
                          {command.labels.map((label) => {
                            const labelStyle = getLabelColor(label);
                            return (
                              <Chip
                                key={label}
                                label={label}
                                size="small"
                                sx={{
                                  backgroundColor: labelStyle.bg,
                                  color: labelStyle.color,
                                  fontWeight: 500,
                                  height: "24px",
                                  "& .MuiChip-label": {
                                    px: 1,
                                  },
                                }}
                                icon={<Tag sx={{ fontSize: 14 }} />}
                              />
                            );
                          })}
                        </Stack>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Fade>
            </Box>
          ))}
        </Box>

        {/* Dialog remains the same for both layouts */}
        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth="md"
          fullWidth
          TransitionComponent={Transition}
          PaperProps={{
            sx: {
              borderRadius: "16px",
              boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
            },
          }}
        >
          {selectedCommand && (
            <>
              <DialogTitle
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Terminal />
                <Typography
                  variant="h5"
                  component="span"
                  sx={{ fontWeight: 600 }}
                >
                  {selectedCommand.name}
                </Typography>
              </DialogTitle>
              <DialogContent dividers sx={{ p: 0 }}>
                <Box sx={{ p: 3 }}>
                  <Box mb={3}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        color: "#1e293b",
                      }}
                    >
                      <Code sx={{ fontSize: 20 }} />
                      Description
                    </Typography>
                    <Typography sx={{ color: "#64748b", lineHeight: 1.6 }}>
                      {selectedCommand.description}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  <Box mb={3}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        color: "#1e293b",
                      }}
                    >
                      <PlayArrow sx={{ fontSize: 20 }} />
                      Usage
                    </Typography>
                    <Paper
                      sx={{
                        p: 2,
                        backgroundColor: "#1e293b",
                        color: "#e2e8f0",
                        borderRadius: "8px",
                        fontFamily: "monospace",
                        overflow: "auto",
                      }}
                    >
                      <code>{selectedCommand.usage}</code>
                    </Paper>
                  </Box>

                  <Box mb={3}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        color: "#1e293b",
                      }}
                    >
                      <Launch sx={{ fontSize: 20 }} />
                      Example
                    </Typography>
                    <Paper
                      sx={{
                        p: 2,
                        backgroundColor: "#0f172a",
                        color: "#94a3b8",
                        borderRadius: "8px",
                        fontFamily: "monospace",
                        overflow: "auto",
                      }}
                    >
                      <code>{selectedCommand.example}</code>
                    </Paper>
                  </Box>

                  <Box mb={3}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        color: "#1e293b",
                      }}
                    >
                      <Tag sx={{ fontSize: 20 }} />
                      Labels
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                      {selectedCommand.labels.map((label) => {
                        const labelStyle = getLabelColor(label);
                        return (
                          <Chip
                            key={label}
                            label={label}
                            sx={{
                              backgroundColor: labelStyle.bg,
                              color: labelStyle.color,
                              fontWeight: 500,
                            }}
                          />
                        );
                      })}
                    </Stack>
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  <Box>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={2}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          color: "#1e293b",
                        }}
                      >
                        <Code sx={{ fontSize: 20 }} />
                        AI Prompt
                      </Typography>
                      <Tooltip title={promptCopied ? "Copied!" : "Copy Prompt"}>
                        <IconButton
                          onClick={handleCopyPrompt}
                          sx={{
                            bgcolor: promptCopied
                              ? "#10b981"
                              : theme.palette.primary.main,
                            color: "white",
                            "&:hover": {
                              bgcolor: promptCopied
                                ? "#059669"
                                : theme.palette.primary.dark,
                            },
                            transition: "all 0.3s ease",
                          }}
                        >
                          {promptCopied ? <CheckCircle /> : <ContentCopy />}
                        </IconButton>
                      </Tooltip>
                    </Box>

                    {promptCopied && (
                      <Alert severity="success" sx={{ mb: 2 }}>
                        Prompt copied to clipboard!
                      </Alert>
                    )}

                    <Paper
                      variant="outlined"
                      sx={{
                        p: 3,
                        backgroundColor: "#f8fafc",
                        border: "2px dashed #cbd5e1",
                        borderRadius: "12px",
                        maxHeight: "400px",
                        overflow: "auto",
                        "& pre": {
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                          margin: 0,
                          fontFamily: "monospace",
                        },
                        "& code": {
                          fontFamily: "monospace",
                          fontSize: "0.9em",
                        },
                      }}
                    >
                      <ReactMarkdown>{selectedCommand.prompt}</ReactMarkdown>
                    </Paper>
                  </Box>
                </Box>
              </DialogContent>
              <DialogActions
                sx={{
                  p: 3,
                  backgroundColor: "#f8fafc",
                  justifyContent: "space-between",
                }}
              >
                <Button onClick={handleClose} sx={{ color: "#64748b" }}>
                  Close
                </Button>
                <Tooltip
                  title={
                    installCopied
                      ? "Installation script copied!"
                      : "Copy installation script"
                  }
                >
                  <Button
                    variant="contained"
                    startIcon={installCopied ? <CheckCircle /> : <Download />}
                    onClick={handleCopyInstall}
                    sx={{
                      background: installCopied
                        ? "#10b981"
                        : `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      px: 3,
                      py: 1,
                      borderRadius: "25px",
                      fontWeight: 600,
                      "&:hover": {
                        background: installCopied
                          ? "#059669"
                          : `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                      },
                    }}
                  >
                    {installCopied ? "Copied!" : "Install Command"}
                  </Button>
                </Tooltip>
              </DialogActions>
            </>
          )}
        </Dialog>
      </>
    );
  }

  // Desktop Table Layout
  return (
    <>
      <Paper
        elevation={0}
        sx={{
          borderRadius: "0 0 20px 20px",
          overflow: "hidden",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderTop: "none",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
        }}
      >
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="commands table">
            <TableHead>
              <TableRow
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                }}
              >
                <TableCell
                  sx={{ color: "white", fontWeight: 700, fontSize: "1rem" }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Terminal />
                    Command
                  </Box>
                </TableCell>
                <TableCell
                  sx={{ color: "white", fontWeight: 700, fontSize: "1rem" }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Code />
                    Description
                  </Box>
                </TableCell>
                <TableCell
                  sx={{ color: "white", fontWeight: 700, fontSize: "1rem" }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Tag />
                    Labels
                  </Box>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {commands.map((command, index) => (
                <Fade in timeout={300 + index * 50} key={command.id}>
                  <TableRow
                    hover
                    onClick={() => handleRowClick(command)}
                    sx={{
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "#f1f5f9",
                        transform: "scale(1.01)",
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                      },
                      "&:hover td": {
                        borderColor: "transparent",
                      },
                    }}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{
                        fontWeight: 600,
                        color: "#1e293b",
                        fontSize: "1rem",
                      }}
                    >
                      {command.name}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#64748b",
                        lineHeight: 1.6,
                        maxWidth: "400px",
                      }}
                    >
                      {command.description}
                    </TableCell>
                    <TableCell>
                      <Stack
                        direction="row"
                        spacing={1}
                        flexWrap="wrap"
                        gap={1}
                      >
                        {command.labels.map((label) => {
                          const labelStyle = getLabelColor(label);
                          return (
                            <Chip
                              key={label}
                              label={label}
                              size="small"
                              sx={{
                                backgroundColor: labelStyle.bg,
                                color: labelStyle.color,
                                fontWeight: 500,
                                transition: "transform 0.2s ease",
                                "&:hover": {
                                  transform: "scale(1.1)",
                                },
                              }}
                            />
                          );
                        })}
                      </Stack>
                    </TableCell>
                  </TableRow>
                </Fade>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Same Dialog as mobile version */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        TransitionComponent={Transition}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
          },
        }}
      >
        {selectedCommand && (
          <>
            <DialogTitle
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                color: "white",
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Terminal />
              <Typography
                variant="h5"
                component="span"
                sx={{ fontWeight: 600 }}
              >
                {selectedCommand.name}
              </Typography>
            </DialogTitle>
            <DialogContent dividers sx={{ p: 0 }}>
              <Box sx={{ p: 3 }}>
                <Box mb={3}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      color: "#1e293b",
                    }}
                  >
                    <Code sx={{ fontSize: 20 }} />
                    Description
                  </Typography>
                  <Typography sx={{ color: "#64748b", lineHeight: 1.6 }}>
                    {selectedCommand.description}
                  </Typography>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Box mb={3}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      color: "#1e293b",
                    }}
                  >
                    <PlayArrow sx={{ fontSize: 20 }} />
                    Usage
                  </Typography>
                  <Paper
                    sx={{
                      p: 2,
                      backgroundColor: "#1e293b",
                      color: "#e2e8f0",
                      borderRadius: "8px",
                      fontFamily: "monospace",
                      overflow: "auto",
                    }}
                  >
                    <code>{selectedCommand.usage}</code>
                  </Paper>
                </Box>

                <Box mb={3}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      color: "#1e293b",
                    }}
                  >
                    <Launch sx={{ fontSize: 20 }} />
                    Example
                  </Typography>
                  <Paper
                    sx={{
                      p: 2,
                      backgroundColor: "#0f172a",
                      color: "#94a3b8",
                      borderRadius: "8px",
                      fontFamily: "monospace",
                      overflow: "auto",
                    }}
                  >
                    <code>{selectedCommand.example}</code>
                  </Paper>
                </Box>

                <Box mb={3}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      color: "#1e293b",
                    }}
                  >
                    <Tag sx={{ fontSize: 20 }} />
                    Labels
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                    {selectedCommand.labels.map((label) => {
                      const labelStyle = getLabelColor(label);
                      return (
                        <Chip
                          key={label}
                          label={label}
                          sx={{
                            backgroundColor: labelStyle.bg,
                            color: labelStyle.color,
                            fontWeight: 500,
                          }}
                        />
                      );
                    })}
                  </Stack>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Box>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        color: "#1e293b",
                      }}
                    >
                      <Code sx={{ fontSize: 20 }} />
                      AI Prompt
                    </Typography>
                    <Tooltip title={promptCopied ? "Copied!" : "Copy Prompt"}>
                      <IconButton
                        onClick={handleCopyPrompt}
                        sx={{
                          bgcolor: promptCopied
                            ? "#10b981"
                            : theme.palette.primary.main,
                          color: "white",
                          "&:hover": {
                            bgcolor: promptCopied
                              ? "#059669"
                              : theme.palette.primary.dark,
                          },
                          transition: "all 0.3s ease",
                        }}
                      >
                        {promptCopied ? <CheckCircle /> : <ContentCopy />}
                      </IconButton>
                    </Tooltip>
                  </Box>

                  {promptCopied && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                      Prompt copied to clipboard!
                    </Alert>
                  )}

                  <Paper
                    variant="outlined"
                    sx={{
                      p: 3,
                      backgroundColor: "#f8fafc",
                      border: "2px dashed #cbd5e1",
                      borderRadius: "12px",
                      maxHeight: "400px",
                      overflow: "auto",
                      "& pre": {
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        margin: 0,
                        fontFamily: "monospace",
                      },
                      "& code": {
                        fontFamily: "monospace",
                        fontSize: "0.9em",
                      },
                    }}
                  >
                    <ReactMarkdown>{selectedCommand.prompt}</ReactMarkdown>
                  </Paper>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions
              sx={{
                p: 3,
                backgroundColor: "#f8fafc",
                justifyContent: "space-between",
              }}
            >
              <Button onClick={handleClose} sx={{ color: "#64748b" }}>
                Close
              </Button>
              <Tooltip
                title={
                  installCopied
                    ? "Installation script copied!"
                    : "Copy installation script"
                }
              >
                <Button
                  variant="contained"
                  startIcon={installCopied ? <CheckCircle /> : <Download />}
                  onClick={handleCopyInstall}
                  sx={{
                    background: installCopied
                      ? "#10b981"
                      : `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    px: 3,
                    py: 1,
                    borderRadius: "25px",
                    fontWeight: 600,
                    "&:hover": {
                      background: installCopied
                        ? "#059669"
                        : `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                    },
                  }}
                >
                  {installCopied ? "Copied!" : "Install Command"}
                </Button>
              </Tooltip>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
};

export default CommandTable;
