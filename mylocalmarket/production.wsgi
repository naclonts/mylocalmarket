# Production WSGI file
# Based on this very helpful Gist:
#     https://gist.github.com/GrahamDumpleton/b380652b768e81a7f60c
import os

os.environ['DJANGO_SETTINGS_MODULE'] = 'mylocalmarket.settings.production'

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
