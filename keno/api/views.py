from django.http import Http404, HttpResponse, JsonResponse
from django.shortcuts import render

from rest_framework.decorators import action
from rest_framework import viewsets
from keno.models import Game, GameResult
from zuser.models import Agent
from .serializers import GameNumberSerializer, GameOpenSerializer

from django.views.generic import TemplateView

import os
import json
from django.conf import settings

def json_file_view(request):
    file_path = os.path.join(settings.BASE_DIR, 'apigame', 'spin-open.json')
    with open(file_path, 'r') as json_file:
        data = json.load(json_file)
    return JsonResponse(data)

class KenoMainGameView(TemplateView):
    def get(self, request):
        username = get_agent(request)
        if username == None:
            return HttpResponse('Username is not FoundNot Allowed')
        return render(request, 'keno/great.html')

class KenoResultViewSet(viewsets.ModelViewSet):
    queryset = GameResult.objects.all()
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
        return Game.objects.filter(status='OPEN').order_by('-created_at').first()

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
        queryset = Game.objects.all()
        serializer_class = self.get_serializer_class()
        serializer = serializer_class(queryset, context={'agent': agent})
        return JsonResponse(serializer.data, safe=False)

    @action(detail=False, methods=['get'])
    def open(self, request):
        agent = get_agent(request)
        if agent == None:
            return JsonResponse(status=404, data={'get_result':"not allowed"})
        else:
            queryset = Game.objects.all()
            serializer_class = self.get_serializer_class()
            serializer = serializer_class(queryset, context={'agent': agent})
            return JsonResponse(serializer.data, safe=False)

def get_agent(request):
    username = request.session.get('username')

    # If username isn't found in session, try to get it from request.GET
    if not username:
        username = request.GET.get('username')
    if username:
        # Try to fetch the agent based on the username
        try:
            agent = Agent.objects.get_agent_by_username(username)
            # Store the username in the session for future requests
            request.session['username'] = username
            return agent
        except Agent.DoesNotExist:
            # If agent is not found, raise a 404 error
            raise Http404("Agent not found")

    # If no username is found, return None
    return None
