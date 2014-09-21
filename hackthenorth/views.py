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

    def get(self, request, slug, *args, **kwargs):
        self.slug = slug
        return super(SessionView, self).get(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super(SessionView, self).get_context_data(**kwargs)
        return context

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
        result.append(yelp_access.get_business(business.yelp_id))
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

