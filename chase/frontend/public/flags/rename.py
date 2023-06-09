import os

# Rename all flag svg files from alpha2 to alpha3 code

# get all files in the current directory
files = os.listdir('web/standings/flags/')

for f in files:

    if f.endswith('.svg'):
        alpha2 = f[:2].upper()

        # Rename the file according to the alpha.csv file
        with open('alpha.csv') as alpha:
            for line in alpha:
                alpha2_csv = line.split(',')[1]
                alpha3 = line.split(',')[2].lower()
                if alpha2 == alpha2_csv:
                    os.rename(f'web/standings/flags/{f}', f'web/standings/flags/{alpha3}.svg')
                    print(f'{f} -> {alpha3}.svg')
                    break
            else:
                print("Error: Couldn't find alpha3 code for", alpha2)