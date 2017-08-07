# My Local Market
A web application to help people find local farmers markets.

Uses Django to load data from [government sources](https://catalog.data.gov/dataset/farmers-markets-geographic-data), then serves it dynamically with AJAX based on zipcode searches.

### Build
To build, clone this repo and install dependencies:

```shell
pip install -r requirements.txt
npm install
```

Then build the JavaScript files (using Babel with webpack to convert the ECMAScript6 to 'VanillaJS'):
```shell
npm run build:dev
```

MyLocalMarket is set up to use PostgreSQL. Create a database named `mylocalmarket`, and create a user with all privileges. Add a file named `secret_settings.py` in the directory `mylocalmarket` and define the user's name and password (see `settings.py` for the exact variables that should be added).

Run migrations:
```shell
python manage.py makemigrations
python manage.py migrate
```

Run the `update-markets` custom Django command, which loads market data from the CSV into our Postgres database:
```shell
python manage.py update-markets
```

Finally, set up a file called `secret_settings.py` in the `mylocalmarket` folder. An example of 'secret_settings' in a test/debug environment could look like this:

```python
# Private info on database superuser to be used by Django
DATABASE_USER = 'my_admin_user'
DATABASE_PASSWORD = 'awesome_password'

DJANGO_SECRET_KEY = '$$$$$*h@7a_m*)beciv=en5@5m4(@$@=g_=$$$$$'
IN_DEVELOPMENT = True # Django's DEBUG will equal this value
HOSTS = [] # Django's ALLOWED_HOSTS
```
