#!/bin/bash

xmls=$(java extract < questiondata.csv > temp.txt)
IFS=$'\n'
for line in $xmls
do
	echo $line
	sed 's/&quot/"/g' <<< $line > data.xml;
  matlab -r "generateMat.m";
done

\rm temp.txt
