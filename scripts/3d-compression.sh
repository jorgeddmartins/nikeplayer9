# Move to uncompressed folder
cd public/3d/uncompressed

export NODE_OPTIONS=--no-experimental-fetch

# Run for all files
for file in $(ls -p); do (
  echo "compression: $file"
  gltf-transform webp $file ../compressed/webp-${file}
  gltf-transform resize --width 512 --height 512 $file ../compressed/resize-${file}
  gltf-transform draco ../compressed/resize-$file ../compressed/${file}
  rm ../compressed/webp-${file}
  rm ../compressed/resize-${file}
) done
