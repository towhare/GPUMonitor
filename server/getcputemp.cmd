@REM @echo off
@REM for /f "skip=1 tokens=2 delims==" %%A in ('wmic /namespace:\\root\wmi PATH MSAcpi_ThermalZoneTemperature get CurrentTemperature /value') do set /a "HunDegCel=(%%~A*10)-27315"
@REM echo %HunDegCel:~0,-2%.%HunDegCel:~-2% Degrees Celsius

