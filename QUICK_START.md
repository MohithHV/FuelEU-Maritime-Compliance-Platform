# Quick Start Guide - FuelEU Maritime Platform

## 🚀 Super Easy Way to Run the App

### First Time or Anytime - Just One Command!

```bash
./start.sh
```

That's it! ✨

---

## What Happens When You Run `./start.sh`?

### **First Time** (takes ~3-5 minutes):
1. ⏳ Installs all backend dependencies
2. ⏳ Sets up database
3. ⏳ Adds sample ship data
4. ⏳ Installs all frontend dependencies
5. 🚀 Starts both servers

### **Every Time After** (takes ~10 seconds):
- 🚀 Just starts both servers immediately!

---

## 📍 After Starting

The terminal will show:
```
🎉 Application is running!
======================================

📍 Access the application:
   Frontend:  http://localhost:3000
   Backend:   http://localhost:3001
   Health:    http://localhost:3001/health

💡 Press Ctrl+C to stop both servers
```

**Open your browser**: http://localhost:3000

---

## 🛑 Stopping the App

### Option 1: Press `Ctrl+C` in the terminal
The script automatically stops both servers cleanly.

### Option 2: Run the stop script
```bash
./stop.sh
```

---

## 🔧 Troubleshooting

### If ports are already in use:
```bash
# Stop everything first
./stop.sh

# Then start fresh
./start.sh
```

### If something goes wrong:
```bash
# Stop everything
./stop.sh

# Manually stop any remaining processes
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9

# Start again
./start.sh
```

---

## 📝 Manual Method (If You Prefer)

### Terminal 1 - Backend:
```bash
cd backend
npm install          # First time only
npm run dev
```

### Terminal 2 - Frontend:
```bash
cd frontend
npm install          # First time only
npm run dev
```

---

## ✅ Is This Safe?

**Yes! 100% Safe!** ✅

The script only:
- Installs packages from package.json
- Sets up the database
- Starts the servers
- Stops them cleanly when you press Ctrl+C

It doesn't:
- ❌ Delete any files
- ❌ Access external sites
- ❌ Modify your system
- ❌ Install global packages

---

## 💡 Pro Tips

1. **Leave it running**: Keep the terminal open while using the app
2. **Stop before closing Mac**: Press Ctrl+C before closing your laptop
3. **Restart anytime**: Just run `./start.sh` again
4. **Check what's running**: Open http://localhost:3001/health

---

## 🎯 Next Steps

After starting, you can:
1. Open http://localhost:3000
2. Explore the 4 tabs:
   - **Routes**: View ship routes
   - **Compare**: Check compliance
   - **Banking**: Manage credits
   - **Pooling**: Create pools

Enjoy! 🚢✨
