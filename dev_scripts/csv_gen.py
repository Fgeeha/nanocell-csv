import random

FILE_NAME = "test_file"
MB_SIZE = 2 
SEPARATOR = ","

CHUNK_ROW_SIZE = 1000 * 10

def file_data (fpath):
    with open(fpath, 'r') as file:
        lines = file.readlines()
    return [line.strip() for line in lines]

countries = file_data("dev_scripts/list/country.txt")
names = file_data("dev_scripts/list/name.txt")
companies = file_data("dev_scripts/list/company.txt")

def rd_int(n, m):
    return f"{random.randint(n, m)}"

def rd_double(n, m):
    rand_num = random.uniform(n, m)
    return  "{:.2f}".format(rand_num)

def rd_from_list_of(list):
    return random.choice(list) 


def rd_phone_number():
    r = "0"
    for i in range (0, 8):
        r += f"{random.randint(0, 9)}"
    return r

def build_row():
    name = rd_from_list_of(names)
    age = rd_int(18, 70)
    country = rd_from_list_of(countries)
    company = rd_from_list_of(companies)
    salary = rd_double(800, 20000)
    balance = rd_double(-10000, +10000)
    phone = rd_phone_number()
    row = [name, age , country, company, salary, balance, phone]
    return SEPARATOR.join(row) + '\n'

HEADER_ROW = "name, age , country, company, salary, balance, phone\n"

def build_chunk() :
    chunk = []
    for i in range( 0 , CHUNK_ROW_SIZE):
        chunk.append(build_row())
    return ''.join(chunk)


def build_csv(file_name, size_in_mb):
    max_size = size_in_mb*1000*1000
    with open(file_name, 'w') as f:
        f.write(HEADER_ROW)
        total_bytes_written = 0
        total_rows_written = 0
        while total_bytes_written < max_size:
            chunk = build_chunk()  # Call the build_row() function to get the next row
            chunk_bytes = len(chunk)  # Calculate the size of the row in bytes
            f.write(chunk)
            total_bytes_written += chunk_bytes
            total_rows_written += CHUNK_ROW_SIZE
            print("{:.2f}%  rows: {}  megabytes:{} ".format(total_bytes_written / max_size, total_rows_written, total_bytes_written/1000000) )




out_fname = f"dev_scripts/csv_files/{FILE_NAME}_{MB_SIZE}mb.csv"

build_csv(out_fname, MB_SIZE )

print (out_fname, " >> write success")