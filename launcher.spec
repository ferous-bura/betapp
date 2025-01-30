# -*- mode: python ; coding: utf-8 -*-

block_cipher = None

a = Analysis(
    ['launcher_spin.py'],
    pathex=['C:/Users/pc/Downloads/KENO-django-and-flutter'],
    binaries=[],
    datas=[
        ('static/img/', 'static/img'),
        ('static/', 'static'),
        ('static/img/icon.ico', 'static/img'),
        ('static/img/logo.jpg', 'static/img')
    ],
    hiddenimports=[],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=['numpy', 'django', 'celery', 'django_celery_beat', 'django_celery_results'],
    noarchive=False,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.datas,
    [],
    exclude_binaries=True,
    name='spin_launcher',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=False,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    icon='static/img/icon.ico'
)

coll = COLLECT(
    exe,
    a.binaries,
    a.zipfiles,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name='spin_launcher',
)

app = BUNDLE(
    coll,
    name='spin_launcher',
    bundle_identifier=None
)
