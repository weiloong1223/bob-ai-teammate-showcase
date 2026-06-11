# 🚀 Git Setup Guide for Bob AI Teammate Showcase

## Quick Setup (PowerShell)

You're currently in: `C:\Users\106225778\Desktop\projectBob\bob-ai-teammate-showcase`

### Step 1: Initialize Git Repository
```powershell
git init
```

### Step 2: Add All Files
```powershell
git add .
```

### Step 3: Create Initial Commit
```powershell
git commit -m "Initial commit: Bob AI Teammate Showcase foundation"
```

### Step 4: Set Default Branch to Main
```powershell
git branch -M main
```

### Step 5: Add Remote Repository
```powershell
git remote add origin https://github.com/weiloong1223/bob-ai-teammate-showcase.git
```

### Step 6: Push to GitHub
```powershell
git push -u origin main
```

---

## Complete Command Sequence (Copy & Paste)

```powershell
# Initialize repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Bob AI Teammate Showcase foundation"

# Rename branch to main
git branch -M main

# Add remote
git remote add origin https://github.com/weiloong1223/bob-ai-teammate-showcase.git

# Push to GitHub
git push -u origin main
```

---

## If You Get Errors

### Error: "fatal: not a git repository"
**Solution:** Run `git init` first

### Error: "src refspec main does not match any"
**Solution:** You need to create a commit first
```powershell
git add .
git commit -m "Initial commit"
git branch -M main
```

### Error: "remote origin already exists"
**Solution:** Remove and re-add the remote
```powershell
git remote remove origin
git remote add origin https://github.com/weiloong1223/bob-ai-teammate-showcase.git
```

### Error: "failed to push some refs"
**Solution:** Pull first if the remote has content
```powershell
git pull origin main --allow-unrelated-histories
git push -u origin main
```

---

## Verify Setup

After pushing, verify with:
```powershell
# Check remote
git remote -v

# Check branch
git branch

# Check status
git status
```

---

## Next Steps After Push

1. **Enable GitHub Pages:**
   - Go to: https://github.com/weiloong1223/bob-ai-teammate-showcase/settings/pages
   - Source: Deploy from branch
   - Branch: main
   - Folder: / (root)
   - Save

2. **Your site will be live at:**
   - https://weiloong1223.github.io/bob-ai-teammate-showcase

3. **Update README.md:**
   - Replace `yourusername` with `weiloong1223`
   - Add live demo link

---

## Troubleshooting

### Check if Git is installed:
```powershell
git --version
```

### Check current directory:
```powershell
pwd
```

### List files:
```powershell
ls
```

### Check Git status:
```powershell
git status
```

---

## Alternative: Using Git Bash

If PowerShell gives issues, you can use Git Bash:

1. Right-click in the folder
2. Select "Git Bash Here"
3. Use Unix-style commands with `&&`:
```bash
git init && git add . && git commit -m "Initial commit" && git branch -M main && git remote add origin https://github.com/weiloong1223/bob-ai-teammate-showcase.git && git push -u origin main
```

---

## Need Help?

If you encounter any issues:
1. Check the error message carefully
2. Make sure you're in the correct directory
3. Verify the GitHub repository exists
4. Check your Git configuration:
   ```powershell
   git config --global user.name
   git config --global user.email
   ```

If not configured:
```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

---

**Ready to push! Follow the steps above.** 🚀