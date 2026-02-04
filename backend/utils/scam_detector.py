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
    else:
        risk = 'BARGAIN'
        message = '⭐ GREAT DEAL: Price below market average!'
        color = '#3B82F6'  # Blue
        is_scam = False
    
    return {
        'risk_level': risk,
        'deviation_percent': round(deviation, 1),
        'message': message,
        'color': color,
        'is_scam': is_scam
    }


if __name__ == "__main__":
    # Test scam detection
    print("Testing Scam Detection Algorithm\n")
    
    test_cases = [
        (10000000, 7000000, "Severely overpriced"),
        (8500000, 7000000, "High risk"),
        (7800000, 7000000, "Medium risk"),
        (7200000, 7000000, "Fair price"),
        (6500000, 7000000, "Bargain"),
    ]
    
    for listed, predicted, description in test_cases:
        result = detect_scam(listed, predicted)
        print(f"{description}:")
        print(f"  Listed: ₹{listed:,} | Predicted: ₹{predicted:,}")
        print(f"  Risk: {result['risk_level']} ({result['deviation_percent']}%)")
        print(f"  {result['message']}\n")
