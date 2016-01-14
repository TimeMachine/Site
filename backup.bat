:loop
	mongodump -h localhost:27017 -d bloodline -o C:\mongoDB_backup\%date:~0,4%-%date:~5,2%-%date:~8,2%\%time:~0,2%(h)-%time:~3,2%(m)
	timeout /t 86400
goto loop