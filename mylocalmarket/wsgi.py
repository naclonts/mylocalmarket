"""
WSGI config for mylocalmarket project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/1.11/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault("MYLOCALMARKET_DJANGO_SETTINGS_MODULE", "mylocalmarket.settings.development")

application = get_wsgi_application()
