# forms.py

from django import forms
from .models import Company, Agent, Player


class ChangePasswordForm(forms.Form):
    new_password = forms.CharField(label='New Password', widget=forms.PasswordInput)
    confirm_new_password = forms.CharField(label='Confirm New Password', widget=forms.PasswordInput)

class CompanyCreateForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super(CompanyCreateForm, self).__init__(*args, **kwargs)

        # Add form-control class and placeholders
        for field_name, field in self.fields.items():
            field.widget.attrs['class'] = 'form-control'

            # Adding placeholders for each field
            placeholders = {
                'company_user': 'Enter company user',
                'company_address': 'Enter company address',
                'company_phone_number': 'Enter phone number',
                'company_capital': 'Enter company capital',
                'subscription_start': 'Enter subscription start date',
                'subscription_end': 'Enter subscription end date',
            }

            field.widget.attrs['placeholder'] = placeholders.get(field_name, '')

    class Meta:
        model = Company
        fields = ['company_user', 'company_address', 
                  'company_phone_number', 'company_capital', 
                  'subscription_start', 'subscription_end']


class CompanyForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super(CompanyForm, self).__init__(*args, **kwargs)

        # Add form-control class and placeholders
        for field_name, field in self.fields.items():
            field.widget.attrs['class'] = 'form-control'

            # Adding placeholders for each field
            placeholders = {
                'company_user': 'Enter company user',
                'company_address': 'Enter company address',
                'company_phone_number': 'Enter phone number',
                'company_capital': 'Enter company capital',
                'subscription_start': 'Enter subscription start date',
                'subscription_end': 'Enter subscription end date',
            }

            field.widget.attrs['placeholder'] = placeholders.get(field_name, '')

    class Meta:
        model = Company
        fields = ['company_user', 'company_address', 
                  'company_phone_number', 'company_capital', 
                  'subscription_start', 'subscription_end']
        exclude = ['company_user']


class AgentForm(forms.ModelForm):
    class Meta:
        model = Agent
        fields = ['full_name', 'company', 'agent_capital', 'phone_number', 'agent_address', 'keno_margin', 'locked']
        # exclude = ['agent_user']
        # widgets = {
        #     'locked': forms.CheckboxInput(attrs={'class': 'form-check-input'})
        # }

    def __init__(self, company, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['company'].widget = forms.HiddenInput()
        self.company = company
        for field_name, field in self.fields.items():
            if field_name != 'locked':
                field.widget.attrs.update({'class': 'form-control', 'placeholder': f'Enter {field_name}'})

class PlayerForm(forms.ModelForm):
    class Meta:
        model = Player
        fields = ['player']
