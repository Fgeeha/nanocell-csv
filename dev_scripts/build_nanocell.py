import re
import os
import shutil
from pathlib import Path

def get_file_lines (fpath):
    with open(fpath, 'r') as file:
        lines = file.readlines()
    return  [line.strip() for line in lines]

def mk_dir(path):
    dest_dir = os.path.dirname(path)
    if not os.path.exists(dest_dir):
        os.makedirs(dest_dir)

def get_all_file_paths_from(directory):
    file_paths = []
    for root, _, files in os.walk(directory):
        for file in files:
            file_paths.append(os.path.join(root, file))
    return file_paths

def clean_js_rows(input_file):
    with open(input_file, 'r', encoding='utf-8') as file:
        lines = file.readlines()
    cleaned_lines = []
    for line in lines:
        line  = line.strip() 
        if len(line) >0 and not (line[0]=="/" and line[1]=="/") :
            cleaned_lines.append(line+"\n")
    return cleaned_lines

def clean_js_file(input_file, output_file):
     with open(output_file, 'w', encoding='utf-8') as file:
        file.writelines(clean_js_rows(input_file))

def clean_html_file(input_file, output_file):
    with open(input_file, 'r', encoding='utf-8') as file:
        lines = file.readlines()
    cleaned_lines = []
    for line in lines:
        line = re.sub(r'<!--.*?-->', '', line)
        if line.strip():
            cleaned_lines.append(line)
    mk_dir(output_file)
    with open(output_file, 'w', encoding='utf-8') as file:
        file.writelines(cleaned_lines)

def concat_js_files(dir, output_file):
    path_list = get_all_file_paths_from(dir)
    clean_code = [clean_js_rows(path) for path  in path_list]
    clean_code = [line for sublist in clean_code for line in sublist]
    with open(output_file, 'w', encoding='utf-8') as file:
        file.writelines(clean_code)

def fcp(src_path, dest_path):
    dest_dir = os.path.dirname(dest_path)
    os.makedirs(dest_dir, exist_ok=True)
    shutil.copy2(src_path, dest_path)

def copy_web_to_public():
    path_list = get_all_file_paths_from("web")
    for file_path in path_list:
        path = Path(file_path)
        new_path = Path( Path("public") / path.relative_to("web") )
        extension = path.suffix
        print(new_path)
        if(extension==".html"):
            clean_html_file(file_path , new_path)
        else:
            fcp(file_path, new_path)

def fcp_dir(src, src_rm , dst):
    path_list = get_all_file_paths_from(src)
    for file_path in path_list:
        path = Path(file_path)
        new_path = Path( Path(dst) / path.relative_to(src_rm) )
        fcp(file_path, new_path)

def frm(dir_path):
    try:
        shutil.rmtree(dir_path)
    except Exception as e:
        print(f"Error: {e}")
    
def update_sw_pwa_admin():
    sw_path = "./public/app/sw_pwa_admin.js"
    sw_text = get_file_lines(sw_path)
    while(len(sw_text[2]) ==0 or sw_text[2][0] != ']') :
        del sw_text[2]
    files_to_cache = get_all_file_paths_from("./public/app")
    for fpath in files_to_cache : 
        sw_text.insert(2, f"\"{fpath[13:].replace('\\', '/')}\",")
    with open(sw_path, 'w') as file:
        file.write("\n".join(sw_text))


frm("public")
copy_web_to_public()
mk_dir("./public/app/")
concat_js_files("app/js", "public/app/nc_script.js")
fcp_dir("app/css","", "public" )
fcp_dir("app/icn","", "public" )
fcp_dir("app/logo","", "public" )
clean_html_file("app/home.html" , "./public/app/home.html")
clean_js_file("app/sw_read_write_csv.js" , "./public/app/sw_read_write_csv.js")
clean_js_file("app/sw_pwa_admin.js" , "./public/app/sw_pwa_admin.js")
update_sw_pwa_admin()



# def increment_version(txt):
#     match = re.search(r"(\d+)\.(\d+)\.(\d+)", txt)
#     major, minor, patch = map(int, match.groups())
#     patch += 1
#     new_version = f"{major}.{minor}.{patch}"
#     updated_txt = re.sub(r"(\d+\.\d+\.\d+)", new_version, txt)
#     return updated_txt



