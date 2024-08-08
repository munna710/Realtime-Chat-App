from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie

@ensure_csrf_cookie
def home(request):
    return render(request, 'index.html')

def about(request):
    return render(request, 'about.html')