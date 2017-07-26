from django import template
print('register...!')
register = template.Library()

# Custom template filter to see if user has favorited a market
@register.filter(name='has_favorite', is_safe=True)
def has_favorite(user, market_id):
    """
    Returns {bool}: True if user has the market with market_id in their
    favorites list; otherwise, false.
    """
    return user.profile.favorite_markets.filter(id=market_id).exists()
