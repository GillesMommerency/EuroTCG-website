# VS Code Auto-Formatting Setup Guide

## 🎯 **Automatic Formatting on Save**

Your VS Code workspace is now configured for **automatic formatting** at every
opportunity:

### **What Happens Automatically**

✅ **Format on Save** - Every time you save a file (Ctrl+S) ✅ **Format on
Paste** - When you paste code from elsewhere ✅ **Format on Type** - As you type
(for supported languages) ✅ **Auto-save** - Saves files when you switch
tabs/windows ✅ **Auto-organize imports** - Sorts and removes unused imports

### **Setup Instructions**

#### 1. **Install Recommended Extensions**

When you open the project, VS Code will prompt you to install recommended
extensions. Click **"Install All"** to get:

- **Prettier** - Code formatter
- **Astro** - Astro language support
- **Tailwind CSS** - CSS class autocomplete
- **GitLens** - Enhanced Git integration
- **Path Intellisense** - File path autocomplete

#### 2. **Verify Settings**

The workspace is pre-configured with optimal settings in
`.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.formatOnPaste": true,
  "editor.formatOnType": true,
  "prettier.configPath": "./config/.prettierrc"
}
```

#### 3. **Keyboard Shortcuts**

- **Format Document**: `Shift + Alt + F`
- **Format Selection**: `Ctrl + K, Ctrl + F`
- **Auto-save Toggle**: `Ctrl + Shift + P` → "Toggle Auto Save"

### **File-Specific Formatting**

Each file type uses the optimal formatter:

| File Type    | Formatter | Auto-Format |
| ------------ | --------- | ----------- |
| `.astro`     | Prettier  | ✅          |
| `.ts/.tsx`   | Prettier  | ✅          |
| `.js/.jsx`   | Prettier  | ✅          |
| `.json`      | Prettier  | ✅          |
| `.md`        | Prettier  | ✅          |
| `.css/.scss` | Prettier  | ✅          |
| `.yml/.yaml` | Prettier  | ✅          |

### **Development Workflow**

#### **Before (Manual)**

```bash
# Write code
# Save file
npm run format  # Manual formatting
git commit
```

#### **After (Automatic)**

```bash
# Write code
# Save file → Auto-formatted ✨
# Switch tabs → Auto-saved ✨
git commit  # Pre-commit hook formats any missed files ✨
```

### **Multi-Layer Formatting Protection**

1. **VS Code** - Format on save/paste/type
2. **Pre-commit Hook** - Format before commit
3. **GitHub Actions** - Format during CI/CD
4. **Manual Commands** - `npm run format` when needed

### **Troubleshooting**

#### **Formatting Not Working?**

1. Check if Prettier extension is installed and enabled
2. Verify the file is supported (check bottom-right status bar)
3. Check Output panel: `View` → `Output` → Select "Prettier"

#### **Wrong Formatting Style?**

The formatter uses your project config in `config/.prettierrc`:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "tabWidth": 2,
  "useTabs": false
}
```

#### **Disable Auto-Format (if needed)**

```json
// In .vscode/settings.json
{
  "editor.formatOnSave": false
}
```

### **Team Benefits**

✅ **Consistent Code Style** - Everyone's code looks the same ✅ **No CI/CD
Failures** - Formatting issues caught before push ✅ **Faster Reviews** - No
style discussions, focus on logic ✅ **Better Git Diffs** - Only real changes,
no formatting noise ✅ **Developer Experience** - Write code, don't worry about
formatting

## 🚀 **Getting Started**

1. **Open the project in VS Code**
2. **Install recommended extensions** (VS Code will prompt you)
3. **Start coding** - formatting happens automatically!
4. **Enjoy** clean, consistent code without thinking about it

Your code will now be **automatically formatted** every time you save! 🎉
