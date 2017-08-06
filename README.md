# My Local Market
A web application to help people find local farmers markets.

Uses Django to load data from [government sources](https://catalog.data.gov/dataset/farmers-markets-geographic-data), then serves it dynamically with AJAX based on zipcode searches.

### Build
To build, clone this repo and install dependencies:

```shell
pip install -r requirements.txt
npm install
```

Then build the bundled JavaScript files with webpack:
```shell
npm run build
```

(You can, alternatively, use `npm run watch` to have webpack automatically generate new JS files when you make a change to the source.)

Right now, the settings are only configured for test servers (e.g., `python manage.py runserver`).
