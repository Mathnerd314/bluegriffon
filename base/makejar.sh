cat jar.prepend
for i in content skin
do
for j in `find $i \( -name \*.xul -o -name \*.css -o -name \*.js -o -name \*.html -o -name \*.xml -o -name \*.gif -o -name \*.png -o -name \*.ico \)`
do
prefix="  "
if [ "$j" == "content/bluegriffon/aboutDialog.xul" ]; then
  prefix='* ';
elif [ "$j" == "content/bluegriffon/aboutDialog.js" ]; then
  prefix='* ';
elif [ "$j" == "content/bluegriffon/bluegriffon.js" ]; then
  prefix='* ';
elif [ "$j" == "content/bluegriffon/bluegriffon.xul" ]; then
  prefix='* ';
elif [ "$j" == "content/bluegriffon/commands.js" ]; then
  prefix='* ';
fi
echo "$prefix"$j"	("$j")";
done
done

cat jar.append
for i in locale
do
for j in `find $i \( -name \*.dtd -o -name \*html -o -name \*.properties \)`
do
prefix="  "
if [ "$j" == "locale/en-US/branding/brand.dtd" ]; then
  prefix='* ';
fi
echo "$prefix"$j"	("$j")";
done
done
