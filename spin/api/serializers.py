from rest_framework import serializers

from spin.models import Spin

from rest_framework import serializers

class RecentResultSerializer(serializers.Serializer):
    id = serializers.SerializerMethodField()
    gameId = serializers.SerializerMethodField()
    order = serializers.IntegerField()
    value = serializers.IntegerField()

    class Meta:
        model = Spin

    def get_gameId(self, obj):
        return str(obj.gameId_id)

    def get_id(self, obj):
        return str(obj.id)

class RecentGameSerializer(serializers.Serializer):
    id = serializers.SerializerMethodField()
    gameNumber = serializers.IntegerField(source='game_num')
    createdAt = serializers.DateTimeField(source='created_at')
    status = serializers.CharField(default="OPEN")
    gameResult = serializers.SerializerMethodField()

    class Meta:
        model = Spin
        fields = ['id', 'gameNumber', 'createdAt', 'status', 'gameResult']

    def get_gameResult(self, obj):
        # agent = self.context.get('agent')
        # closed_games_with_results = Spin.objects.filter(gameId=obj.pk, agent=agent)
        # return RecentResultSerializer(closed_games_with_results, many=True).data #[:10]
        return obj.result

    def get_id(self, obj):
        return str(obj.id)

    def get_gameNumber(self, obj):
        return str(obj.gameNumber)

# "id": "2825acd1-bd9e-4c3c-b227-a87b734375dc",
# "gameNumber": 20104,
# "createdAt": "2024-05-27T06:59:00.080Z",
# "status": "CLOSED",
# "gameResult": 19

class GameResultSerializer(serializers.ModelSerializer):
    gameId = serializers.SerializerMethodField()
    id = serializers.SerializerMethodField()

    class Meta:
        model = Spin
        fields = ['id', 'gameId', 'result']

    def get_gameId(self, obj):
        # agent = self.context.get('agent')
        return str(obj.id)

    def get_id(self, obj):
        # agent = self.context.get('agent')
        return str(obj.id)

class GameSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    createdAt = serializers.DateTimeField(source='created_at')
    gameNumber = serializers.IntegerField(source='game_num')
    status = serializers.CharField(default="OPEN")
    gameResult = serializers.SerializerMethodField()

    class Meta:
        model = Spin
        fields = ('id', 'gameNumber', 'createdAt', 'status', 'gameResult')

    def to_representation(self, instance):
        if instance:
            return super().to_representation(instance)
        else:
            return {}

    def get_id(self, obj):
        return str(obj.id)

    def get_gameResult(self, obj):
        return str(obj.result)

class OpenGameSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    gameNumber = serializers.IntegerField(source='game_num')
    createdAt = serializers.DateTimeField(source='created_at')
    status = serializers.CharField()
    gameResult = serializers.SerializerMethodField()

    class Meta:
        model = Spin
        fields = ('id', 'gameNumber', 'createdAt', 'status', 'gameResult')

    def get_id(self, obj):
        return str(obj.id)

    def get_gameResult(self, obj):
        return obj.result

class GameNumberSerializer(serializers.Serializer):
    result = serializers.SerializerMethodField()
    recent = serializers.SerializerMethodField()
    openGame = serializers.SerializerMethodField()

    def __init__(self, *args, **kwargs):
        agent = kwargs.pop('context', {}).get('agent')
        super().__init__(*args, **kwargs)
        self.agent = agent

    def get_result(self, obj):
        latest_closed_game = Spin.objects.filter(status='CLOSED').order_by('-created_at').first()
        if latest_closed_game:
            return GameSerializer(latest_closed_game).data
        else:
            return []

    def get_recent(self, obj):
        closed_games_with_results = Spin.objects.filter(status='CLOSED').order_by('-created_at')[:10]  # .exclude(id=latest_closed_game.pk)
        if closed_games_with_results:
            return RecentGameSerializer(closed_games_with_results, many=True, context={'agent': self.agent}).data
        else:
            return [{
                "id": "0",
                "gameNumber": 0,
                "createdAt": "2024-04-04T01:23:07.780007Z",
                "status": "CLOSED",
                "gameResult":[]
            }]

    def get_openGame(self, obj):
        latest_open_game = Spin.objects.filter(status='OPEN').order_by('-created_at').first()
        if latest_open_game:
            return OpenGameSerializer(latest_open_game).data
        else:
            return {
                "id": "0",
                "gameNumber": 0,
                "createdAt": "2024-04-04T01:23:07.780007Z",
                "status": "CLOSED",
                "gameResult":[]
            }

class GameOpenSerializer(serializers.Serializer):
    openGame = serializers.SerializerMethodField()
    recent = serializers.SerializerMethodField()

    def __init__(self, *args, **kwargs):
        agent = kwargs.pop('context', {}).get('agent')
        super().__init__(*args, **kwargs)
        self.agent = agent

    def get_openGame(self, obj):
        latest_open_game = Spin.objects.filter(status='OPEN').order_by('-created_at').first()
        if latest_open_game:
            return OpenGameSerializer(latest_open_game).data
        else:
            return {
                "id": "0",
                "gameNumber": 0,
                "createdAt": "2024-04-04T01:23:07.780007Z",
                "status": "CLOSED",
                "gameResult":[]
            }

    def get_recent(self, obj):
        closed_games_with_results = Spin.objects.filter(status='CLOSED').order_by('-created_at')[:10]  # .exclude(id=latest_closed_game.pk)
        if closed_games_with_results:
            return RecentGameSerializer(closed_games_with_results, many=True, context={'agent': self.agent}).data
        else:
            return [{
                "id": "0",
                "gameNumber": 0,
                "createdAt": "2024-04-04T01:23:07.780007Z",
                "status": "CLOSED",
                "gameResult":[]
            }]

