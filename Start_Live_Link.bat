@echo off
title MovieMate Live Link Launcher
echo ====================================================
echo Starting MovieMate Backend & Cloudflare Live Tunnel...
echo ====================================================
cd /d "C:\Users\saheb\.gemini\antigravity\scratch\MovieTicketBookingSystem\Backend\MovieTicketBooking.API"
start "" "dotnet" "bin\Debug\net10.0\MovieTicketBooking.API.dll" --urls "http://localhost:5000"
timeout /t 3 >nul
echo.
echo Launching Live Public Link via Cloudflare...
start "Cloudflare Live Tunnel" "C:\Users\saheb\.gemini\antigravity\scratch\tools\cloudflared.exe" tunnel --url http://localhost:5000
echo.
echo ====================================================
echo Live link will appear in the Cloudflare window!
echo You can share that https://*.trycloudflare.com link
echo with anyone on mobile or anywhere in the world!
echo ====================================================
pause
