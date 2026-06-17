@echo off
rem ===== MOJAR — تشغيل كتطبيق في نافذة مستقلة =====
rem يفتح MOJAR.html في نافذة تطبيق (بدون شريط عنوان أو تبويبات) باستخدام Edge ثم Chrome.

setlocal
set "HTML=%~dp0MOJAR.html"
set "URL=file:///%HTML:\=/%"

rem جرّب Microsoft Edge (موجود في كل ويندوز 10/11)
start "" msedge --app="%URL%" 1>nul 2>nul && goto :eof

rem وإلا جرّب Google Chrome
start "" chrome --app="%URL%" 1>nul 2>nul && goto :eof

rem وإلا افتح بالمتصفح الافتراضي
start "" "%HTML%"
:eof
