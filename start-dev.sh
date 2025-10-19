#!/bin/bash

echo "🚀 Starting SSN News Development Environment..."
cd /home/sigma/Gajjar/.SSN/SSNNEWS/SSNNEWS/client && npm run build
cd /home/sigma/Gajjar/.SSN/SSNNEWS/SSNNEWS/server && npm start