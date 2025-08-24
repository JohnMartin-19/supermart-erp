from rest_framework_simplejwt.authentication import JWTAuthentication
from django.db import connection
from rest_framework.exceptions import AuthenticationFailed


class TenantJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        auth_data = super().authenticate(request)
        if auth_data is None:
            return None

        user, token = auth_data

        token_schema = token.payload.get('tenant_schema')
        if token_schema and token_schema != connection.schema_name:
            raise AuthenticationFailed('Token is not valid for this tenant.')
        return user, token