from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('core', '0013_alter_partner_verification_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='booking',
            name='listing',
            field=models.ForeignKey(
                on_delete=models.CASCADE,
                to='core.listing'
            ),
        ),
    ]
    