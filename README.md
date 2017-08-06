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

MyLocalMarket uses PostgreSQL. Create a database named `mylocalmarket`, and create a user with all privileges. Add a file named `secret_settings.py` in the directory `mylocalmarket` and define the user's name and password (see `settings.py` for the exact variables that should be added).

Run migrations:
```shell
python manage.py makemigrations
python manage.py migrate
```

Run the `update-markets` custom Django command, which loads market data from the CSV into our Postgres database:
```shell
python manage.py update-markets
```
