#!/bin/bash

cd reactpage
npm run dev &
cd ../flaskserver
python3 app.py &
wait
