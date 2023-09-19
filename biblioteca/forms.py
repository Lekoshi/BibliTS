from django import forms
from django.forms import ModelForm
from .models import Book, User, Transaction, Category

class UserForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['name', 'phone', 'email']

class BookForm(forms.ModelForm):
    class Meta:
        model = Book
        fields = ['title', 'author', 'description', 'category', 'cover']

class TransactionForm(forms.ModelForm):
    class Meta:
        model = Transaction
        fields = ['user', 'book', 'due_date', 'book_title']