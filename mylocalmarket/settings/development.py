from mylocalmarket.settings.common import *

DEBUG = True
ALLOWED_HOSTS = []

# Post-login page
LOGIN_REDIRECT_URL = '/'

# Static and media directories
STATIC_URL = '/static/'
MEDIA_URL = '/media/mylocalmarket/'
MEDIA_ROOT = '/var/www/media/mylocalmarket/'

# Email test setup
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
