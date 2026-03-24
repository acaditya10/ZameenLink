"""
NLP Text Analyzer for Scam Detection
Rule-based keyword and pattern matching for property descriptions
"""

import re

# Red-flag patterns that indicate potential scams
RED_FLAG_PATTERNS = [
    # Urgency pressure
    (r'\burgent\s*(sale|sell|selling)\b', 'Urgent sale pressure', 15),
    (r'\b(hurry|limited\s*time|act\s*fast|act\s*now)\b', 'Urgency tactics', 12),
    (r'\b(today\s*only|last\s*chance|closing\s*soon)\b', 'Time pressure', 12),
    
    # Suspicious payment terms
    (r'\bcash\s*only\b', 'Cash-only payment demand', 20),
    (r'\bno\s*(cheque|check|bank\s*transfer)\b', 'Rejects traceable payment', 18),
    (r'\b(advance|token)\s*(money|amount|payment)\s*(required|needed|must)\b', 'Advance payment demand', 15),
    
    # Document red flags
    (r'\bno\s*documents?\s*(needed|required|necessary)\b', 'No documentation required', 25),
    (r'\b(without|no)\s*(registration|registry)\b', 'No registration mentioned', 20),
    (r'\b(no|without)\s*(paperwork|paper\s*work)\b', 'No paperwork needed', 18),
    
    # Price manipulation
    (r'\b(below|under)\s*market\b', 'Claims below market rate', 10),
    (r'\b(guaranteed|assured)\s*(returns?|profit|appreciation)\b', 'Guaranteed returns claim', 15),
    (r'\b(100|200|300)%\s*(return|profit|growth)\b', 'Unrealistic return claims', 20),
    (r'\b(investment|invest)\s*(opportunity|chance)\b', 'Investment scheme language', 8),
    
    # Identity hiding
    (r'\b(no\s*broker|direct\s*deal|no\s*commission)\b', 'Anti-broker language', 5),
    (r'\b(confidential|secret|private)\s*(deal|sale|offer)\b', 'Secretive dealing', 12),
    (r'\b(don\'?t\s*tell|keep\s*quiet|between\s*us)\b', 'Secrecy request', 15),
    
    # Too good to be true
    (r'\b(steal|giveaway|throwaway)\s*(price|deal|rate)\b', 'Too-good-to-be-true language', 10),
    (r'\b(lowest|cheapest)\s*(in|of)\s*(city|area|market|town)\b', 'Superlative price claims', 8),
    (r'\b(never\s*before|once\s*in\s*lifetime|dream)\s*(offer|price|deal)\b', 'Hyperbolic claims', 10),
]

# Positive signals that increase trust
POSITIVE_PATTERNS = [
    (r'\brera\s*(registered|approved|certified|compliant|number|id)\b', 'RERA registered', 15),
    (r'\brera\s*#?\s*\d+', 'RERA number provided', 20),
    (r'\b(approved|sanctioned)\s*(by|from)\s*(bank|hdfc|sbi|icici|axis)\b', 'Bank approved', 12),
    (r'\b(clear|clean)\s*title\b', 'Clear title mentioned', 10),
    (r'\b(freehold|free\s*hold)\b', 'Freehold property', 8),
    (r'\b(occupation|completion|possession)\s*certificate\b', 'OC/CC mentioned', 12),
    (r'\b(builder|developer)\s*:\s*\w+', 'Builder name provided', 8),
    (r'\b(gated\s*community|security|cctv)\b', 'Security features', 5),
    (r'\b(municipality|nagar\s*nigam|gram\s*panchayat)\s*(approved|sanctioned)\b', 'Government approved', 10),
    (r'\b(map|layout)\s*(approved|sanctioned)\b', 'Plan approved', 10),
]


def analyze_text(description):
    """
    Analyze property description text for scam indicators.
    
    Args:
        description: Property description text (string)
    
    Returns:
        dict with text_risk_score (0-100), flagged_phrases,
        positive_signals, analysis_summary
    """
    if not description or not isinstance(description, str):
        return {
            'text_risk_score': 0,
            'flagged_phrases': [],
            'positive_signals': [],
            'analysis_summary': 'No description provided'
        }
    
    text = description.lower().strip()
    
    # Check red flags
    flagged = []
    total_risk = 0
    
    for pattern, label, weight in RED_FLAG_PATTERNS:
        matches = re.findall(pattern, text, re.IGNORECASE)
        if matches:
            flagged.append({
                'phrase': label,
                'severity': 'high' if weight >= 15 else 'medium' if weight >= 10 else 'low',
                'weight': weight
            })
            total_risk += weight
    
    # Check positive signals
    positives = []
    total_positive = 0
    
    for pattern, label, weight in POSITIVE_PATTERNS:
        matches = re.findall(pattern, text, re.IGNORECASE)
        if matches:
            positives.append({
                'signal': label,
                'weight': weight
            })
            total_positive += weight
    
    # Calculate final risk score (0-100)
    # Start with red flag risk, reduce by positive signals
    raw_risk = min(total_risk, 100)
    risk_reduction = min(total_positive * 0.5, 40)  # Positives can reduce up to 40 points
    text_risk_score = max(0, min(100, raw_risk - risk_reduction))
    
    # Generate summary
    if text_risk_score >= 60:
        summary = 'High-risk description with multiple scam indicators detected'
    elif text_risk_score >= 30:
        summary = 'Moderate risk - some suspicious language patterns found'
    elif text_risk_score > 0:
        summary = 'Low risk - minor concerns in description'
    elif total_positive > 0:
        summary = 'Description contains positive trust signals'
    else:
        summary = 'No significant risk patterns detected'
    
    return {
        'text_risk_score': round(text_risk_score),
        'flagged_phrases': flagged,
        'positive_signals': positives,
        'analysis_summary': summary
    }


if __name__ == "__main__":
    # Test cases
    tests = [
        "Urgent sale! Cash only, no documents needed. Below market price!",
        "RERA registered property #MP123456. Clear title, bank approved by HDFC. Gated community.",
        "Beautiful 3BHK flat in Arera Colony. Well maintained, good ventilation.",
        "Once in lifetime deal! Guaranteed 200% returns. Don't tell anyone, secret offer.",
    ]
    
    for desc in tests:
        result = analyze_text(desc)
        print(f"\nText: {desc[:60]}...")
        print(f"  Risk Score: {result['text_risk_score']}/100")
        print(f"  Red Flags: {len(result['flagged_phrases'])}")
        print(f"  Positives: {len(result['positive_signals'])}")
        print(f"  Summary: {result['analysis_summary']}")
