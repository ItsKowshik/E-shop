from cgi import print_environ
from itertools import count, product
from math import prod
from unicodedata import category
from django.shortcuts import render
from rest_framework import serializers
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from django.utils import timezone
from base.models import Product, Review
from base.serializers import ProductSerializer


from rest_framework import status
# Create your views here.


@api_view(['GET'])
def get_products(request):
    query = request.query_params.get('keysearch')
    if query == None:
        query = ''

    # if the title here, the name of the product contains any values inside of that query, it's going to go ahead and filter it and return those products
    products = Product.objects.filter(name__icontains=query)
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_last_products(request):
    products = Product.objects.filter().order_by('-created')[:3]
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_product(request, pk):
    product = Product.objects.get(_id=pk)
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def create_new_product(request):
    user = request.user
    product = Product.objects.create(
        user=user,
        name='Example of name',
        price=0,
        brand='Example of brand',
        count_in_stock=0,
        category='Example of category',
        description=''
    )
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def update_product(request, pk):
    data = request.data
    product = Product.objects.get(_id=pk)

    product.name = data['name']
    product.brand = data['brand']
    product.category = data['category']
    product.description = data['description']
    product.price = data['price']
    product.count_in_stock = data['count_in_stock']

    product.save()

    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_product(request, pk):
    product_for_delete = Product.objects.get(_id=pk)
    product_for_delete.delete()
    return Response('Product was deleted')


@api_view(['POST'])
def upload_image(request):
    data = request.data
    # when i send that to the frontend, i want to call that 'product_id'
    product_id = data['product_id']
    product = Product.objects.get(_id=product_id)

    # Need to send some form data from the front end
    # Need to use multiplatform data when we send it.
    product.image = request.FILES.get('image')
    product.save()

    return Response('Image was uploaded')


@api_view(['POST'])
@permission_classes([IsAuthenticated])
# pk is going to pass into the url parameters
def create_product_review(request, pk):
    product = Product.objects.get(_id=pk)
    user = request.user
    data = request.data

    # 1 step. Review already exist. If user already wrote review, i shouldnt allow hom to write more reviews to 1 product.
    # if a user exists with value for product, we can add in the function exists.
    already_exists = product.review_set.filter(user=user).exists()
    if already_exists:
        # back in an error message
        content = {'detail': 'Product already reviewed'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)

    # 2 step. User submitted review with 0 rating. Checking by rating value
    elif data['rating'] == 0:
        content = {'detail': 'Select a rating'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)

    # 3 step. Creating review
    else:
        review = Review.objects.create(
            user=user,
            product=product,
            name=user.first_name,
            rating=data['rating'],
            comment=data['comment']
        )

        reviews = product.review_set.all()
        product.num_reviews = len(reviews)

        total = 0
        for i in reviews:
            total += i.rating

        product.rating = total / len(reviews)
        product.save()

        return Response('Review added')
