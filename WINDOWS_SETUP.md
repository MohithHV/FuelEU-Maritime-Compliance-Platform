# Windows Setup Guide - FuelEU Maritime Compliance Platform

This guide will help you set up and run the FuelEU Maritime Compliance Platform on Windows.

## Prerequisites

### 1. Install Node.js
- Download Node.js 18+ from: https://nodejs.org/
- Choose the **LTS (Long Term Support)** version
- Run the installer and follow the wizard
- Verify installation:
  ```cmd
  node --version
  npm --version
  ```

### 2. Install Docker Desktop for Windows
- Download from: https://www.docker.com/products/docker-desktop/
- Run the installer
- **Important**: Enable WSL 2 backend during installation
- Restart your computer after installation
- Start Docker Desktop from the Start menu
- Verify installation:
  ```cmd
  docker --version
  ```

### 3. Install Git (Optional but recommended)
- Download from: https://git-scm.com/download/win
- Use default settings during installation

## Setup Instructions

### Step 1: Download the Project

If you have Git installed:
```cmd
git clone <repository-url>
cd mohit
```

Or download and extract the ZIP file from GitHub.

### Step 2: Set Up PostgreSQL Database

1. **Open PowerShell or Command Prompt as Administrator**

2. **Start Docker Desktop** (wait until it's fully running)

3. **Create PostgreSQL container:**
   ```cmd
   docker run -d --name fueleu-postgres -e POSTGRES_USER=fueleu -e POSTGRES_PASSWORD=fueleu123 -e POSTGRES_DB=fueleu_db -p 5432:5432 postgres:14-alpine
   ```

4. **Verify container is running:**
   ```cmd
   docker ps
   ```
   You should see `fueleu-postgres` in the list.

### Step 3: Set Up Backend

1. **Navigate to backend folder:**
   ```cmd
   cd backend
   ```

2. **Install dependencies:**
   ```cmd
   npm install
   ```

3. **Generate Prisma client:**
   ```cmd
   npm run prisma:generate
   ```

4. **Run database migrations:**
   ```cmd
   npm run prisma:migrate
   ```

5. **Seed the database:**
   ```cmd
   npm run prisma:seed
   ```

6. **Start the backend server:**
   ```cmd
   npm run dev
   ```

   The backend should now be running on http://localhost:3001

   **Keep this terminal window open!**

### Step 4: Set Up Frontend

1. **Open a NEW terminal window** (PowerShell or Command Prompt)

2. **Navigate to frontend folder:**
   ```cmd
   cd path\to\mohit\frontend
   ```
   (Replace `path\to\mohit` with your actual path)

3. **Install dependencies:**
   ```cmd
   npm install
   ```

4. **Start the frontend:**
   ```cmd
   npm run dev
   ```

   The frontend should now be running on http://localhost:3000

   **Keep this terminal window open too!**

### Step 5: Access the Application

Open your browser and navigate to:
- **Frontend Dashboard**: http://localhost:3000
- **Backend API**: http://localhost:3001/api
- **Health Check**: http://localhost:3001/health

## Quick Start Script (Alternative Method)

Instead of running the setup manually, you can use this PowerShell script:

1. **Create a file named `start.ps1` in the project root:**

```powershell
# FuelEU Maritime Platform - Windows Startup Script

Write-Host "🚢 FuelEU Maritime Compliance Platform" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
Write-Host "🔍 Checking Docker..." -ForegroundColor Blue
try {
    docker ps | Out-Null
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not running. Please start Docker Desktop." -ForegroundColor Red
    Write-Host "Press any key to exit..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}

# Check if PostgreSQL container exists
Write-Host "🔍 Checking PostgreSQL container..." -ForegroundColor Blue
$containerExists = docker ps -a --filter "name=fueleu-postgres" --format "{{.Names}}"

if ($containerExists -ne "fueleu-postgres") {
    Write-Host "📦 Creating PostgreSQL container..." -ForegroundColor Blue
    docker run -d --name fueleu-postgres -e POSTGRES_USER=fueleu -e POSTGRES_PASSWORD=fueleu123 -e POSTGRES_DB=fueleu_db -p 5432:5432 postgres:14-alpine
    Start-Sleep -Seconds 5
    Write-Host "✅ PostgreSQL container created" -ForegroundColor Green
} else {
    # Check if container is running
    $containerRunning = docker ps --filter "name=fueleu-postgres" --format "{{.Names}}"
    if ($containerRunning -ne "fueleu-postgres") {
        Write-Host "🔄 Starting PostgreSQL container..." -ForegroundColor Blue
        docker start fueleu-postgres
        Start-Sleep -Seconds 3
    }
    Write-Host "✅ PostgreSQL is running" -ForegroundColor Green
}

# Check if first time setup is needed
Write-Host "🔍 Checking setup status..." -ForegroundColor Blue
$backendSetup = Test-Path "backend\node_modules"
$frontendSetup = Test-Path "frontend\node_modules"

if (-not $backendSetup -or -not $frontendSetup) {
    Write-Host "⚠️  First time setup detected!" -ForegroundColor Yellow
    Write-Host "This will take a few minutes..." -ForegroundColor Yellow
    Write-Host ""

    if (-not $backendSetup) {
        Write-Host "📦 Setting up Backend..." -ForegroundColor Blue
        Set-Location backend
        npm install
        npm run prisma:generate
        npm run prisma:migrate
        npm run prisma:seed
        Set-Location ..
        Write-Host "✅ Backend setup complete!" -ForegroundColor Green
        Write-Host ""
    }

    if (-not $frontendSetup) {
        Write-Host "📦 Setting up Frontend..." -ForegroundColor Blue
        Set-Location frontend
        npm install
        Set-Location ..
        Write-Host "✅ Frontend setup complete!" -ForegroundColor Green
        Write-Host ""
    }
} else {
    Write-Host "✅ Already setup. Starting servers..." -ForegroundColor Green
    Write-Host ""
}

# Start backend in new window
Write-Host "🔧 Starting Backend Server..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev"
Write-Host "✅ Backend started on http://localhost:3001" -ForegroundColor Green
Write-Host ""

# Wait for backend to start
Start-Sleep -Seconds 5

# Start frontend in new window
Write-Host "🎨 Starting Frontend App..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"
Write-Host "✅ Frontend started on http://localhost:3000" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🎉 Application is running!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📍 Access the application:" -ForegroundColor Blue
Write-Host "   Frontend:  http://localhost:3000"
Write-Host "   Backend:   http://localhost:3001"
Write-Host "   Health:    http://localhost:3001/health"
Write-Host ""
Write-Host "💡 Close the PowerShell windows to stop the servers" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to exit this window..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
```

2. **Run the script:**
   - Right-click on `start.ps1`
   - Select **"Run with PowerShell"**

   Or in PowerShell:
   ```powershell
   .\start.ps1
   ```

   **Note**: If you get an execution policy error, run this first:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

## Stopping the Application

### Option 1: Using Task Manager
1. Press `Ctrl + Shift + Esc` to open Task Manager
2. Find and end the Node.js processes

### Option 2: Using Command Prompt
```cmd
taskkill /F /IM node.exe
```

### Option 3: Close the Terminal Windows
Simply close the PowerShell/CMD windows running the backend and frontend.

### Stop Docker Container (Optional)
```cmd
docker stop fueleu-postgres
```

## Troubleshooting

### Port Already in Use

**Error**: "Port 3000 (or 3001) is already in use"

**Solution**:
```cmd
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with the number from above)
taskkill /PID <PID> /F
```

### Docker Container Not Starting

**Error**: "Cannot connect to Docker daemon"

**Solution**:
1. Open Docker Desktop
2. Wait for it to fully start (whale icon in system tray)
3. Try creating the container again

### Database Connection Failed

**Error**: "Can't reach database server"

**Solution**:
1. Check Docker container is running:
   ```cmd
   docker ps
   ```
2. Restart the container:
   ```cmd
   docker restart fueleu-postgres
   ```
3. Wait 5 seconds and try again

### Node Modules Error

**Error**: "Cannot find module" or "Module not found"

**Solution**:
```cmd
# In backend folder
cd backend
rmdir /s /q node_modules
npm install

# In frontend folder
cd frontend
rmdir /s /q node_modules
npm install
```

### Prisma Client Error

**Error**: "Prisma Client is not configured correctly"

**Solution**:
```cmd
cd backend
npm run prisma:generate
```

## Database Management

### View Database with Prisma Studio
```cmd
cd backend
npx prisma studio
```
Opens a web interface at http://localhost:5555 to view/edit database records.

### Reset Database
```cmd
cd backend
npm run prisma:migrate
npm run prisma:seed
```

### Backup Database
```cmd
docker exec fueleu-postgres pg_dump -U fueleu fueleu_db > backup.sql
```

### Restore Database
```cmd
docker exec -i fueleu-postgres psql -U fueleu fueleu_db < backup.sql
```

## Development Tips

### Hot Reload
Both frontend and backend support hot reload:
- Make changes to code
- Save the file
- The app will automatically reload

### Environment Variables

Create a `.env` file if you need custom configuration:

**Backend** (`backend/.env`):
```env
NODE_ENV=development
PORT=3001
DATABASE_URL="postgresql://fueleu:fueleu123@localhost:5432/fueleu_db?schema=public"
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:3001/api
```

## Next Steps

1. Open http://localhost:3000 in your browser
2. Explore the 4 tabs:
   - **Routes**: View and filter maritime routes
   - **Compare**: Compare baseline vs actual routes
   - **Banking**: Manage compliance banking (Article 20)
   - **Pooling**: Create compliance pools (Article 21)

## Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Ensure Docker Desktop is running
3. Verify Node.js version is 18 or higher
4. Check terminal/console for error messages

## Useful Commands

```cmd
# Check versions
node --version
npm --version
docker --version

# View Docker containers
docker ps -a

# View Docker container logs
docker logs fueleu-postgres

# Restart everything
docker restart fueleu-postgres
# Then restart backend and frontend

# Clean install
cd backend
rmdir /s /q node_modules
npm install

cd ../frontend
rmdir /s /q node_modules
npm install
```

Happy coding! 🚀
