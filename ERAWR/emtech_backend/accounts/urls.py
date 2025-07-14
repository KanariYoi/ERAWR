from django.urls import path
from .views import RegisterView, LoginView, ProfileView, ChangePasswordView, ServiceListView, AddOnListView, BundleListView, OrderView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('services/', ServiceListView.as_view(), name='service-list'),
    path('addons/', AddOnListView.as_view(), name='addon-list'),
    path('bundles/', BundleListView.as_view(), name='bundle-list'),
    path('orders/', OrderView.as_view(), name='order-create'),
]
