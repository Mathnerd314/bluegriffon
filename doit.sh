make
cd dist/bin
rm /c/foo.app
zip -r /c/foo.app .
cd ../../../xulrunner/dist/bin
./xulrunner.exe --install-app /c/foo.app
cd /d/bin/opt/xrt3/composer
/c/Program\ Files/Disruptive\ Innovations\ SARL/BlueGriffon/bluegriffon.exe -jsconsole
