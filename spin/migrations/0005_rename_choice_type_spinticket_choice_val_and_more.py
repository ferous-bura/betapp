# Generated by Django 5.0.6 on 2024-07-12 12:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('spin', '0004_rename_odd_type_spinanalytica_spin_odd_type'),
    ]

    operations = [
        migrations.RenameField(
            model_name='spinticket',
            old_name='choice_type',
            new_name='choice_val',
        ),
        migrations.RenameField(
            model_name='spinticket',
            old_name='choice_value',
            new_name='kind',
        ),
        migrations.AlterField(
            model_name='spin',
            name='game_type',
            field=models.CharField(db_index=True, default='spin', max_length=15),
        ),
    ]
