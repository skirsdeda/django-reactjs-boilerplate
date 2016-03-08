# Step 4: Use the bundle

[Back to step 3](https://github.com/mbrochh/django-reactjs-boilerplate/tree/step3_add_django_webpack_loader)

In the last step we have create our first bundle, but we haven't seen the result
in the browser. Let's update our template to use our fancy new ReactJS app now.

Change `view1.html` so that it looks like this:

```html
{% extends "base.html" %}
{% load render_bundle from webpack_loader %}

{% block main %}
<div id="App1"></div>
{% render_bundle 'vendors' %}
{% render_bundle 'App1' %}
{% endblock %}
```

We also need to add a new setting to `settings.py`:

```python
WEBPACK_LOADER = {
    'DEFAULT': {
        'BUNDLE_DIR_NAME': 'bundles/local/',  # end with slash
        'STATS_FILE': os.path.join(BASE_DIR, 'webpack-stats-local.json'),
    }
}
```

`BUNDLE_DIR_NAME` tells Django in which folder within the `static` folder it
can find our bundle.

`STATS_FILE` tells Django where it can find the JSON-file that maps entry-point
names to bundle files. It is because of this stats file that we can use
`{% render_bundle 'App1' %}` in our template. You will also find this `App1`
name in your `webpack.base.config.js` file under the `entry` attribute.

Now run `./manage.py runserver` and visit your site. You should see
"Sample App!".

Now try to make a change to your ReactJS app. Change `Sample App!` to
`Something New!` in `containers/App1Container.jsx`.

Then run `node_modules/.bin/webpack --config webpack.local.config.js` again,
make sure that `./manage.py runserver` is still running and visit your site
in the browser. It should say "Something New!" now.

Amazing, huh?

[Step 5: Hot reloading](https://github.com/mbrochh/django-reactjs-boilerplate/tree/step5_hot_reloading)
