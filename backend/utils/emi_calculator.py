"""
EMI Calculator Utility
Standard EMI formula with amortization schedule
"""


def calculate_emi(principal, annual_rate, tenure_years, down_payment_percent=0):
    """
    Calculate EMI and generate amortization schedule.

    Args:
        principal: Total property price (₹)
        annual_rate: Annual interest rate (e.g., 8.5 for 8.5%)
        tenure_years: Loan tenure in years
        down_payment_percent: Down payment percentage (0-100)

    Returns:
        dict with monthly_emi, total_interest, total_payment, 
        loan_amount, down_payment, amortization_schedule (first 12 months)
    """
    if principal <= 0 or annual_rate <= 0 or tenure_years <= 0:
        return {
            'error': 'Invalid input: all values must be positive',
            'monthly_emi': 0,
            'total_interest': 0,
            'total_payment': 0,
            'loan_amount': 0,
            'down_payment': 0,
            'amortization_schedule': []
        }

    # Calculate down payment and loan amount
    down_payment = principal * (down_payment_percent / 100)
    loan_amount = principal - down_payment

    if loan_amount <= 0:
        return {
            'monthly_emi': 0,
            'total_interest': 0,
            'total_payment': round(down_payment, 2),
            'loan_amount': 0,
            'down_payment': round(down_payment, 2),
            'amortization_schedule': []
        }

    # Monthly interest rate
    r = annual_rate / (12 * 100)
    n = tenure_years * 12  # Total months

    # EMI formula: P × r × (1+r)^n / ((1+r)^n - 1)
    emi = loan_amount * r * ((1 + r) ** n) / (((1 + r) ** n) - 1)

    total_payment = emi * n
    total_interest = total_payment - loan_amount

    # Generate amortization schedule (first 12 months)
    schedule = []
    balance = loan_amount

    for month in range(1, min(13, n + 1)):
        interest_component = balance * r
        principal_component = emi - interest_component
        balance -= principal_component

        schedule.append({
            'month': month,
            'emi': round(emi, 2),
            'principal': round(principal_component, 2),
            'interest': round(interest_component, 2),
            'balance': round(max(balance, 0), 2)
        })

    return {
        'monthly_emi': round(emi, 2),
        'total_interest': round(total_interest, 2),
        'total_payment': round(total_payment, 2),
        'loan_amount': round(loan_amount, 2),
        'down_payment': round(down_payment, 2),
        'tenure_months': n,
        'annual_rate': annual_rate,
        'amortization_schedule': schedule
    }


if __name__ == "__main__":
    # Test EMI calculation
    result = calculate_emi(5000000, 8.5, 20, 20)
    print(f"Loan Amount: ₹{result['loan_amount']:,.2f}")
    print(f"Monthly EMI: ₹{result['monthly_emi']:,.2f}")
    print(f"Total Interest: ₹{result['total_interest']:,.2f}")
    print(f"Total Payment: ₹{result['total_payment']:,.2f}")
    print(f"\nFirst 3 months:")
    for row in result['amortization_schedule'][:3]:
        print(f"  Month {row['month']}: EMI ₹{row['emi']:,.0f} | "
              f"Principal ₹{row['principal']:,.0f} | "
              f"Interest ₹{row['interest']:,.0f} | "
              f"Balance ₹{row['balance']:,.0f}")
