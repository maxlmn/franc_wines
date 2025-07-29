#!/usr/bin/env python3
"""
Script to analyze the colors in the Franc Wines logo
"""

try:
    from PIL import Image
    import numpy as np
    
    # Open the logo image
    img = Image.open('docs/images/logo.png')
    img_array = np.array(img)
    
    # Get unique colors
    if len(img_array.shape) == 3:  # RGB or RGBA
        colors = np.unique(img_array.reshape(-1, img_array.shape[-1]), axis=0)
        print("All unique colors in logo:")
        print(f"Total colors found: {len(colors)}")
        
        # Show first 50 colors
        for i, color in enumerate(colors[:50]):
            if len(color) == 4:  # RGBA
                r, g, b, a = color
                print(f"Color {i+1}: RGBA({r}, {g}, {b}, {a}) - Hex: #{r:02x}{g:02x}{b:02x}")
            else:  # RGB
                r, g, b = color
                print(f"Color {i+1}: RGB({r}, {g}, {b}) - Hex: #{r:02x}{g:02x}{b:02x}")
        
        # Find non-black colors
        print("\nNon-black colors (RGB > 10):")
        non_black_colors = []
        for color in colors:
            if len(color) == 4:
                r, g, b, a = color
            else:
                r, g, b = color
                a = 255
            
            if r > 10 or g > 10 or b > 10:
                non_black_colors.append((r, g, b, a))
                print(f"RGB({r}, {g}, {b}) - Hex: #{r:02x}{g:02x}{b:02x}")
        
        print(f"\nFound {len(non_black_colors)} non-black colors")
        
    else:
        print("Image is grayscale")
        
except Exception as e:
    print(f"Error analyzing logo: {e}") 