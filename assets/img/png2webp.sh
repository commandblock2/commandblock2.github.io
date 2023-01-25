#! /bin/bash
mogrify -format webp -quality 70 *.png
rm ./*.png
