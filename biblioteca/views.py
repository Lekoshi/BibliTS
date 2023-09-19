from django.shortcuts import redirect, render, get_object_or_404
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.core import serializers
from django.utils import timezone
from django.forms.models import model_to_dict
from django.db.models import Q
from .models import Book, User, Transaction, Category
from .forms import UserForm, BookForm, TransactionForm

def home(request):
    if (not request.user.is_authenticated):
        if(request.method == 'POST'):
            username = request.POST['username']
            password = request.POST['password']
            user = authenticate(request, username=username, password=password)

            if user is not None:
                login(request, user)
                return redirect('/dashboard') 
            else:
                messages.warning(request, 'E-mail ou senha inválidos')
                return redirect('home')
        else:
            categories = Category.objects.all().order_by('name')
            return render(request, 'home.html', {'categories' : categories})
    else:
        return redirect('/dashboard')
    
def login_view(request):
    if (not request.user.is_authenticated):
        if(request.method == 'POST'):
            username = request.POST['username']
            password = request.POST['password']
            user = authenticate(request, username=username, password=password)

            if user is not None:
                login(request, user)
                return redirect('/dashboard') 
            else:
                messages.warning(request, 'E-mail ou senha inválidos')
                return redirect('login_view') 
        else:
            return render(request, 'login.html', {})
    else:
        return redirect('/dashboard')
    
def dashboard_view(request):
    if(not request.user.is_authenticated):
        return redirect('home')
    else:
        return render(request, 'dashboard2.html', {})


def book_register_view(request):
    return render(request, 'books-register.html', {})

def logout_user(request):
    logout(request)
    messages.success(request, 'Deslogado com sucesso!')
    return redirect('home')

#-------------- Books Transaction ---------

def books_transaction_view(request):
    if(not request.user.is_authenticated):
        return redirect('home')
    else:
        transactions = Transaction.objects.all().order_by('-issued_on')
        return render(request, 'book-transaction.html', {'transactions' : transactions})

def books_transaction_register(request):
    if(request.method == 'POST'):
        book = get_object_or_404(Book, pk=request.POST['book'])
        #user = get_object_or_404(User, pk=request.POST['user'])
        due_date = timezone.now() + timezone.timedelta(days=int(request.POST['duration']))
        
        form = TransactionForm({'book': request.POST['book'], 'user': request.POST['user'], 'due_date': due_date})

        if form.is_valid():
            form.save()
            book.available = False
            book.save()
        else:
            print(TransactionForm.errors)
    return redirect('books_transaction_view')

def books_transaction_delete(request, pk):
    transaction = get_object_or_404(Transaction, pk=pk)

    book = transaction.book;
    book.available = True
    book.save()

    transaction.active = False;
    transaction.save()
    return redirect('books_transaction_view')

#------------------ Books -----------------

def books_view(request):
    if(not request.user.is_authenticated):
        return redirect('home')
    else:
        categories = Category.objects.all().order_by('name')
        users = User.objects.all()
        return render(request, 'books.html', {'categories' : categories, 'users' : users})

def books_register(request):
    if(request.method == 'POST'):
        form = BookForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
    
    return redirect('books_view')

def books_edit(request, pk):
    if(request.method == 'POST'):
        book = get_object_or_404(Book, pk=pk)
        form = BookForm(request.POST, request.FILES, instance=book)

        if form.is_valid():
            get_object_or_404(Book, pk=pk).cover.delete()
            form.save()
    return redirect('books_view')

def books_delete(request, pk):
    book = get_object_or_404(Book, pk=pk)
    transactions = Transaction.objects.filter(book=pk)

    if transactions.count() > 0:
        for t in transactions:
            t.active = False
            t.return_date = timezone.now()
            t.save()
       
    book.delete()
    return redirect('books_view')

def books_info(request, pk):
    book = Book.objects.filter(pk=pk)
    book_data = list(book.values('id', 'title', 'author', 'description', 'available', 'cover'))

    for b in book_data:
        categories = book.values_list('category', flat=True)
        b['categories'] = list(categories)
        if b['cover'] != None:
            b['cover'] = "/media/" + b['cover']
        else:
            b['cover'] = "/static/img/book.jpg"

    return JsonResponse({'book': book_data[0]}, content_type='application/json')

