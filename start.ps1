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
