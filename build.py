import re
import os
import shutil
from pathlib import Path
import markdown

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

def md_to_html(md_file_path, html_file_path):

    try:
        with open(md_file_path, 'r', encoding='utf-8') as md_file:
            md_content = md_file.read()

        html_body = markdown.markdown(md_content)
        
        # Add basic styling
        html_content = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <title>Nanocell-csv | Terms of use & Licence</title>
    <style>
        body {{
            text-align:justify;
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 20px;
            padding: 0;
            max-width:50em;
            
        }}
  
    </style>
</head>
<body>
 <a  href="./"><button> return to homepage</button></a>
<br>
{html_body}
<br>
 <a  href="./"><button> return to homepage</button></a>


</body>
</html>"""
        

        with open(html_file_path, 'w', encoding='utf-8') as html_file:
            html_file.write(html_content)
    except FileNotFoundError:
        print(f"Error: The file '{md_file_path}' was not found.")
    except Exception as e:
        print(f"An error occurred: {e}")


def add_seo_pages():
  name_list=[
    ("CSV file Data Import Tool", "Nanocell-csv is your reliable CSV file data import tool, designed to seamlessly handle data integrity and accuracy when importing large or small datasets. With built-in data validation and offline functionality, it ensures your CSV data remains untouched, whether it's for quick inspection or preparation for database import. Experience hassle-free data management with Nanocell-csv’s commitment to clean and accurate CSV handling."), 
    ("CSV file Database Preview Tool","When preparing data for database import, Nanocell-csv acts as the ultimate CSV file database preview tool. Instantly visualize your data, identify inconsistencies, and validate headers and encoding to ensure smooth database integration. With no surprises, you can quickly clean up any issues and proceed with your data workflow without interruptions."),
    ("CSV file Data Visualization Tool","Nanocell-csv isn't just about editing—it's also a powerful CSV file data visualization tool. Whether you're dealing with complex datasets or simple tables, this tool provides an instant overview without parsing the entire file. You can quickly identify patterns, detect errors, and prepare data for further analysis, all while ensuring accuracy and integrity."),
    ("CSV file Data Exploration Tool","For data professionals looking to explore their CSV files before diving into heavier analysis tools, Nanocell-csv is the perfect data exploration tool. With its ability to instantly display file previews and sample data, it enables you to quickly assess large datasets, understand the structure, and get to work with confidence—all while maintaining complete data accuracy."),
    ("CSV file Viewer and Editor for Windows","Nanocell-csv brings you a fast, lightweight CSV file viewer and editor designed for Windows users. With a user-friendly interface, you can instantly view and edit CSV files of any size without worrying about unwanted type conversions. Whether you’re cleaning up data or making quick edits, Nanocell-csv delivers a seamless experience on your Windows machine."),
    ("Progressive Web Application CSV file Editor","Nanocell-csv is a Progressive Web Application (PWA) CSV file editor that works offline and across all platforms. Say goodbye to installing heavy software or worrying about data security—Nanocell-csv keeps your files safe and accurate, offering an intuitive editing experience from any device with just a browser."),
    ("PWA CSV file Viewer and Editor","As a PWA CSV file viewer and editor, Nanocell-csv offers an incredibly fast and simple solution for CSV file management. No need for installations or system-specific software—access it through any modern browser and start viewing and editing your CSV files instantly, with the guarantee that your data remains accurate and private."),
    ("Simple CSV file Viewer and Editor","Nanocell-csv is the simplest CSV file viewer and editor you’ll ever need. Whether you're dealing with a massive dataset or just making minor tweaks, this tool is designed for quick and efficient CSV file management. With no complex setup or unnecessary features, Nanocell-csv is all about getting the job done with speed and precision."),
    ("Data Accurate CSV file Viewer and Editor","When data accuracy is crucial, Nanocell-csv is the go-to CSV file viewer and editor. With its focus on preserving data integrity, this tool ensures that all values, including leading zeros and special characters, remain intact. Whether you're editing contact details or zip codes, Nanocell-csv guarantees no unwanted data alterations."),
    ("Fast CSV file Viewer and Editor","Speed is key when working with large datasets, and Nanocell-csv is the fastest CSV file viewer and editor available. With instant file previews and quick data validation, you can efficiently explore, edit, and visualize CSV files without waiting for long load times. No matter the file size, Nanocell-csv handles it with ease."),
    ("Lightweight CSV file Viewer and Editor","Nanocell-csv is a lightweight CSV file viewer and editor that doesn’t weigh down your system. With a minimalistic design and no installation required, you can view and edit your CSV files quickly and efficiently. Whether on Windows, Mac, or Linux, Nanocell-csv ensures that your CSV file management is always smooth and fast."),
    ("Open source CSV file Viewer and Editor","Nanocell-csv is an open-source CSV file viewer and editor that gives you full control over your data management process. Built by and for data experts, it ensures complete transparency, and you can even contribute to its development. Enjoy the benefits of an open-source tool while ensuring data integrity and security with every use."),
    ("Free CSV file Viewer and Editor","Nanocell-csv is a free CSV file viewer and editor that provides powerful features without the price tag. Whether you need to inspect, edit, or validate CSV data, this tool gives you everything you need without the hassle of paid subscriptions. Keep your data safe, accurate, and accessible with this free solution."),
  ]

  flines = get_file_lines("public/index.html")
  index_content = "\n".join(flines)
  index_content =  re.sub(r'<p id="about_p">.*?</p>', '###', index_content, flags=re.DOTALL)


  for name, desc in name_list : 

     content = index_content.replace("CSV file Viewer & Editor", name)
     content = content.replace("<h1>CSV Viewer & Editor</h1>", f"<h1>{name}</h1>") 
     content = content.replace("###", f"<p>{desc}</p>") 
     fname = name.lower().replace(" ", "-")
     print ("building : ", fname)
     with open(f"public/{fname}.html", 'w') as file:
        file.write(content)


def build_sitemap(local = False):
    folder_path = "./public"
    base_url = "https://www.nanocell-csv.com/"
    if local : 
      base_url = "http://localhost:8000/"
    # Collect all .html files in the folder and subfolders
    file_paths = []
    for root, _, files in os.walk(folder_path):
        for file in files:
            if file.endswith(".html"):
                # Get the relative path
                rel_path = os.path.relpath(os.path.join(root, file), folder_path)
                file_paths.append(rel_path.replace("\\", "/"))  # Replace backslashes for URLs

    # Build the sitemap XML
    sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n'
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    for file_path in file_paths:
        url = base_url +  file_path
        priority = 0.7
        if (file_path == "index.html"  ) :
          priority = 1.0
        sitemap += f"  <url>\n    <loc>{url}</loc>\n    <priority>{priority}</priority>\n  </url>\n"
    sitemap += '</urlset>'
    with open(f"public/sitemap.xml", 'w') as file:
        file.write(sitemap)




frm("public")
copy_web_to_public()
mk_dir("./public/app/")
md_to_html("TERMS_OF_USE.md", "./public/terms_of_use_and_license.html" )
concat_js_files("app/js", "public/app/nc_script.js")
fcp_dir("app/css","", "public" )
fcp_dir("app/icn","", "public" )
fcp_dir("app/logo","", "public" )
clean_html_file("app/home.html" , "./public/app/home.html")
clean_js_file("app/sw_read_write_csv.js" , "./public/app/sw_read_write_csv.js")
clean_js_file("app/sw_pwa_admin.js" , "./public/app/sw_pwa_admin.js")
update_sw_pwa_admin()
add_seo_pages()
build_sitemap(local=False)




