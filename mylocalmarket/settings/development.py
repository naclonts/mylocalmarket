from mylocalmarket.settings.common import *

DEBUG = True
ALLOWED_HOSTS = []

# Post-login page
LOGIN_REDIRECT_URL = '/'
STATIC_URL = '/static/'

# Email test setup
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
