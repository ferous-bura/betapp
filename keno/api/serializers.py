from rest_framework import serializers

from keno.models import Game, GameResult

from rest_framework import serializers

class RecentResultSerializer(serializers.Serializer):
    id = serializers.SerializerMethodField()
    gameId = serializers.SerializerMethodField()
    order = serializers.IntegerField()
    value = serializers.IntegerField()

    class Meta:
        model = GameResult

    def get_gameId(self, obj):
        return str(obj.gameId_id)

    def get_id(self, obj):
        return str(obj.id)

class RecentGameSerializer(serializers.Serializer):
    id = serializers.SerializerMethodField()
    gameNumber = serializers.IntegerField(source='game_num')
    createdAt = serializers.DateTimeField(source='created_at')
    status = serializers.CharField(default="OPEN")
    results = serializers.SerializerMethodField()

    class Meta:
        model = Game
        fields = ['id', 'gameNumber', 'createdAt', 'status', 'results']

    def get_results(self, obj):
        agent = self.context.get('agent')
        closed_games_with_results = GameResult.objects.filter(gameId=obj.pk, agent=agent)
        return RecentResultSerializer(closed_games_with_results, many=True).data #[:10]

    def get_id(self, obj):
        return str(obj.id)

    def get_gameNumber(self, obj):
        return str(obj.gameNumber)

class GameResultSerializer(serializers.ModelSerializer):
    gameId = serializers.SerializerMethodField()
    id = serializers.SerializerMethodField()

    class Meta:
        model = GameResult
        fields = ['id', 'gameId', 'order', 'value']

    def get_gameId(self, obj):
        agent = self.context.get('agent')
        return str(obj.gameId_id)

    def get_id(self, obj):
        agent = self.context.get('agent')
        return str(obj.id)

class GameSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    createdAt = serializers.DateTimeField(source='created_at')
    gameNumber = serializers.IntegerField(source='game_num')
    status = serializers.CharField(default="OPEN")

    class Meta:
        model = Game
        fields = ('id', 'gameNumber', 'createdAt', 'status')

    def to_representation(self, instance):
        if instance:
            return super().to_representation(instance)
        else:
            return {}

    def get_id(self, obj):
        return str(obj.id)

class OpenGameSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    gameNumber = serializers.IntegerField(source='game_num')
    createdAt = serializers.DateTimeField(source='created_at')
    status = serializers.CharField()

    class Meta:
        model = Game
        fields = ('id', 'gameNumber', 'createdAt', 'status')

    def get_id(self, obj):
        return str(obj.id)

class GameNumberSerializer(serializers.Serializer):
    game = serializers.SerializerMethodField()
    result = serializers.SerializerMethodField()
    recent = serializers.SerializerMethodField()
    openGame = serializers.SerializerMethodField()

    def __init__(self, *args, **kwargs):
        agent = kwargs.pop('context', {}).get('agent')
        super().__init__(*args, **kwargs)
        self.agent = agent

    def get_game(self, obj):
        latest_closed_game = Game.objects.filter(status='CLOSED').order_by('-created_at').first()
        if latest_closed_game:
            return GameSerializer(latest_closed_game).data
        else:
            return {}

    def get_result(self, obj):
        latest_closed_game = Game.objects.filter(status='CLOSED').order_by('-created_at').first()
        if latest_closed_game:
            latest_result = GameResult.objects.filter(gameId=latest_closed_game, agent=self.agent)
            return GameResultSerializer(latest_result, many=True).data
        else:
            return []

    def get_recent(self, obj):
        closed_games_with_results = Game.objects.filter(status='CLOSED').order_by('-created_at')[:10]  # .exclude(id=latest_closed_game.pk)
        if closed_games_with_results:
            return RecentGameSerializer(closed_games_with_results, many=True, context={'agent': self.agent}).data
        else:
            return [{
                "id": "0",
                "gameNumber": 0,
                "createdAt": "2024-04-04T01:23:07.780007Z",
                "status": "CLOSED",
                "results":[]
            }]

    def get_openGame(self, obj):
        latest_open_game = Game.objects.filter(status='OPEN').order_by('-created_at').first()
        if latest_open_game:
            return OpenGameSerializer(latest_open_game).data
        else:
            return {
                "id": "0",
                "gameNumber": 0,
                "createdAt": "2024-04-04T01:23:07.780007Z",
                "status": "CLOSED",
                "results":[]
            }


class GameOpenSerializer(serializers.Serializer):
    openGame = serializers.SerializerMethodField()
    lastGame = serializers.SerializerMethodField()
    result = serializers.SerializerMethodField()

    def __init__(self, *args, **kwargs):
        agent = kwargs.pop('context', {}).get('agent')
        super().__init__(*args, **kwargs)
        self.agent = agent

    def get_openGame(self, obj):
        # Assuming obj is the instance of the Game model
        latest_open_game = Game.objects.filter(status='OPEN').order_by('-created_at').first()
        if latest_open_game:
            return OpenGameSerializer(latest_open_game).data
        else:
            return {}

    def get_lastGame(self, obj):
        # Assuming obj is the instance of the Game model
        latest_closed_game = Game.objects.filter(status='CLOSED').order_by('-created_at').first()
        if latest_closed_game:
            return GameSerializer(latest_closed_game).data #[:10]
        else:
            return {}

    def get_result(self, obj):
        latest_closed_game = Game.objects.filter(status='CLOSED').order_by('-created_at').first()
        if latest_closed_game:
            obj = GameResult.objects.filter(gameId=latest_closed_game, agent=self.agent)
            return GameResultSerializer(obj, many=True).data
        else:
            return []
