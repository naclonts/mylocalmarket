"""
Loads production settings, rather than the default development settings.

Can be used by a WSGI daemon, which avoids the need to set a system global DJANGO_SETTINGS_MODULE variable.

See this very helpful Gist for more detail:
    https://gist.github.com/GrahamDumpleton/b380652b768e81a7f60c
"""

# Production WSGI file
import os

os.environ['DJANGO_SETTINGS_MODULE'] = 'mylocalmarket.settings.production'

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
