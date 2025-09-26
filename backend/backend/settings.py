import os
from dotenv import load_dotenv
from pathlib import Path
import dj_database_url

load_dotenv()

# Supabase configuration
SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET")
SUPABASE_URL = os.getenv("SUPABASE_URL")


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/


SECRET_KEY = os.getenv("DJANGO_SECRET_KEY")
ENVIRONMENT = os.getenv("ENV")
print(f"Environment: {ENVIRONMENT}")
# SECURITY WARNING: don't run with debug turned on in production!

if ENVIRONMENT == "local":
    DEBUG = True
    ALLOWED_HOSTS = ["*"]
elif ENVIRONMENT == "testing":
    DEBUG = True
    ALLOWED_HOSTS = ["academic-comeback-backend.onrender.com"]
        # Add these to ensure HTTPS and Swagger work correctly
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

    SWAGGER_SETTINGS = {
        'DEFAULT_API_URL': 'https://academic-comeback-backend.onrender.com',
    }

else:
    DEBUG = False
    allowed_hosts_str = os.getenv('ALLOWED_HOSTS')
    ALLOWED_HOSTS = [host.strip() for host in allowed_hosts_str.split(',')]

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework.authentication.SessionAuthentication",
        "backend.supabase_auth.SupabaseJWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ]
}
# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "api",
    "rest_framework",
    "corsheaders",
    "drf_yasg",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "corsheaders.middleware.CorsMiddleware",
]

ROOT_URLCONF = "backend.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "backend.wsgi.application"


# Database configuration based on environment

USE_CLOUD_DB = os.getenv('USE_CLOUD_DB', 'False').lower() == 'true'

if USE_CLOUD_DB:
    # Cloud database configuration
    db_url = os.getenv('DATABASE_URL')
    DATABASES = {'default': dj_database_url.parse(db_url)}
else:
    # Local/default database configuration
    DATABASES = {
        "default": {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.getenv('DB_NAME'),
            'USER': os.getenv('DB_USER'),
            'PASSWORD': os.getenv('DB_PASSWORD'),
            'HOST': os.getenv('DB_HOST'),
            'PORT': os.getenv('DB_PORT'),
        }
    }


# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/

STATIC_URL = "static/"

# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

if ENVIRONMENT == 'local':
    CORS_ALLOW_ALL_ORIGINS = True
    CORS_ALLOW_CREDENTIALS = True
    CSRF_TRUSTED_ORIGINS = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "https://academic-comeback-backend.onrender.com",
        "https://academic-comeback.onrender.com",
        # Add any other domains that will make requests to your API
    ]
elif ENVIRONMENT == 'testing':
    CORS_ALLOW_ALL_ORIGINS = True
    CORS_ALLOW_CREDENTIALS = True
    CSRF_TRUSTED_ORIGINS = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "https://academic-comeback-backend.onrender.com",
        "https://academic-comeback.onrender.com",
        # Add any other domains that will make requests to your API
    ]

else:
    # For production, it's safer to specify exact origins
    cors_origins_str = os.getenv('CORS_ALLOWED_ORIGINS', '')
    if cors_origins_str:
        CORS_ALLOWED_ORIGINS = [origin.strip() for origin in cors_origins_str.split(',')]
    CSRF_TRUSTED_ORIGINS = CORS_ALLOWED_ORIGINS.copy()
    CORS_ALLOW_CREDENTIALS = True
