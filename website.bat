START /min "dataBase" "C:\Program Files\MongoDB\Server\3.2\bin\mongod.exe" --dbpath D:\Site\db --noprealloc --smallfiles
ping -n 2 127.0.0.1 >nul
START /min "webSite" node D:\Site\app.js