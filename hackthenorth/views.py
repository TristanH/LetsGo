import json
from random import randint

from django.views.generic.base import TemplateView
from django.http import HttpResponse

from . import yelp_access
from models import BusinessEntity, MapSession

class HomeView(TemplateView):
    template_name = 'hackthenorth/home.html'

class SessionView(TemplateView):
    template_name = 'hackthenorth/home.html'
    def get(self, request, slug):
        return HttpResponse('result')

def vote_for(request, slug):
    map_session = MapSession.objects.get(slug=slug)
    business = BusinessEntity.objects.get(
        session=map_session,
        yelp_id=request.GET['yelp_id'],
    )
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
        result.append(yelp_access.get_business(business.yelp_id))

    js_info = json.dumps(result)

    return HttpResponse(js_info, content_type='application/json')

def get_business_info(request):
    result = yelp_access.query_api(
        request.GET['term'],
        request.GET['ll'],
        request.GET['offset']
    )

    for business in result['businesses']:
        if randint(1,5) == 5:
            business['numvotes'] = randint(1,10)

    js_info = json.dumps(result)

    return HttpResponse(js_info, content_type='application/json')

