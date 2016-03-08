# Django ReactJS Boilerplate

This repository was used for my talk at the
[Python User Group Singapore March Meetup 2016](http://www.meetup.com/Singapore-Python-User-Group/events/229113409/)

The goal is to show how you can use ReactJS in your existing Django apps
today.

This is far from perfect. This approach is not _universal_, so it only works for
components that don't need to be indexed by Google (and thus need to be
pre-rendered on your server). However, the highly interactive stuff usually
happens behind a login form anyways (think Trello: They have a few static pages
to advertise their product but the real app is behind a login).

Credit where credit is due:

This awesome blog post by [Owais Lone](http://owaislone.org) finally pushed me
into the right direction: http://owaislone.org/blog/webpack-plus-reactjs-and-django/

# Try this on your machine

You can clone this repository, install all dependencies and try it in your
browser quite easily:

```bash
git clone https://github.com/mbrochh/django-reactjs-boilerplate.git
cd django-react-boilerplace/django
mkvirtualenv djreact
pip install -r requirements.txt
npm install
./manage.py migrate
./manage.py create_fixtures
./manage.py runserver
```

# Follow my train of thought

If you want to learn how I came up with this repository, you can follow my
train of thought by going into all those branches. Start with
[Step 1: Create your Django project](https://github.com/mbrochh/django-reactjs-boilerplate/tree/step1_create_project)
