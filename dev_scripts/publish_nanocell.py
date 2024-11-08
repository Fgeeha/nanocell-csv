import re
import os
sw_path = "./app/sw_pwa_admin.js"
cached_dir = "./app/"


def file_data (fpath):
    with open(fpath, 'r') as file:
        lines = file.readlines()
    return [line.strip() for line in lines]


def increment_version(txt):
    match = re.search(r"(\d+)\.(\d+)\.(\d+)", txt)
    major, minor, patch = map(int, match.groups())
    patch += 1
    new_version = f"{major}.{minor}.{patch}"
    updated_txt = re.sub(r"(\d+\.\d+\.\d+)", new_version, txt)
    return updated_txt


def get_all_file_paths(directory):
    file_paths = []
    for root, _, files in os.walk(directory):
        for file in files:
            file_paths.append(os.path.join(root, file))
    
    return file_paths


sw_text = file_data(sw_path)

sw_text[0] = increment_version (sw_text[0])


while(len(sw_text[2]) ==0 or sw_text[2][0] != ']') :
    del sw_text[2]


files = get_all_file_paths(cached_dir)

for fpath in files : 
    sw_text.insert(2, f"\"{fpath[6:].replace('\\', '/')}\",")




with open(sw_path, 'w') as file:
    file.write("\n".join(sw_text))


print(f"succesfully updated : {sw_text[0]}")


