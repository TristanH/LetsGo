from django.conf.urls import patterns, include, url
from django.contrib import admin
from . import views

urlpatterns = patterns('',
    url(r'^$', views.HomeView.as_view(), name='home'),
    url(r'^admin/?', include(admin.site.urls)),
    url(r'^get_info/$', views.get_business_info, name='get_business_info'),
    url(r'^(?P<slug>\w+)/get_voted/$', views.get_voted_businesses, name='get_voted_businesses'),
    url(r'^(?P<slug>\w+)/vote_for/$', views.vote_for, name='vote_for'),
    url(r'^(?P<slug>\w+)/?$', views.SessionView.as_view(), name='session'),

)
