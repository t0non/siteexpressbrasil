@echo off
call npx -y create-next-app@latest lp-site-express --typescript --eslint --src-dir --app --import-alias "@/*" --use-npm --no-tailwind
xcopy lp-site-express . /E /H /Y
rmdir /S /Q lp-site-express
