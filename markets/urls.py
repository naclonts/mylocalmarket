from django.conf.urls import url, include
from . import views

urlpatterns = [
    url(r'^signup/$', views.signup, name='signup'),
    url(r'^market/(?P<market_id>\d+)$', views.market_detail, name='detail'),
    url(r'^zip/(?P<zip>\d+)$', views.markets_within_zip, name='markets_within_zip'),
    url(r'^favorite/(?P<market_id>\d+)$', views.toggle_favorite, name='toggle_favorite'),
    url(r'^myfavorites/$', views.favorites_list, name='favorites_list'),
    url(r'^search/(?P<zip>\d+)$', views.search_page, name='search_page'),
    url(r'^search/$', views.search_page, name='search_page'),
    url(r'^$', views.landing_page, name='landing_page'),
]
