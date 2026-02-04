# 🚀 Quick Start - Testing New Features

## ⚠️ Important: Restart Required

The dev servers are currently running with old code. You need to restart them to see the new features.

## How to Restart

### Option 1: Restart via Terminal (Recommended)

**Stop Current Servers:**
1. Find the terminals running `npm run dev` and `python app.py`
2. Press `Ctrl+C` in each terminal to stop them

**Start Fresh:**

**Terminal 1 - Backend:**
```bash
cd d:\Projects\zameenlink\backend
python app.py
```

**Terminal 2 - Frontend:**
```bash
cd d:\Projects\zameenlink\frontend
npm run dev
```

### Option 2: Use the Running Terminals

If you still have your original terminals open:
- Press `Ctrl+C` in each
- Press `↑` (up arrow) to recall the last command
- Press `Enter` to restart

---

## 🎯 What to Test First

### 1. Filter & Sort (Immediate!)
- Open http://localhost:3000
- Look for new **"Filters"** and **"Sort By"** buttons at top of map
- Try filtering by price range, BHK, or area
- Try sorting properties

### 2. Toast Notifications
- Watch for toast notifications in top-right corner
- You'll see a success toast when properties load
- Try filtering to see more toasts

### 3. API Documentation
- Open http://localhost:5000/api/docs
- Explore the interactive Swagger UI
- Try the "Try it out" feature on any endpoint

### 4. Error Boundary
- Works automatically if any error occurs

### 5. Loading Skeletons
- Refresh the page quickly to see skeleton loaders

### 6. PWA Installation
- Look for install icon in browser address bar (Chrome/Edge)
- Click to install as standalone app

---

## ✅ Verification Checklist

Quick checklist to verify everything works:

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Properties load on map
- [ ] Filter panel opens and works
- [ ] Sort dropdown works
- [ ] Toast notifications appear
- [ ] API docs accessible at /api/docs
- [ ] No console errors in browser (F12)

---

## 🐛 Troubleshooting

### Backend Error: "No module named 'flasgger'"
**Solution:**
```bash
cd backend
pip install -r requirements.txt
```

### Frontend Error: "Cannot find module 'react-hot-toast'"
**Solution:**
```bash
cd frontend
npm install
```

### Ports Already in Use
- Stop the old servers first (Ctrl+C)
- Wait 5 seconds
- Start again

---

## 📱 Quick Feature Tour

1. **Open the app** → http://localhost:3000
2. **Click "Filters"** → Try the price slider
3. **Click a property** → See prediction panel
4. **Check API docs** → http://localhost:5000/api/docs
5. **Install as PWA** → Look for install prompt in browser

---

## 🎉 Enjoy Your Enhanced ZameenLink!

All features are ready to use. See `walkthrough.md` for detailed documentation.
