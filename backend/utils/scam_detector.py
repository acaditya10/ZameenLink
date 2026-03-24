"""
Scam Detection Algorithm
Analyzes price deviation and returns risk assessment
"""


def detect_scam(listed_price, predicted_fair_value):
    """
    Analyzes price deviation and returns risk assessment
    
    Args:
        listed_price: Price shown in listing
        predicted_fair_value: ML model's prediction
    
    Returns:
        dict with risk_level, deviation_percent, message, color, is_scam
    """
    if listed_price <= 0 or predicted_fair_value <= 0:
        return {
            'risk_level': 'UNKNOWN',
            'deviation_percent': 0,
            'message': 'Invalid price data',
            'color': '#6B7280',
            'is_scam': False
        }
    
    # Calculate deviation percentage
    deviation = ((listed_price - predicted_fair_value) / predicted_fair_value) * 100
    
    # Determine risk level
    if deviation > 30:
        risk = 'CRITICAL'
        message = '⚠️ SCAM ALERT: Property is severely overpriced. Avoid this deal!'
        color = '#DC2626'  # Red
        is_scam = True
    elif deviation > 20:
        risk = 'HIGH'
        message = '⚠️ HIGH RISK: Price is significantly above market rate'
        color = '#EA580C'  # Orange
        is_scam = True
    elif deviation > 10:
        risk = 'MEDIUM'
        message = '⚡ CAUTION: Slightly overpriced, negotiate strongly'
        color = '#F59E0B'  # Yellow
        is_scam = False
    elif deviation > -5:
        risk = 'LOW'
        message = '✓ FAIR PRICE: Within acceptable market range'
        color = '#10B981'  # Green
        is_scam = False
    elif deviation > -30:
        risk = 'BARGAIN'
        message = '⭐ GREAT DEAL: Price below market average!'
        color = '#3B82F6'  # Blue
        is_scam = False
    else:
        risk = 'SUSPICIOUSLY LOW'
        message = '⚠️ HIGH RISK: Price is suspiciously low. Verify title/documents!'
        color = '#BE123C'  # Rose-700
        is_scam = True
    
    return {
        'risk_level': risk,
        'deviation_percent': round(deviation, 1),
        'message': message,
        'color': color,
        'is_scam': is_scam
    }


def detect_scam_enhanced(listed_price, predicted_fair_value, description=None, image_data=None, image_count=0):
    """
    Enhanced scam detection combining price, NLP, and image analysis.
    
    Args:
        listed_price: Price shown in listing
        predicted_fair_value: ML model's prediction
        description: Optional property description text
        image_data: Optional list of base64 image strings
        image_count: Number of images if not sending actual data
    
    Returns:
        dict with composite risk assessment and signal breakdown
    """
    from utils.nlp_analyzer import analyze_text
    from utils.image_analyzer import analyze_images
    
    # 1. Price analysis (weight: 50%)
    price_result = detect_scam(listed_price, predicted_fair_value)
    
    # Convert price risk_level to a 0-100 score
    price_score_map = {
        'CRITICAL': 90,
        'HIGH': 70,
        'SUSPICIOUSLY LOW': 75,
        'MEDIUM': 40,
        'LOW': 10,
        'BARGAIN': 5,
        'UNKNOWN': 0
    }
    price_score = price_score_map.get(price_result['risk_level'], 0)
    
    # 2. Text analysis (weight: 30%)
    text_result = analyze_text(description) if description else {
        'text_risk_score': 0,
        'flagged_phrases': [],
        'positive_signals': [],
        'analysis_summary': 'No description provided'
    }
    text_score = text_result['text_risk_score']
    
    # 3. Image analysis (weight: 20%)
    image_result = analyze_images(image_data, image_count)
    image_score = image_result['image_risk_score']
    
    # Composite score
    composite_score = (price_score * 0.50) + (text_score * 0.30) + (image_score * 0.20)
    
    # Determine composite risk level
    if composite_score >= 70:
        composite_risk = 'CRITICAL'
        composite_message = '⚠️ SCAM ALERT: Multiple high-risk signals detected across price, text, and images'
        composite_color = '#DC2626'
        composite_is_scam = True
    elif composite_score >= 50:
        composite_risk = 'HIGH'
        composite_message = '⚠️ HIGH RISK: Significant warning signs found'
        composite_color = '#EA580C'
        composite_is_scam = True
    elif composite_score >= 30:
        composite_risk = 'MEDIUM'
        composite_message = '⚡ CAUTION: Some warning signs detected - proceed carefully'
        composite_color = '#F59E0B'
        composite_is_scam = False
    elif composite_score >= 10:
        composite_risk = 'LOW'
        composite_message = '✓ LOW RISK: Minor concerns, generally looks legitimate'
        composite_color = '#10B981'
        composite_is_scam = False
    else:
        composite_risk = 'SAFE'
        composite_message = '✓ SAFE: No significant risk signals detected'
        composite_color = '#10B981'
        composite_is_scam = False
    
    return {
        'risk_level': composite_risk,
        'composite_score': round(composite_score, 1),
        'message': composite_message,
        'color': composite_color,
        'is_scam': composite_is_scam,
        'breakdown': {
            'price_analysis': {
                'score': price_score,
                'weight': '50%',
                'risk_level': price_result['risk_level'],
                'deviation_percent': price_result['deviation_percent'],
                'message': price_result['message']
            },
            'text_analysis': {
                'score': text_score,
                'weight': '30%',
                'flagged_phrases': text_result['flagged_phrases'],
                'positive_signals': text_result['positive_signals'],
                'summary': text_result['analysis_summary']
            },
            'image_analysis': {
                'score': image_score,
                'weight': '20%',
                'images_analyzed': image_result['images_analyzed'],
                'flags': image_result['flags'],
                'recommendations': image_result['recommendations']
            }
        },
        # Also include the original simple result for backward compatibility
        'deviation_percent': price_result['deviation_percent']
    }


if __name__ == "__main__":
    # Test basic scam detection
    print("Testing Basic Scam Detection\n")
    
    test_cases = [
        (10000000, 7000000, "Severely overpriced"),
        (8500000, 7000000, "High risk"),
        (7200000, 7000000, "Fair price"),
    ]
    
    for listed, predicted, description in test_cases:
        result = detect_scam(listed, predicted)
        print(f"{description}: {result['risk_level']} ({result['deviation_percent']}%)")
    
    # Test enhanced detection
    print("\n\nTesting Enhanced Scam Detection\n")
    result = detect_scam_enhanced(
        10000000, 7000000,
        description="Urgent sale! Cash only, no documents needed.",
        image_count=0
    )
    print(f"Composite: {result['risk_level']} (Score: {result['composite_score']})")
    print(f"  Price: {result['breakdown']['price_analysis']['score']}")
    print(f"  Text:  {result['breakdown']['text_analysis']['score']}")
    print(f"  Image: {result['breakdown']['image_analysis']['score']}")

