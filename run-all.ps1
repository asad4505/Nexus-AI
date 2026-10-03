# Nexus AI - Start All Services Script

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "  Starting Nexus AI Local Ecosystem   " -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan

# 1. Start Gateway (Port 8000)
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot/backend/gateway'; Write-Host '--- Gateway Service (8000) ---' -ForegroundColor Green; npm run dev"

# 2. Start Auth Service (Port 8001)
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot/backend/services/auth'; Write-Host '--- Auth Service (8001) ---' -ForegroundColor Green; npm run dev"

# 3. Start Chat Service (Port 8002)
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot/backend/services/chat'; Write-Host '--- Chat Service (8002) ---' -ForegroundColor Green; npm run dev"

# 4. Start Agent Service (Port 8003)
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot/backend/services/agent'; Write-Host '--- Agent Service (8003) ---' -ForegroundColor Green; npm run dev"

# 5. Start Frontend (Port 5173)
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot/frontend'; Write-Host '--- Frontend (5173) ---' -ForegroundColor Green; npm run dev"

Write-Host "`nAll 5 services have been launched in separate terminal windows." -ForegroundColor Yellow
Write-Host "Frontend is accessible at: http://localhost:5173" -ForegroundColor Cyan
Write-Host "Gateway is accessible at:  http://localhost:8000`n" -ForegroundColor Cyan
