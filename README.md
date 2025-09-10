# Gemini CLI Commands Hub

Welcome to the Gemini CLI Commands Hub!

This is a community-driven repository for collecting, sharing, and discovering custom commands for the [Gemini CLI](https://github.com/google/gemini-cli).

## ✨ Project Vision

Our goal is to build an active community where every Gemini CLI user can easily find commands tailored to their specific needs and conveniently share their own creations. Whether you want to automate daily workflows, integrate specific tools, or just explore new ways to use the CLI, this is your starting point.

## 🚀 How to Contribute Your Command

### Recommended Workflow (Best Practice)

For the best experience, we recommend using the `/new-command` command itself to bootstrap your creation. This ensures your command file is created in the right place with the correct basic structure.

1.  **Install the `/new-command`:**

    Open your terminal and run the following command to install it:

    ```sh
    curl -o ~/.gemini/commands/new-command.toml https://gemini-cli-commands-hub.github.io/commands/new-command.toml
    ```

2.  **Generate Your Command:**

    Use `/new-command` with a natural language description of the command you want to create. For example:

    ```sh
    /new-command "create a git squash command that takes a number N as an argument and squashes the last N commits, then regenerates the commit message based on the diff"
    ```

3.  **Refine and Submit:**

    The above command will generate a new `.toml` file in your `~/.gemini/commands/` directory. Open this file, refine the prompt and description, and then move it into the `src/commands/` directory of this repository to create your Pull Request.

---

We welcome and encourage all users to contribute the commands they have created! The submission process is straightforward—just follow these steps:

### 1. Create the Command File

*   Create a new `.toml` file inside the `src/commands/` directory.
*   The filename should be concise and reflect the command's function, using kebab-case (e.g., `git-rebase-interactive.toml`).

### 2. Write the Command Content

Your `.toml` file must define the following fields:

*   `label` (String): A short, lowercase category label (e.g., "git", "code", "testing"). This is used for filtering and organization.
*   `description` (String): A brief, one-line description of the command's function, which will be displayed in the help list and on the website.
*   `prompt` (String): The core instruction that will be sent to the Gemini model. You can use the `{{args}}` placeholder to handle user input, `!{...}` to execute local shell commands, or `@{...}` to embed file content.

**Example (`git-squash.toml`):**

```toml
# Command: /git:squash
# Usage: /git:squash <N>
# Example: /git:squash 3

label = "git"
description = "Squashes the last N Git commits into a single one and regenerates the commit message based on the changes."

prompt = '''
Based on the Git Diff from the last {{args}} commits provided below, and following our internal commit message format, generate a new, high-quality Git commit message.

--- Commit Message Style Guide ---
@{.gemini/GIT-COMMIT-MESSAGE.md}
--- End of Style Guide ---

Your task is to generate the final, complete commit message.
'''
```

### 3. Create a Pull Request

*   After creating your `.toml` file, open a Pull Request against the `main` branch of the upstream repository.
*   Please use our **Pull Request Template** to fill in the necessary information. This will help us review your contribution more quickly.

We look forward to your creative ideas!