def books_search(request):
    available = request.GET.get('a')
    category  = request.GET.get('c')
    query     = request.GET.get('q')

    books      = Book.objects.all()
    
    if available is not None:
        if available == '1':
            books = books.filter(available=True)
        elif available == '0':
            books = books.filter(available=False)

    if category is not None:
        books = books.filter(category__id=category)

    if query is not None:
        books = books.filter(Q(title__icontains=query) | Q(author__icontains=query))
    
    books = books.order_by('title')

    books_data = list(books.values('id', 'title', 'author', 'description', 'available', 'cover'))

    for book in books_data:
        categories = Category.objects.filter(book__id=book['id']).values_list('name', flat=True).order_by('name')
        book['categories'] = list(categories)

    return JsonResponse({'books': books_data}, content_type='application/json')

def books_devolution(request, pk):
    book = get_object_or_404(Book, pk=pk)

    transaction = get_object_or_404(Transaction, book=book)
    transaction.active = False
    transaction.book = None
    transaction.return_date = timezone.now();
    transaction.save()
    
    book.available = True
    book.save()
    
    return redirect('books_view')

def books_borrow(request):
    if(request.method == 'POST'):
        due_date = timezone.now().date() + timezone.timedelta(days=int(request.POST['duration']))

        book = get_object_or_404(Book, pk=request.POST['book'])

        form = TransactionForm({'book': request.POST['book'], 'user': request.POST['user'], 'due_date': due_date, 'book_title': book.title})

        if form.is_valid():
            form.save()
            book.available = False
            book.save()
        else:
            print(TransactionForm.errors)
    return redirect('books_view')

def books_borrow_info(request, pk):
    transactionObj = get_object_or_404(Transaction, book=pk)

    user        = model_to_dict(transactionObj.user)
    book        = model_to_dict(transactionObj.book, exclude=['cover', 'category'])
    transaction = model_to_dict(transactionObj)
    transaction['due_date']  = transactionObj.due_date.strftime("%d-%m-%Y")
    transaction['issued_on'] = transactionObj.issued_on.strftime("%d-%m-%Y")

    return JsonResponse({'transaction': transaction, 'user': user, 'book': book}, content_type='application/json')

#------------------ Users ------------------

def users_view(request):
    if(not request.user.is_authenticated):
        return redirect('home')
    else:
        users = User.objects.all().order_by('-created_at')
        return render(request, 'users.html', {'users' : users})

def users_register(request):
    if(request.method == 'POST'):
        form = UserForm(request.POST)

        if form.is_valid():
            form.save()

    return redirect('users_view')

def users_edit(request, pk):
    if(request.method == 'POST'):
        user = get_object_or_404(User, pk=pk)
        form = UserForm(request.POST, instance=user)
        
        if form.is_valid():
            form.save()

    return redirect('users_view')

def users_delete(request, pk):
    user = get_object_or_404(User, pk=pk)
    transactions = Transaction.objects.filter(user=user.id)
    if transactions:
        for transaction in transactions:
            transaction.book.available = True
            transaction.book.save()
    user.delete()
    return redirect('users_view')


def users_info(request, pk):
    user = model_to_dict(get_object_or_404(User, pk=pk))
    
    return JsonResponse({'user': user})

def users_info_transactions(request, pk):
    transactions = list(Transaction.objects.filter(user=pk).values().order_by('-active'))
    for transaction in transactions:
        
        transaction['due_date']  = transaction['due_date'].strftime("%d-%m-%Y")
        transaction['issued_on'] = transaction['issued_on'].strftime("%d-%m-%Y")
        if transaction['return_date'] != None:
            transaction['return_date'] = transaction['return_date'].strftime("%d-%m-%Y")

    return JsonResponse({'transactions': transactions})

#------------------ Status ------------------

def status_view(request):
    if(not request.user.is_authenticated):
        return redirect('home')
    else:
        users        = User.objects.all()
        books        = Book.objects.all()
        transactions = Transaction.objects.all().filter(active=True)

        overdues = transactions.filter(due_date__lt=timezone.now().date())
        warningDue = transactions.filter(due_date=timezone.now().date())
    
        for overdue in overdues:
            overdue.days_late = (timezone.now().date() - overdue.due_date).days

    return render(request, 'status.html', {'usersCount': users.count(), 'booksCount': books.count(), 'transactionsCount': transactions.count(), 'overdues': overdues, 'warningDue': warningDue})