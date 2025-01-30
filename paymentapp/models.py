from django.db import models
from django.contrib.auth.models import User
from zuser.models import Player

class Payment(models.Model):
    manager = models.ForeignKey(User, on_delete=models.CASCADE, related_name="payments_managed")
    player = models.ForeignKey(Player, on_delete=models.SET_NULL, null=True, related_name="payments")
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    timestamp = models.DateTimeField(auto_now_add=True)
    transferred_to = models.CharField(max_length=100, blank=True, null=True)
    transferred_from = models.CharField(max_length=100, blank=True, null=True)
    transaction_id = models.CharField(max_length=100, blank=True, null=True)
    api_name = models.CharField(max_length=100, blank=True, null=True)
    additional_info = models.TextField(blank=True, null=True)
    # Add more fields as needed for your specific use case

    def calculate_total_amount_left(self):
        # Logic to calculate the total amount left
        pass

    def calculate_total_amount_saved(self):
        # Logic to calculate the total amount saved
        pass

    def calculate_total_cashout(self):
        # Logic to calculate the total cashout
        pass
