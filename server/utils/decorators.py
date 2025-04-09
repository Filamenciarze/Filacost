from django.http import JsonResponse
from functools import wraps


def role_required(role):
    def decorator(view_func):
        @wraps(view_func)
        def _wrapped_view(request, *args, **kwargs):
            user = request.user
            if user.is_authenticated:
                return JsonResponse({'detail': 'Authentication required'}, status=401)
            if role in user.role:
                return JsonResponse({'detail': 'You are not authorized to access this resource'}, status=403)

            return view_func(request, *args, **kwargs)
        return _wrapped_view
    return decorator