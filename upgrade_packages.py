import subprocess

# Read the requirements.txt file
with open('requirements.txt') as f:
    packages = f.readlines()

# Iterate over each package and upgrade it
for package in packages:
    package_name = package.split('==')[0]
    subprocess.run(['pip', 'install', '--upgrade', package_name])
