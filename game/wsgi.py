import os
import sys

# project_home = '/home/mayabet2/betapp'
# if project_home not in sys.path:
#     sys.path.append(project_home)

# activate_this = '/home/mayabet2/.virtualenvs/betapp/bin/activate_this.py'
# with open(activate_this) as file_:
#     exec(file_.read(), dict(__file__=activate_this))

os.environ['DJANGO_SETTINGS_MODULE'] = 'game.settings'

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
