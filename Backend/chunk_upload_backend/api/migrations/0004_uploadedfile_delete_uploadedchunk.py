# Generated by Django 5.1.6 on 2025-02-23 11:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_alter_uploadedchunk_unique_together_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='UploadedFile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file_name', models.CharField(max_length=255)),
                ('file_size', models.BigIntegerField()),
                ('uploaded_at', models.DateTimeField(auto_now_add=True)),
                ('file_path', models.CharField(max_length=255)),
            ],
        ),
        migrations.DeleteModel(
            name='UploadedChunk',
        ),
    ]
