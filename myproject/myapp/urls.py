from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterAPIView, ProfileRetrieveUpdateAPIView, TaskViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='task')


urlpatterns = [
path('auth/register/', RegisterAPIView.as_view(), name='auth_register'),
path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
path('profile/', ProfileRetrieveUpdateAPIView.as_view(), name='profile'),
path('', include(router.urls)),
]