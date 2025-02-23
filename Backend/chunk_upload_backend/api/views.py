import os
import shutil  # Import shutil for directory deletion
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import UploadedFile

class UploadChunkView(APIView):
    def post(self, request, *args, **kwargs):
        # Log the request data for debugging
        print("Request Data:", request.POST)
        print("Request Files:", request.FILES)

        chunk = request.FILES.get('file')
        chunk_index = request.POST.get('chunkIndex')
        total_chunks = request.POST.get('totalChunks')
        file_name = request.POST.get('fileName')

        # Validate required fields
        if not chunk or not chunk_index or not total_chunks or not file_name:
            return Response(
                {'error': 'Missing required fields (file, chunkIndex, totalChunks, fileName)'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            chunk_index = int(chunk_index)
            total_chunks = int(total_chunks)
        except (TypeError, ValueError):
            return Response(
                {'error': 'Invalid chunkIndex or totalChunks value'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create a temporary directory for the file
        temp_dir = os.path.join(settings.MEDIA_ROOT, 'temp', file_name)
        os.makedirs(temp_dir, exist_ok=True)

        # Check if the chunk already exists
        chunk_path = os.path.join(temp_dir, f'{file_name}.part{chunk_index}')
        if os.path.exists(chunk_path):
            return Response(
                {'success': True, 'message': 'Chunk already uploaded', 'lastUploadedChunk': chunk_index},
                status=status.HTTP_200_OK
            )

        # Save the chunk
        with open(chunk_path, 'wb') as f:
            for chunk_data in chunk.chunks():
                f.write(chunk_data)

        # Check if all chunks are uploaded
        if chunk_index == total_chunks - 1:
            # Assemble the file
            final_path = os.path.join(settings.MEDIA_ROOT, file_name)
            with open(final_path, 'wb') as final_file:
                for i in range(total_chunks):
                    part_path = os.path.join(temp_dir, f'{file_name}.part{i}')
                    with open(part_path, 'rb') as part_file:
                        final_file.write(part_file.read())
                    os.remove(part_path)  # Delete the chunk after assembly

            # Delete the temporary directory
            shutil.rmtree(temp_dir)

            # Save file metadata to the database
            UploadedFile.objects.create(
                file_name=file_name,
                file_size=os.path.getsize(final_path),
                file_path=final_path,
            )

            # Return a success response
            return Response(
                {'success': True, 'message': 'File uploaded successfully'},
                status=status.HTTP_201_CREATED
            )

        # Return a success response for individual chunks
        return Response(
            {'success': True, 'message': 'Chunk uploaded successfully', 'lastUploadedChunk': chunk_index},
            status=status.HTTP_200_OK
        )