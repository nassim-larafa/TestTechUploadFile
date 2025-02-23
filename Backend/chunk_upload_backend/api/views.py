from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import UploadedChunk

class UploadChunkView(APIView):
    def post(self, request, *args, **kwargs):
        chunk = request.FILES.get('file')
        chunk_index = request.POST.get('chunkIndex')
        total_chunks = request.POST.get('totalChunks')
        file_name = request.POST.get('fileName')

        # Check if this chunk has already been uploaded
        if UploadedChunk.objects.filter(file_name=file_name, chunk_index=chunk_index).exists():
            return Response(
                {'success': True, 'message': 'Chunk already uploaded'},
                status=status.HTTP_200_OK
            )

        # Save the chunk (same logic as before)
        ...

        # Mark this chunk as uploaded
        UploadedChunk.objects.create(file_name=file_name, chunk_index=chunk_index)

        return Response(
            {'success': True, 'message': 'Chunk uploaded successfully'},
            status=status.HTTP_200_OK
        )