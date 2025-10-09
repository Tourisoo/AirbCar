from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from .serializers import UserSerializer

User = get_user_model()

class PartnerViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing partners (users with is_partner=True)
    """
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """
        Return only users who are partners
        """
        return User.objects.filter(is_partner=True).order_by('-date_joined')
    
    def list(self, request, *args, **kwargs):
        """
        List all partners with additional partner-specific data
        """
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        
        # Add partner-specific data like listings count
        partner_data = []
        for partner in serializer.data:
            partner_info = dict(partner)
            # Count listings for this partner if you have a listings model
            # partner_info['listings_count'] = Listing.objects.filter(partner_id=partner['id']).count()
            partner_info['listings_count'] = 0  # Placeholder until you have listings model
            partner_data.append(partner_info)
        
        return Response(partner_data)
    
    @action(detail=True, methods=['post'])
    def toggle_status(self, request, pk=None):
        """
        Toggle partner active status
        """
        partner = self.get_object()
        partner.is_active = not partner.is_active
        partner.save()
        return Response({
            'status': 'success',
            'is_active': partner.is_active,
            'message': f'Partner {"activated" if partner.is_active else "deactivated"} successfully'
        })
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """
        Get partner statistics
        """
        queryset = self.get_queryset()
        active_partners = queryset.filter(is_active=True).count()
        total_partners = queryset.count()
        
        return Response({
            'total_partners': total_partners,
            'active_partners': active_partners,
            'inactive_partners': total_partners - active_partners,
        })