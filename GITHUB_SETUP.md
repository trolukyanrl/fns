# Git & GitHub Setup Guide

## Step 1: Configure Git (if not already done)

Run these commands once on your machine:

```powershell
git config --global user.name "trolukyanrl"
git config --global user.email "trolukyanrl@gmail.com"
```

Use the **same email** as your GitHub account.

---

## Step 2: Create a GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click the **+** icon (top right) → **New repository**
3. Set **Repository name** (e.g., `nrl-login-app`)
4. Choose **Public**
5. **Do NOT** initialize with README, .gitignore, or license (you already have these)
6. Click **Create repository**

---

## Step 3: Add Remote and Push

After creating the repo, GitHub will show you commands. Or run:

```powershell
# Add your GitHub repo as remote (replace with YOUR username and repo name)
git remote add origin https://github.com/trolukyanrl/nrl-login-app.git

# Stage all files
git add .

# Commit
git commit -m "Initial commit: Login page with NRL branding"

# Push to GitHub (use 'main' if your default branch is main)
git push -u origin master
```

---

## Step 4: Authentication

When you push, GitHub may ask you to sign in:

- **HTTPS**: Use a Personal Access Token (PAT) instead of your password
  - GitHub → Settings → Developer settings → Personal access tokens → Generate new token
  - Give it `repo` scope
  - Use the token as your password when prompted

- **GitHub CLI** (optional): Run `gh auth login` for easier authentication

---

## Quick Reference

| Command | Purpose |
|---------|---------|
| `git status` | Check what's changed |
| `git add .` | Stage all changes |
| `git commit -m "message"` | Save changes locally |
| `git push` | Upload to GitHub |
| `git pull` | Download from GitHub |
