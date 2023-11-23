for file in images/*.{jpg,png}; do
#    [ ! -f "tn/$file" ] && convert "$file"  -thumbnail 300x900 "tn/$file"
    [ ! -f "tn/$file" ] && convert "$file"  -resize 50%  "tn/$file"

done
