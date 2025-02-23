from django.db import models

class UploadedChunk(models.Model):
    file_name = models.CharField(max_length=255)
    chunk_index = models.IntegerField()
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('file_name', 'chunk_index')