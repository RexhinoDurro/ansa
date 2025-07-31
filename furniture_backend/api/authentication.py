# furniture_backend/api/authentication.py (Fixed)
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.views import APIView
from django.middleware.csrf import get_token
import json

class AdminAuthenticationMixin:
    """Mixin for admin-only views"""
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated, IsAdminUser]

class CsrfExemptSessionAuthentication(SessionAuthentication):
    """Session authentication without CSRF for API endpoints"""
    def enforce_csrf(self, request):
        return  # Skip CSRF check

@method_decorator(csrf_exempt, name='dispatch')
class AdminLoginView(APIView):
    """Admin login endpoint"""
    authentication_classes = [CsrfExemptSessionAuthentication]
    
    def post(self, request):
        try:
            # Handle both JSON and form data
            if request.content_type == 'application/json':
                data = json.loads(request.body)
            else:
                data = request.data
                
            username = data.get('username')
            password = data.get('password')
            
            if not username or not password:
                return Response({
                    'error': 'Username and password are required'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            user = authenticate(request, username=username, password=password)
            
            if user and user.is_active and user.is_staff:
                login(request, user)
                
                # Get CSRF token for future requests
                csrf_token = get_token(request)
                
                return Response({
                    'message': 'Login successful',
                    'csrf_token': csrf_token,
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email,
                        'first_name': user.first_name,
                        'last_name': user.last_name,
                        'is_superuser': user.is_superuser
                    }
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'error': 'Invalid credentials or insufficient permissions'
                }, status=status.HTTP_401_UNAUTHORIZED)
                
        except json.JSONDecodeError:
            return Response({
                'error': 'Invalid JSON data'
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                'error': 'An error occurred during login',
                'detail': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AdminLogoutView(APIView):
    """Admin logout endpoint"""
    authentication_classes = [CsrfExemptSessionAuthentication]
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        logout(request)
        return Response({
            'message': 'Logout successful'
        }, status=status.HTTP_200_OK)

class AdminProfileView(APIView):
    """Get current admin user profile"""
    authentication_classes = [CsrfExemptSessionAuthentication]
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def get(self, request):
        user = request.user
        return Response({
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'is_superuser': user.is_superuser,
                'date_joined': user.date_joined,
                'last_login': user.last_login
            }
        }, status=status.HTTP_200_OK)

# CSRF token endpoint for getting CSRF token if needed
@method_decorator(csrf_exempt, name='dispatch')
class CSRFTokenView(APIView):
    """Get CSRF token"""
    
    def get(self, request):
        csrf_token = get_token(request)
        return Response({
            'csrf_token': csrf_token
        })