import json
from random import randint

from django.views.generic.base import TemplateView
from django.http import HttpResponse

from . import yelp_access

class HomeView(TemplateView):
    template_name = 'hackthenorth/home.html'

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

