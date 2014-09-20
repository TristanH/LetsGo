import json

from django.views.generic.base import TemplateView
from django.http import HttpResponse

from . import yelp_access

class HomeView(TemplateView):
    template_name = 'hackthenorth/home.html'

def get_business_info(request):
    businesses = yelp_access.query_api(
        request.GET['term'],
        request.GET['ll'],
        request.GET['offset']
    )
    js_info = json.dumps(businesses)

    return HttpResponse(js_info, content_type='application/json')

