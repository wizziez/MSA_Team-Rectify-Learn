import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework import authentication, exceptions

User = get_user_model()

class SupabaseJWTAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization', '')
        
        if not auth_header.startswith('Bearer '):
            return None
            
        token = auth_header.split(' ')[1]

        try:
            payload = jwt.decode(
                token,
                settings.SUPABASE_JWT_SECRET,
                algorithms=['HS256'],
                audience='authenticated',
                options={'verify_iss': False}
            )
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed('Token expired')
        except jwt.InvalidTokenError:
            raise exceptions.AuthenticationFailed('Invalid token')

        try:
            user = User.objects.get(username=payload['sub'])
        except User.DoesNotExist:
            user = User.objects.create_user(
                username=payload['sub'],
                email=payload.get('email', ''),
                first_name=payload.get('user_metadata', {}).get('first_name', ''),
                last_name=payload.get('user_metadata', {}).get('last_name', '')
            )
            user.set_unusable_password()
            user.save()

        return (user, None)
