: %wspath%exe\pos.exe 666
if "%*"=="" (for /f "delims=" %%i in ('%wspath%datetime') do set commit_msg=%%i ) else (set commit_msg=%*)


for %%a in ("%cd%") do set repo=%%~nxa

git config --global user.email qgbcs1@gmail.com
git config --global user.name QGB

git config --global core.filemode false
git config --global credential.helper store

git remote add q https://github.com/qgb/%repo%
git remote add cq https://coding.net/u/qgb/p/%repo%/git
git add -A
git commit -m "%commit_msg%"
git push cq master 
git push q master 