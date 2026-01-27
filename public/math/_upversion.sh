#!/bin/bash
ran=$(echo "${RANDOM}")
sed -i "s/?v=[0-9]\+/?v=${ran}/" index.html
