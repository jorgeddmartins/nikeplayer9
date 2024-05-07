cd src/assets/
find . -name "*.jpg" -exec bash -c 'file="{}"; squoosh-cli --mozjpeg auto "$file"' \;

