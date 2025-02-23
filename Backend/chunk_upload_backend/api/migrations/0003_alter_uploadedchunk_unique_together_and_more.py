# Generated by Django 5.1.6 on 2025-02-23 11:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_uploadedchunk_delete_uploadedfile'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='uploadedchunk',
            unique_together=set(),
        ),
        migrations.AddField(
            model_name='uploadedchunk',
            name='chunk_data',
            field=models.FileField(blank=True, default=None, null=True, upload_to='uploads/'),
        ),
        migrations.RemoveField(
            model_name='uploadedchunk',
            name='uploaded_at',
        ),
    ]
