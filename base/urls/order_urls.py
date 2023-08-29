from django.urls import path
from base.views import order_views as views


urlpatterns = [
    path('', views.get_orders, name='orders'), # path is already API for it's orders, I can set this to an empty string.
    path('add/', views.add_order_items, name='order-add'),
    path('my-orders/', views.get_my_orders, name='my-orders'),
    path('<str:pk>/deliver/', views.update_order_to_delivered, name='order-delivered'),
    path('<str:pk>/', views.get_order_by_id, name='user-order'),
    path('<str:pk>/pay/', views.update_order_to_paid, name='pay'),
]
 