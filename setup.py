from cx_Freeze import setup, Executable
import os, sys

# Define the base directory of your project
base_dir = os.path.dirname(os.path.abspath(__file__))

executables = [
    Executable('run_all.py', base=None)
]
project_files = [
    os.path.join(base_dir, 'game'),  # Replace 'game' with your Django app name
    os.path.join(base_dir, 'static'),
    os.path.join(base_dir, 'staticfiles'),
    os.path.join(base_dir, 'keno'),  # Include media if used
    os.path.join(base_dir, 'cashierapp'),  # Include media if used
    os.path.join(base_dir, 'mobile'),  # Include media if used
    os.path.join(base_dir, 'zuser'),  # Include media if used
    os.path.join(base_dir, 'dashboard'),  # Include media if used
    os.path.join(base_dir, 'manage.py'),
    os.path.join(base_dir, 'spin'),
    os.path.join(base_dir, 'game_utils'),
    os.path.join(base_dir, 'paymentapp'),
    os.path.join(base_dir, 'auto.py'),
    os.path.join(base_dir, 'auto_mobile.py'),
    os.path.join(base_dir, 'requirements.txt'),  # If you want to include the requirements file

    # Add any other directories or files you need
]

build_exe_options = {
    'packages': [
        'os', 'sys', 'django', 'celery', 'requests',
        'django_celery_beat', 'django_celery_results', 'kombu',
    ],
    'excludes': [],
    'include_files': project_files,
    "excludes": ['numpy', 'dist', 'build', '.git', '.idea', '.vscode', '__pycache__', 'maya-computer', 'myenv'],  # Add any packages or modules to exclude
    "optimize": 2,  # Optimize the bytecode
    "include_msvcr": True,  # Include the MSVC runtime DLLs
}

base = None
if sys.platform == "win32":
    base = None  # Use "Win32GUI" for GUI applications, None for console applications

executables = [Executable("run_all.py", base=base)]

setup(
    name="keno_win_game",
    version="1.0",
    description="Keno app made for the window",
    options={"build_exe": build_exe_options},
    executables=executables,
)
