from rest_framework import generics, viewsets, permissions
from django.contrib.auth.models import User
from .serializers import RegisterSerializer, UserSerializer, ProfileSerializer, TaskSerializer
from .models import Profile, Task
from .permissions import IsOwnerOrReadOnly


class RegisterAPIView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = (permissions.AllowAny,)


class ProfileRetrieveUpdateAPIView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = (permissions.IsAuthenticated,)


    def get_object(self):
        profile, _ = Profile.objects.get_or_create(user=self.request.user)
        return profile


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = (permissions.IsAuthenticated, IsOwnerOrReadOnly)


    def get_queryset(self):
        return Task.objects.filter(owner=self.request.user).order_by('-created_at')


    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)