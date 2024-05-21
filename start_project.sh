#!/bin/bash

cd reactpage
npm run preview &
cd ../flaskserver
python3 app.py &
wait
