# Generated by Django 5.0.6 on 2024-05-30 19:48

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('keno', '0001_initial'),
        ('zuser', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='gameanalytica',
            name='agent',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='gameanalytic', to='zuser.agent'),
        ),
        migrations.AddField(
            model_name='gameanalytica',
            name='gameId',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='gameanalytic_set', to='keno.game'),
        ),
        migrations.AddField(
            model_name='gameresult',
            name='agent',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='gameresult', to='zuser.agent'),
        ),
        migrations.AddField(
            model_name='gameresult',
            name='gameId',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='gameresult_set', to='keno.game'),
        ),
        migrations.AddField(
            model_name='mobilegameanalytica',
            name='gameId',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='gameanalytic_set', to='keno.mobilegame'),
        ),
        migrations.AddField(
            model_name='mobilegameresult',
            name='_user',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='gameresult', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='mobilegameresult',
            name='gameId',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='gameresult_set', to='keno.mobilegame'),
        ),
        migrations.AddField(
            model_name='mobileticket',
            name='_game',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='ticket', to='keno.mobilegame'),
        ),
        migrations.AddField(
            model_name='mobileticket',
            name='played_by',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='ticket', to='zuser.player'),
        ),
        migrations.AddField(
            model_name='ticket',
            name='_game',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='ticket', to='keno.game'),
        ),
        migrations.AddField(
            model_name='ticket',
            name='cashier_by',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='ticket', to='zuser.cashier'),
        ),
    ]
