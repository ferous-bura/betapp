from django.http import Http404, HttpResponse, JsonResponse
from django.shortcuts import render

from rest_framework.decorators import action
from rest_framework import viewsets
from spin.models import Spin
from zuser.models import Agent
from .serializers import GameNumberSerializer, GameOpenSerializer

from django.views.generic import TemplateView

import os
import json
from django.conf import settings

def json_file_view(request):
    file_path = os.path.join(settings.BASE_DIR, 'spin/api', 'spin-open.json')
    with open(file_path, 'r') as json_file:
        data = json.load(json_file)
    return JsonResponse(data)

class SpinMainGameView(TemplateView):
    def get(self, request):
        username = get_agent(request)
        if username == None:
            return HttpResponse('Username is not FoundNot Allowed')
        return render(request, 'spin/index.html')

class SpinResultViewSet(viewsets.ModelViewSet):
    queryset = Spin.objects.all()
    serializer_class = GameOpenSerializer

    def get_serializer_class(self):
        if self.action == 'number':
            return GameNumberSerializer
        elif self.action == 'open':
            return GameOpenSerializer
        else:
            return super().get_serializer_class()

    @staticmethod
    def get_open_game():
        return Spin.objects.filter(status='OPEN').order_by('-created_at').first()

    @staticmethod
    def get_game_number(request):
        game_number = request.GET.get('gameNumber')
        return game_number

    @action(detail=False, methods=['get'])
    def number(self, request):
        agent = get_agent(request)
        if agent == None:
            return JsonResponse(status=404, data={'get_result':"not allowed"})
        game_number = self.get_game_number(request)
        if game_number:
            pass
        queryset = Spin.objects.all()
        serializer_class = self.get_serializer_class()
        serializer = serializer_class(queryset, context={'agent': agent})
        return JsonResponse(serializer.data, safe=False)

    @action(detail=False, methods=['get'])
    def opened(self, request):
        agent = get_agent(request)
        if agent == None:
            return JsonResponse(status=404, data={'get_result':"not allowed"})
        else:
            queryset = Spin.objects.all()
            serializer_class = self.get_serializer_class()
            serializer = serializer_class(queryset, context={'agent': agent})
            return JsonResponse(serializer.data, safe=False)

    @action(detail=False, methods=['get'])
    def open(self, request):        
    # def json_file_view(request):
        file_path = os.path.join(settings.BASE_DIR, 'spin/api', 'spin-open.json')
        with open(file_path, 'r') as json_file:
            data = json.load(json_file)
        return JsonResponse(data)

def get_agent(request):
    username = request.session.get('username')
    if not username:
        username = request.GET.get('username')
        if username:
            try:
                agent = Agent.objects.get_agent_by_username(username)
                request.session['username'] = username
                return agent
            except Http404 as e:
                print(e)
        else:
            return None
    try:
        u_id = username
        agent = Agent.objects.get_unique_agent_or_404(u_id)
        return agent
    except Exception as e:
        print(e)
        return Http404
