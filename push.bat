@set commit_message=%1
@if %commit_message% == "" (
@   echo "You must specify a commit message!"
@   exit
)

:value
    @set /p count=<version.txt
    @set /a count=%count%+1
    @echo.%count%>version.txt
    @echo.%commit_message%>commit.txt

:push
    @git add .
    @git commit -m %commit_message%
    @git push origin master
   ./publish.bat
