from django.contrib import admin
from .models import Book, User, Transaction, Category

admin.site.register(Book)
admin.site.register(User)
admin.site.register(Transaction)
admin.site.register(Category)