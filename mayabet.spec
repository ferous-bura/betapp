# -*- mode: python ; coding: utf-8 -*-
hiddenimports = [
    'django_celery_results.backends',
    'rest_framework.schemas',
    'zuser.context_processors',
    'paymentapp.context_processors',
    'cashierapp.templatetags',
    'django.contrib.staticfiles.templatetags',
    'django.contrib.admin.context_processors',
    'django.contrib.sites.templatetags',
    'django.contrib.sites.context_processors',
    'keno.templatetags',
    'django.contrib.messages.templatetags',
    'django.contrib.contenttypes.context_processors',
    'mobile.context_processors',
    'apigame.templatetags',
    'rest_framework.context_processors',
    'apigame.context_processors',
    'django_celery_beat.templatetags',
    'django_celery_beat.context_processors',
    'keno.context_processors',
    'dashboard.templatetags',
    'django.contrib.staticfiles.context_processors',
    'django_celery_results.templatetags',
    'django.contrib.auth.templatetags',
    'dashboard.context_processors',
    'zuser.templatetags',
    'mobile.templatetags',
    'django.contrib.contenttypes.templatetags',
    'cashierapp.context_processors',
    'django.contrib.sessions.context_processors',
    'django.contrib.sessions.templatetags',
    'paymentapp.templatetags',
    'django.db.backends.oracle.compiler',
    'mx.DateTime',
    'numpy.array_api'
]


block_cipher = None

a = Analysis(
    ['mayabet3.py'],
    pathex=['C:/Users/pc/Downloads/KENO-django-and-flutter'],
    binaries=[],
    datas=[
        ('static/img/', 'static/img'),
        ('static/', 'static'),
        ('static/img/icon.ico', 'static/img'),
        ('static/img/logo.jpg', 'static/img')],
    hiddenimports=hiddenimports,
    hookspath=['hook-django-settings.py'],
    runtime_hooks=[],
    excludes=['numpy'],
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
    name='mayabet',
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
    name='mayabet',
)

app = BUNDLE(
    coll,
    name='mayabet',
    bundle_identifier=None
)