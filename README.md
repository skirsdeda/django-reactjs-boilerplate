# Step 2: Add non-reactJS views

[Back to Step 1](https://github.com/mbrochh/django-reactjs-boilerplate/tree/step1_create_project)

We want to show that ReactJS can easily be used with an existing project, so
we will add a few "legacy-views" to simulate that this is an old existing
Django project.

I added the following lines to `urls.py`:

```python
from django.views import generic

urlpatterns = [
  url(r'^admin/', admin.site.urls),
  url(r'^view2/',
      generic.TemplateView.as_view(template_name='view2.html')),
  url(r'^$',
      generic.TemplateView.as_view(template_name='view1.html')),
]
```

Next, I added a few templates to the `templates` folder and finally I made sure
that Django is aware of these templates by putting this into `settings.py`:

```python
TEMPLATES = [
    {
        ...
        'DIRS': [os.path.join(BASE_DIR, 'djreact/templates')],
        ...
    },
]
```

The base-template is the file `base.html`. It imports the
[Twitter Bootstrap CSS Framework](http://getbootstrap.com):

```html
<!doctype html>
<html class="no-js" lang="">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">
  </head>
  <body>
    {% block main %}{% endblock %}
  </body>
</html>
```

The templates for the two views are `view1.html`:

```html
{% extends "base.html" %}

{% block main %}
<div class="container">
  <h1>View 1</h1>
</div>
{% endblock %}
```

and `view2.html`:

```html
{% extends "base.html" %}

{% block main %}
<div class="container">
  <h1>View 2</h1>
</div>
{% endblock %}
```

At this point you can run `./manage.py runserver` and you should see "View 1"
in your browser. You can change the URL to `/view2/` and you should see
"View 2".

I'm importing Twitter Bootstrap here because I also want to show that ReactJS
will not stand in your way even if you are already using a complex CSS
framework. More on this in a later step.

[Step 3: Add django-webpack-loader](https://github.com/mbrochh/django-reactjs-boilerplate/tree/step3_add_django_webpack_loader)
