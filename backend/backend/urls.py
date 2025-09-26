from django.contrib import admin
from django.urls import path, include
from api.views import CreateUserView, HealthCheckView
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
schema_view=get_schema_view(

    openapi.Info(
        title="Rectify Learn API",
        default_version='v1',
        description="Rectify Learn API Documentation",
        contact=openapi.Contact(email="rectifylearn@gmail.com"),
        license=openapi.License(name="Academic License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)


urlpatterns = [
    path('swagger<format>/',schema_view.without_ui(cache_timeout=0),name='schema-json'),
    path('',schema_view.with_ui('swagger',cache_timeout=0),name='schema-swagger-ui'),
    path('redoc/',schema_view.with_ui('redoc',cache_timeout=0),name='schema-redoc'),


    path("health/", HealthCheckView.as_view(), name="health_check"),
    path("admin/", admin.site.urls),
    # disabled the registration endpoint for now
    # path("api/user/register/",CreateUserView.as_view(),name="register"),
    # path("api-auth/",include("rest_framework.urls")),
    path("api/",include("api.urls")),
]
