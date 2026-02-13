from PIL import Image, ImageDraw, ImageFont
import os

def create_icon(size, filename):
    # Colors
    bg_color = "#6366f1" # Purple (Indigo-500)
    icon_color = "#ffffff" # White

    # Create image
    img = Image.new('RGB', (size, size), color=bg_color)
    draw = ImageDraw.Draw(img)

    # Calculate dimensions
    center = size // 2
    radius = size // 3

    # Draw Crescent Moon
    # Outer circle
    draw.ellipse((center - radius, center - radius, center + radius, center + radius), fill=icon_color)
    # Inner circle (mask to make it a crescent)
    offset = size // 10
    draw.ellipse((center - radius + offset, center - radius - offset, center + radius + offset, center + radius - offset), fill=bg_color)

    # Draw Simple Book (Rectangle at bottom right)
    book_w = size // 2.5
    book_h = size // 3.5
    book_x = center - (book_w // 2) + (size // 6)
    book_y = center + (size // 8)
    
    # Draw book cover
    draw.rectangle([book_x, book_y, book_x + book_w, book_y + book_h], fill=icon_color, outline=bg_color, width=size//40)
    
    # Draw book spine detail
    draw.line([book_x + (book_w//5), book_y, book_x + (book_w//5), book_y + book_h], fill=bg_color, width=size//40)

    # Save
    path = os.path.join('public', filename)
    img.save(path)
    print(f"Created {filename} at {path}")

# Ensure public dir exists
if not os.path.exists('public'):
    os.makedirs('public')

create_icon(192, 'icon-192.png')
create_icon(512, 'icon-512.png')
