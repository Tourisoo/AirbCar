from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0002_listing_available_features_listing_fuel_type_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="partner",
            name="contact_email",
            field=models.EmailField(max_length=254, null=True, blank=True),
        ),
        migrations.AddField(
            model_name="partner",
            name="contact_username",
            field=models.CharField(max_length=150, null=True, blank=True),
        ),
        migrations.AddField(
            model_name="partner",
            name="login_email",
            field=models.EmailField(max_length=254, null=True, blank=True),
        ),
        migrations.AddField(
            model_name="partner",
            name="login_username",
            field=models.CharField(max_length=150, null=True, blank=True),
        ),
        migrations.AddField(
            model_name="partner",
            name="login_password",
            field=models.CharField(max_length=128, null=True, blank=True),
        ),
    ]
