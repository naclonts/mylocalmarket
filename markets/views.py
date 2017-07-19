from django.forms.models import model_to_dict
from django.shortcuts import render, get_object_or_404
from django.views.generic.base import TemplateView

from . import api
from .models import Market

def index(request):
    """
    index
    """
    return render(
        request,
        'index.html',
        context={'hello_message': 'hello, world!'}
    )


class MarketDetailView(TemplateView):
    """
    Currently not used.
    """
    model = Market
    template_name = 'markets/detail.html'
    context_object_name = 'market_detail'

    def get_object(self):
        print('getting queryset! id %s' % args[0])
        self.market = Market.objects.get_or_create()
        return self.market

    # def get_context_data(self, **kwargs):
    #     print(self.args)
    #     context = super(MarketDetailView, self).get_context_data(**kwargs)
    #     context['market'] = self.market
    #     return context


def market_detail(request, market_id):
    """
    Detailed view of a single market.
    """
    try:
        market = Market.objects.get(id=market_id)
    except Market.DoesNotExist:
        print('making a market!')
        market = Market(id=market_id)

    # Refresh & save updated data
    market.save()
    return render(request, 'markets/detail.html', {'market': market})
