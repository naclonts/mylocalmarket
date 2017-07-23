from django.conf.urls import url, include
from . import views

urlpatterns = [
    url(r'^market/(?P<market_id>\d+)$', views.market_detail, name='detail'),
    url(r'^zip/(?P<zip>\d+)$', views.markets_within_zip, name='markets_within_zip'),
    url(r'^', views.index, name='home'),
]
