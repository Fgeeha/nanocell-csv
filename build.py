import re
import os
import shutil
from pathlib import Path
import markdown
from datetime import datetime
import requests


def get_file_lines (fpath):
    with open(fpath, 'r', encoding='utf8') as file:
        lines = file.readlines()
    return  [line.strip() for line in lines]

def mk_dir(path):
    dest_dir = os.path.dirname(path)
    if not os.path.exists(dest_dir):
        os.makedirs(dest_dir)

def ls_dir(directory):
    file_paths = []
    for root, _, files in os.walk(directory):
        for file in files:
            file_paths.append(os.path.join(root, file))
    return file_paths

def fcp(src_path, dest_path):
    dest_dir = os.path.dirname(dest_path)
    os.makedirs(dest_dir, exist_ok=True)
    shutil.copy2(src_path, dest_path)

def fcp_dir(src, src_rm , dst):
    path_list = ls_dir(src)
    for file_path in path_list:
        path = Path(file_path)
        new_path = Path( Path(dst) / path.relative_to(src_rm) )
        fcp(file_path, new_path)

def frm(dir_path):
    try:
        shutil.rmtree(dir_path)
    except Exception as e:
        print(f"Error: {e}")

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


def concat_js_files(dir, output_file):
    path_list = ls_dir(dir)
    clean_code = [clean_js_rows(path) for path  in path_list]
    clean_code = [line for sublist in clean_code for line in sublist]
    with open(output_file, 'w', encoding='utf-8') as file:
        file.writelines(clean_code)


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


def copy_web_to_public():
    path_list = ls_dir("web")
    for file_path in path_list:
        path = Path(file_path)
        new_path = Path( Path("public") / path.relative_to("web") )
        extension = path.suffix
        print(new_path)
        if(extension==".html"):
            clean_html_file(file_path , new_path)
        else:
            fcp(file_path, new_path)

def update_sw_pwa_admin():
    sw_path = "./public/app/sw_pwa_admin.js"
    sw_text = get_file_lines(sw_path)
    while(len(sw_text[2]) ==0 or sw_text[2][0] != ']') :
        del sw_text[2]
    files_to_cache = ls_dir("./public/app")
    for fpath in files_to_cache : 
        sw_text.insert(2, f"\"{fpath[13:].replace('\\', '/')}\",")
    with open(sw_path, 'w') as file:
        file.write("\n".join(sw_text))


def add_seo_pages():
  name_list=[]
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



def article_get_title(md_lines):
  for line in md_lines:
    if line.startswith("#"):
       return line.replace("#", "").strip()
  return None

def article_get_author(md_lines):
  for line in md_lines:
    if line.startswith("- author:"):
       return line.replace("- author:", "").strip()
  return None

def article_get_last_modified_date(file_path):
    timestamp = os.path.getmtime(file_path)
    modified_date = datetime.fromtimestamp(timestamp)
    return modified_date.strftime('%Y-%m-%d')

def article_get_first_url(md_lines):
    url_pattern = re.compile(r'https?://[^)\s ]+')
    for line in md_lines:
        match = url_pattern.search(line)
        if match:
            return match.group() .strip() 
    return None

def is_image_url(url):
    image_extensions = ('.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.tiff', '.svg')
    return url.lower().endswith(image_extensions)

def article_get_og_img(url):
    try:
        response = requests.get(url)
        response.raise_for_status()  
        html = response.text
        og_img_pattern = re.compile(r'<meta\s+property="og:image"\s+content="([^"]*)"', re.IGNORECASE)
        match = og_img_pattern.search(html)
        if match:
            return match.group(1)  # Return the content of the og:image tag
        else:
            return None  # Return None if og:image is not found
    except requests.RequestException as e:
        print(f"Error fetching the URL: {e}")
        return None
    except Exception as e:
        print(f"An error occurred: {e}")
        return None

def article_get_img_banner_tag(md_lines):
  img_url =  article_get_first_url(md_lines)
  tag_img_og = ""
  tag_img_banner = ""
  if (img_url is not None and not is_image_url(img_url) ):
    img_url = article_get_og_img(img_url)
  if (img_url is not None):
    tag_img_og = f'<meta property="og:image" content="{img_url}" />'
    tag_img_banner = f'<img id="banner" src="{img_url}" alt="article banner image" />'
  return  (tag_img_banner, tag_img_og)

def article_get_first_paragraph(html):
    match = re.search(r'<p>(.*?)</p>', html, re.DOTALL)
    p = match.group(1).strip() if match else None
    return  p

def md_to_html(md_file_path, html_file_path):
  pub_date = article_get_last_modified_date(md_file_path)
  md_file_lines = get_file_lines(md_file_path)
  title = article_get_title(md_file_lines)
  tag_img_banner, tag_img_og = article_get_img_banner_tag(md_file_lines)
  html_body = markdown.markdown(  "\n\n".join(md_file_lines),extensions=["fenced_code"])
  style =  "\n".join(get_file_lines("./misc/article.css"))
  style = f"<style>{style}</style>"
  first_p = article_get_first_paragraph(html_body) 
  article_metadata = f'<div id="article_metadata"><date>{pub_date}</date> by Cedric Bonjour  </div>'

  print(  len(first_p) , " >>> " , first_p, "\n")

  if ("article" not in md_file_path):
    tag_img_banner = ""
    article_metadata =""


  html_content = get_file_lines ("./misc/template.html")
  html_content = "\n".join(html_content)
  html_content = html_content.replace("{title}", title)
  html_content = html_content.replace("{article_metadata}", article_metadata)
  html_content = html_content.replace("{tag_img_og}", tag_img_og)
  html_content = html_content.replace("{tag_img_banner}", tag_img_banner)
  html_content = html_content.replace("{html_body}", html_body)
  html_content = html_content.replace("{style}", style)

  with open(html_file_path, 'w', encoding='utf-8') as html_file:
      html_file.write(html_content)


def build_articles():
  print("building articles")
  mk_dir("./public/article/")
  md_files = ls_dir("./article")
  for file_path in md_files:
    print(file_path)
    basename = os.path.basename(file_path).split(".")[0]
    md_to_html(file_path, f"./public/article/{basename}.html" )



def build_sitemap():
    folder_path = "./public"
    base_url = "https://www.nanocell-csv.com/"
    file_paths = []
    for root, _, files in os.walk(folder_path):
        for file in files:
            if file.endswith(".html"):
                rel_path = os.path.relpath(os.path.join(root, file), folder_path)
                file_paths.append(rel_path.replace("\\", "/"))  # Replace backslashes for URLs
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
build_articles()
build_sitemap()




