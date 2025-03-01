# Generated by Django 5.0.6 on 2024-06-07 00:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('zuser', '0002_alter_agent_odd_type'),
    ]

    operations = [
        migrations.AddField(
            model_name='agent',
            name='spin_give_away_amount',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='agent',
            name='spin_odd_type',
            field=models.CharField(choices=[('promo4', 'Promo 4'), ('mohio', 'Mohio'), ('promo', 'Promo'), ('promo2', 'Promo 2'), ('promo3', 'Promo 3'), ('promo5', 'Promo 5'), ('promo6', 'Promo 6'), ('type1', 'Type 1'), ('type2', 'Type 2'), ('mohio2', 'Mohio 2')], default='promo4', max_length=20),
        ),
    ]
