# -*- mode: python ; coding: utf-8 -*-

block_cipher = None

a = Analysis(
    ['manage.py'],
    pathex=['C:/Users/pc/Downloads/KENO-django-and-flutter'],
    binaries=[],
    datas=[
        ('manage.py', '.'),
        ('game/', 'game'),    # Include game directory
        ('static/img/', 'static/img'),
        ('static/', 'static'),
        ('static/img/icon.ico', 'static/img'),
        ('static/img/logo.jpg', 'static/img')],
    hiddenimports=[],
    hookspath=['hook-django-settings.py'],
    runtime_hooks=[],
    excludes=['numpy', 'celery', 'django_celery_beat', 'django_celery_results', 'win32event', 'win32api', 'atexit', 'winerror'],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=True,
)


pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.datas,
    [],
    exclude_binaries=True,
    name='run_game',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=True,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    icon='static/img/icon.ico',
)

coll = COLLECT(
    exe,
    a.binaries,
    a.zipfiles,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name='run_game',
)

app = BUNDLE(
    coll,
    name='run_game',
    bundle_identifier=None
)