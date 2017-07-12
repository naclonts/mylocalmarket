import requests
import urllib.parse

BASE_API_URL = 'http://127.0.0.1:5000/yourmarket/api/'
def getMarketData(id):
    """
    Return opengov data for market with FMID [id]. In JSON dictionary format.
    """
    response = requests.get(BASE_API_URL + 'id/' + id)
    return response.json()

def getMapsLink(market):
    args = '{0},{1} ("{2}")'
    args = args.format(market['y'], market['x'], market['MarketName'])
    args = urllib.parse.quote(args, '()')
    url = 'https://maps.google.com/?q=' + args
    return url
