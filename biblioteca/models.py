from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=200, blank=False, null=False)

    class Meta:
        verbose_name_plural = 'Categories'
        
    def __str__(self):
        return f"{self.name}"
        
class Book(models.Model):
    title       = models.CharField(max_length=200, blank=False, null=False)
    author      = models.CharField(max_length=200, blank=False, null=False)
    available   = models.BooleanField(default=True)
    description = models.TextField(default="Sem descrição disponível")
    cover       = models.ImageField(upload_to="covers", blank=True, null=True)
    created_at  = models.DateTimeField(auto_now_add=True)
    category    = models.ManyToManyField(Category, default=None, blank=True)

    def __str__(self):
        return f"{self.title} ({self.author})"

    def delete(self, *args, **kwargs):
        if self.cover:
            self.cover.delete(self.cover.path)
        super().delete(*args, **kwargs)

class User(models.Model):
    name  = models.CharField(max_length=200, blank=False, null=False)
    phone = models.CharField(max_length=200, blank=True, default="Não informado")
    email = models.CharField(max_length=200, blank=True, default="Não informado")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name}"
    
class Transaction(models.Model):
    user        = models.ForeignKey(User, on_delete=models.CASCADE)
    book        = models.ForeignKey(Book, on_delete=models.SET_NULL, null=True)
    book_title  = models.CharField(max_length=200, null=False, default="Sem título")
    issued_on   = models.DateTimeField(auto_now_add=True)
    due_date    = models.DateField(blank=False, null=False)
    return_date = models.DateField(null=True, blank=True)
    active      = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.book} - {self.user} | {self.issued_on}"
    