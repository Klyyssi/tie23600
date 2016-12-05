@echo off
setlocal
set "PATH=%~dp0node;%PATH%"
node %~dp0/node/node_modules/npm/bin/npm-cli.js %*
@echo on