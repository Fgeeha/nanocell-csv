import re

def get_file_lines (fpath):
    with open(fpath, 'r') as file:
        lines = file.readlines()
    return  [line.strip() for line in lines]

def increment_version(txt):
    match = re.search(r"(\d+)\.(\d+)\.(\d+)", txt)
    major, minor, patch = map(int, match.groups())
    patch += 1
    new_version = f"{major}.{minor}.{patch}"
    updated_txt = re.sub(r"(\d+\.\d+\.\d+)", new_version, txt)
    print( "updating to : ", updated_txt.split('=')[1]) 
    return updated_txt


path = "app/sw_pwa_admin.js"

lines = get_file_lines (path)
lines[0] = increment_version(lines[0])

with open(path, 'w', encoding='utf-8') as file:
        file.write("\n".join(lines))





