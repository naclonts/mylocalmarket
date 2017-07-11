from django.conf.urls import url, include
from . import views

urlpatterns = [
    url(r'^market/(?P<market_id>\d+)$', views.market_detail, name='market_detail'),
    url(r'^', views.index, name='index'),
]
