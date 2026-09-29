@echo off
title MovieMate Launcher
cd /d "C:\Users\saheb\.gemini\antigravity\scratch\MovieTicketBookingSystem\Backend\MovieTicketBooking.API"
start "" "dotnet" "bin\Debug\net10.0\MovieTicketBooking.API.dll" --urls "http://localhost:5000"
timeout /t 2 >nul
start http://localhost:5000/
