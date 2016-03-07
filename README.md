# Step 2: Add non-reactJS views

We want to show that reactJS can easily be used with an existing project, so
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

At this point you can run `./manage.py runserver` and you should see "View 1"
in your browser. You can change the URL to `/view2/` and you should see
"View 2".
