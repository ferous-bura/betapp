# Generated by Django 5.0.6 on 2024-07-12 23:52

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('spin', '0006_spinticket_win_type_alter_spinticket_kind'),
        ('zuser', '0005_rename_agent_margin_agent_keno_margin_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='spin',
            name='agent',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='spin', to='zuser.agent'),
        ),
    ]
