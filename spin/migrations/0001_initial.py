# Generated by Django 5.0.6 on 2024-06-04 23:48

import django.core.validators
import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('zuser', '0002_alter_agent_odd_type'),
    ]

    operations = [
        migrations.CreateModel(
            name='Spin',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('game_num', models.IntegerField(db_index=True, null=True)),
                ('status', models.CharField(default='OPEN', max_length=10)),
                ('created_at', models.DateTimeField(db_index=True)),
                ('updated_at', models.DateTimeField(db_index=True)),
                ('game_type', models.CharField(db_index=True, default='keno', max_length=15)),
                ('result', models.IntegerField(default=0)),
                ('_done', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='SpinTicket',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('choice_value', models.CharField(max_length=10)),
                ('stake', models.IntegerField(default=0, validators=[django.core.validators.MinValueValidator(1)])),
                ('won_amount', models.IntegerField(default=0)),
                ('created_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('updated_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('redeemed', models.BooleanField(default=False)),
                ('cancelled', models.BooleanField(default=False)),
                ('unique_identifier', models.CharField(blank=True, default=None, max_length=30, null=True)),
                ('ticket_type', models.CharField(blank=True, default=None, max_length=30, null=True)),
                ('multiple_stake', models.IntegerField(default=0, validators=[django.core.validators.MinValueValidator(1)])),
                ('_odd', models.IntegerField(default=0)),
                ('_game', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='spinticket', to='spin.spin')),
                ('cashier_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='spinticket', to='zuser.cashier')),
            ],
        ),
    ]
