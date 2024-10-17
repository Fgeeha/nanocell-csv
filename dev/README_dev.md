# DEV HOW TO

In a shell cd to the root of the dir and run :
```
python -m http.server 8000
```



To update the version and the list of files to cache in the service worker : 
```
python  ./dev/build_nc.py
```




OPening a new window once will fetch the update but won't apply it.

A second window has to be opened for the changes to take effect (a reload of the first would work as well).
