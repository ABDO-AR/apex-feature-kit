# Deploying a New Version

```bash
# 1. Make your changes, then commit
git add .
git commit -m "your commit message"

# 2. Bump version (patch | minor | major)
npm version patch

# 3. Publish to npm
npm publish --access public

# 4. Push to GitHub (includes version tag)
git push && git push --tags
```

## Version Bumping

| Command | Bumps | Example |
|---|---|---|
| `npm version patch` | 0.1.1 → 0.1.2 | Bug fixes |
| `npm version minor` | 0.1.1 → 0.2.0 | New features |
| `npm version major` | 0.1.1 → 1.0.0 | Breaking changes |
