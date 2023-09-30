from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views

urlpatterns = [
    path('',          views.home,                  name='home'),
    path('login',     views.login_view,            name='login_view'),
    path('dashboard', views.dashboard_view,        name='dashboard_view'),
    path('logout',    views.logout_user,           name='logout_user'),

    #-------------------------------- Books Transaction ----------------------------

    path('emprestimos',                  views.books_transaction_view,     name='books_transaction_view'),
    path('emprestimos/criar',            views.books_transaction_register, name='books_transaction_register'),
    path('emprestimos/deletar/<int:pk>', views.books_transaction_delete,   name='books_transaction_delete'),
    path('emprestimos/relatorio',        views.books_transaction_report,   name='books_transaction_report'),

    #------------------------------------ Books ------------------------------------

    path('livros',                     views.books_view,         name='books_view'),
    path('livros/criar',               views.books_register,     name='book_register'),
    path('livros/editar/<int:pk>',     views.books_edit,         name='books_edit'),
    path('livros/deletar/<int:pk>',    views.books_delete,       name='books_delete'),
    path('livros/info/<int:pk>',       views.books_info,         name='books_info'),
    path('livros/search',              views.books_search,       name='books_search'),
    path('livros/devolution/<int:pk>', views.books_devolution,   name='books_devolution'),
    path('livros/borrow',              views.books_borrow,       name='books_borrow'),
    path('livros/borrow/<int:pk>',     views.books_borrow_info,  name='books_borrow_info'),

    #------------------------------------ Users ------------------------------------

    path('usuarios',                            views.users_view,              name='users_view'),
    path('usuarios/criar',                      views.users_register,          name='users_register'),
    path('usuarios/editar/<int:pk>',            views.users_edit,              name='users_edit'),
    path('usuarios/deletar/<int:pk>',           views.users_delete,            name='users_delete'),
    path('usuarios/info/<int:pk>',              views.users_info,              name='users_info'),
    path('usuarios/info-transactions/<int:pk>', views.users_info_transactions, name='users_info_transactions'),

    #------------------------------------ Status ------------------------------------

    path('status',    views.status_view,     name='status_view'),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
