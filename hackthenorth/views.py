import json
import re

from random import randint

from django.views.generic.base import TemplateView
from django.http import HttpResponse, HttpResponseBadRequest
from django import forms
from django.core import validators


from . import yelp_access
from models import BusinessEntity, MapSession

class HomeView(TemplateView):
    template_name = 'hackthenorth/home.html'

class SessionView(TemplateView):
    template_name = 'hackthenorth/home.html'

    def get(self, request, slug, *args, **kwargs):
        session = MapSession.objects.get(slug=slug)
        self.location = session.starting_location
        self.description = session.description
        return super(SessionView, self).get(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super(SessionView, self).get_context_data(**kwargs)
        context['location'] = self.location
        context['description'] = self.description

        return context

def generate_session(request):
    slug = request.GET['slug']
    description = request.GET['description']
    starting_location = request.GET['location']

    if not re.match("^[A-Za-z0-9_-]*$", slug) or len(slug)>100:
        return HttpResponseBadRequest("Invalid code name!")
    if len(description) > 1000:
        return HttpResponseBadRequest("Invalid description!")

    checkSlug = MapSession.objects.filter(slug=slug)
    postNum = 0

    while(len(checkSlug)>0):
        slug = request.GET['slug'] + "" + str(postNum)
        postNum+=1
        checkSlug = MapSession.objects.filter(slug=slug)


    session = MapSession(slug=slug,description=description,starting_location=starting_location)
    session.save()
    return HttpResponse(session.slug)

def vote_for(request, slug):
    map_session = MapSession.objects.get(slug=slug)
    business = BusinessEntity.objects.filter(
        session=map_session,
        yelp_id=request.GET['yelp_id'],
    )

    if(len(business) == 0):
        business = BusinessEntity(votes=0, yelp_id=request.GET['yelp_id'], session=map_session)
    else:
        business = business[0]

    if('downvote' in request.GET):
        business.votes-=1
    else:
        business.votes+=1

    business.save()

    return HttpResponse("success")


def get_voted_businesses(request, slug):
    map_session = MapSession.objects.get(slug=slug)
    businesses = BusinessEntity.objects.filter(session=map_session)   
    result = []

    for business in businesses:
        res_at = yelp_access.get_business(business.yelp_id)
        if not res_at:
            continue
        result.append(res_at)
        result[-1]['numvotes'] = business.votes

    js_info = json.dumps(result)

    return HttpResponse(js_info, content_type='application/json')

def get_business_info(request):
    result = yelp_access.query_api(
        request.GET['term'],
        request.GET['ll'],
        request.GET['offset']
    )

    js_info = json.dumps(result)

    return HttpResponse(js_info, content_type='application/json')

