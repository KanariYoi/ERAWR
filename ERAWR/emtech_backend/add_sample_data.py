#!/usr/bin/env python
import os
import sys
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'emtech_backend.settings')
django.setup()

from accounts.models import Service, AddOn, Bundle

def add_sample_data():
    # Clear existing data
    Service.objects.all().delete()
    AddOn.objects.all().delete()
    Bundle.objects.all().delete()
    
    # Add Services
    services = [
        {
            'name': 'Basic Cleaning',
            'price': 299.00,
            'description': 'Our Basic Cleaning service is perfect for everyday maintenance. We focus on surface-level dirt and stains to bring back your shoes\' fresh and clean appearance.'
        },
        {
            'name': 'Deep Cleaning',
            'price': 499.00,
            'description': 'For shoes that need more than just a touch-up, our Deep Cleaning dives into every detail. We clean the uppers, midsoles, outsoles, laces, and insoles.'
        },
        {
            'name': 'Suede & Nubuck Care',
            'price': 599.00,
            'description': 'Delicate materials need delicate care. Our Suede & Nubuck Care service is tailored to protect and restore texture without damaging the material.'
        },
        {
            'name': 'Premium Klean Essential',
            'price': 799.00,
            'description': 'Our Premium Klean Essential offers a thorough inside-out refresh of your shoes, with odor elimination, plus a free dust bag and silica gel to keep them fresh and protected.'
        },
        {
            'name': 'Premium Klean: Suede & Nubuck Care',
            'price': 899.00,
            'description': 'Our Premium Suede & Nubuck Care gently revives delicate materials with specialized cleaning and soft-brush techniques, with odor elimination, silica gel, and dust bag.'
        }
    ]
    
    for service_data in services:
        Service.objects.create(**service_data)
    
    # Add Add-ons
    addons = [
        {
            'name': 'Sole Whitening',
            'price': 199.00,
            'description': 'Oxidation treatment to bring back that icy or clean white sole.'
        },
        {
            'name': 'Crease Removal',
            'price': 299.00,
            'description': 'Reduces visible toe creases and restores a smoother, well-kept look to your shoes.'
        },
        {
            'name': 'Odor Elimination',
            'price': 149.00,
            'description': 'Kills bacteria, removes bad smell, and refreshes the shoe interior/insole.'
        },
        {
            'name': 'Water & Stain Repellent Coating',
            'price': 249.00,
            'description': 'Invisible barrier to protect against spills, rain, and dust.'
        },
        {
            'name': 'Leather Conditioning',
            'price': 199.00,
            'description': 'Disinfects, cleans, conditions leather shoes, restores shine, and no greasy finish.'
        },
        {
            'name': 'Sole Shield Installation / Pair',
            'price': 399.00,
            'description': 'Transparent protection to prevent outsole from wear.'
        }
    ]
    
    for addon_data in addons:
        AddOn.objects.create(**addon_data)
    
    # Add Bundles (Essentials)
    bundles = [
        {
            'name': 'Sneaker Wipes',
            'price': 99.00,
            'description': 'Quick, on-the-go cleaning for light dirt and stains.'
        },
        {
            'name': 'Silica Gel',
            'price': 79.00,
            'description': 'Absorbs moisture, prevents mold, and keeps shoes fresh and dry.'
        },
        {
            'name': 'Drawstring Bag',
            'price': 129.00,
            'description': 'Protects your shoes from dust and moisture.'
        },
        {
            'name': 'Shoe Tree',
            'price': 199.00,
            'description': 'Maintain the shape and prevent creasing of your sneakers.'
        },
        {
            'name': 'Crease Protector',
            'price': 149.00,
            'description': 'Prevent toe box creases and keep your sneakers looking new and flawless.'
        }
    ]
    
    for bundle_data in bundles:
        Bundle.objects.create(**bundle_data)
    
    print("Sample data added successfully!")
    print(f"Added {Service.objects.count()} services")
    print(f"Added {AddOn.objects.count()} add-ons")
    print(f"Added {Bundle.objects.count()} bundles")

if __name__ == '__main__':
    add_sample_data() 