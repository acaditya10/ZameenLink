"""
Image Analyzer for Scam Detection
Heuristic-based image quality and metadata analysis
No heavy ML dependencies - uses basic checks
"""

import base64
import struct


def analyze_images(image_data_list=None, image_count=0):
    """
    Analyze property images for scam indicators.
    
    Args:
        image_data_list: List of base64-encoded image strings (optional)
        image_count: Number of images provided (if not sending actual data)
    
    Returns:
        dict with image_risk_score (0-100), flags, recommendations
    """
    flags = []
    risk_score = 0
    
    actual_count = len(image_data_list) if image_data_list else image_count
    
    # Check 1: Number of images
    if actual_count == 0:
        flags.append({
            'issue': 'No images provided',
            'severity': 'high',
            'detail': 'Legitimate listings typically include 3-10 photos'
        })
        risk_score += 30
    elif actual_count == 1:
        flags.append({
            'issue': 'Only 1 image provided',
            'severity': 'medium',
            'detail': 'Single-image listings are more suspicious'
        })
        risk_score += 15
    elif actual_count < 3:
        flags.append({
            'issue': 'Few images provided',
            'severity': 'low',
            'detail': f'Only {actual_count} images. Good listings have 5+ photos'
        })
        risk_score += 5
    
    # Check 2: If actual image data is provided, analyze each
    if image_data_list:
        for i, img_b64 in enumerate(image_data_list[:5]):  # Max 5 images
            img_flags = _analyze_single_image(img_b64, i + 1)
            flags.extend(img_flags)
            for f in img_flags:
                if f['severity'] == 'high':
                    risk_score += 15
                elif f['severity'] == 'medium':
                    risk_score += 8
                else:
                    risk_score += 3
    
    # Cap at 100
    risk_score = min(risk_score, 100)
    
    # Recommendations
    recommendations = []
    if risk_score >= 40:
        recommendations.append('Request additional property photos from multiple angles')
        recommendations.append('Ask for recent photos with date verification')
    if risk_score >= 20:
        recommendations.append('Visit the property in person before proceeding')
    if actual_count < 3:
        recommendations.append('Request interior, exterior, and neighborhood photos')
    
    return {
        'image_risk_score': risk_score,
        'images_analyzed': actual_count,
        'flags': flags,
        'recommendations': recommendations
    }


def _analyze_single_image(img_b64, index):
    """
    Analyze a single base64-encoded image.
    
    Returns list of flag dicts.
    """
    flags = []
    
    try:
        # Decode base64
        # Handle data URI format
        if ',' in img_b64:
            img_b64 = img_b64.split(',')[1]
        
        img_bytes = base64.b64decode(img_b64)
        
        # Check file size
        size_kb = len(img_bytes) / 1024
        
        if size_kb < 10:
            flags.append({
                'issue': f'Image {index}: Very small file size ({size_kb:.0f} KB)',
                'severity': 'high',
                'detail': 'May be a low-quality screenshot or placeholder'
            })
        elif size_kb < 50:
            flags.append({
                'issue': f'Image {index}: Small file size ({size_kb:.0f} KB)',
                'severity': 'medium',
                'detail': 'Lower quality than expected for property photos'
            })
        
        # Check image dimensions if JPEG
        dims = _get_jpeg_dimensions(img_bytes)
        if dims:
            width, height = dims
            if width < 400 or height < 300:
                flags.append({
                    'issue': f'Image {index}: Low resolution ({width}x{height})',
                    'severity': 'medium',
                    'detail': 'Professional listings use higher resolution images'
                })
            
            # Check if image is too uniform in aspect ratio (possible stock)
            ratio = width / height if height > 0 else 0
            if abs(ratio - 1.0) < 0.01:  # Perfect square
                flags.append({
                    'issue': f'Image {index}: Perfect square aspect ratio',
                    'severity': 'low',
                    'detail': 'May be a cropped or stock image'
                })
    
    except Exception:
        flags.append({
            'issue': f'Image {index}: Could not be processed',
            'severity': 'low',
            'detail': 'Image format not recognized or corrupted'
        })
    
    return flags


def _get_jpeg_dimensions(data):
    """Extract dimensions from JPEG data."""
    try:
        # Check for JPEG magic bytes
        if data[:2] != b'\xff\xd8':
            # Try PNG
            if data[:8] == b'\x89PNG\r\n\x1a\n':
                width = struct.unpack('>I', data[16:20])[0]
                height = struct.unpack('>I', data[20:24])[0]
                return (width, height)
            return None
        
        # Parse JPEG markers
        i = 2
        while i < len(data) - 1:
            if data[i] != 0xFF:
                break
            marker = data[i + 1]
            
            if marker in (0xC0, 0xC2):  # SOF0, SOF2
                height = struct.unpack('>H', data[i+5:i+7])[0]
                width = struct.unpack('>H', data[i+7:i+9])[0]
                return (width, height)
            
            if marker == 0xD9:  # EOI
                break
            
            if marker in (0xD0, 0xD1, 0xD2, 0xD3, 0xD4, 0xD5, 0xD6, 0xD7, 0xD8, 0x01):
                i += 2
            else:
                length = struct.unpack('>H', data[i+2:i+4])[0]
                i += 2 + length
        
        return None
    except Exception:
        return None


if __name__ == "__main__":
    # Test with no images
    result = analyze_images(image_count=0)
    print(f"No images risk: {result['image_risk_score']}/100")
    print(f"Flags: {result['flags']}")
    
    # Test with count only
    result = analyze_images(image_count=5)
    print(f"\n5 images risk: {result['image_risk_score']}/100")
    print(f"Flags: {result['flags']}")
