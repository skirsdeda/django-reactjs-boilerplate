# Step 1: Create your Django project

Ok. So you decided you want to use ReactJS with your new or existing Django
project. That's super cool. Since we don't have a project at hand, let's just
create a new one:

```bash
mkvirtualenv djreact
pip install Django
django-admin startproject djreact
mv djreact django
```

This creates a new Django project in the root folder of your repository. I like
to rename that folder to `django` just because it will sit besides other
folders like `ansible` and maybe even `react-native`. I like the root folders
to describe the main technology that is used within them.
