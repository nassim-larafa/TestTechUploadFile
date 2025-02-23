from django.urls import path
from .views import UploadChunkView

urlpatterns = [
    path('upload/', UploadChunkView.as_view(), name='upload_chunk'),
]