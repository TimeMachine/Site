START /min "dataBase" "C:\Program Files\MongoDB\Server\3.0\bin\mongod.exe" --dbpath C:\Users\ntu_glenus\Desktop\site\db --noprealloc --smallfiles
ping -n 2 127.0.0.1 >nul
START /min "webSite" node C:\Users\ntu_glenus\Desktop\site\app.js
ping -n 2 127.0.0.1 >nul
START /min "Backup" "C:\mongoDB_backup\backup.bat"