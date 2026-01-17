import numpy as np

def detect_fraud(data: np.ndarray) -> dict:
    """
    Detects fraud based on transaction data.
    
    Args:
        data: Numpy array containing transaction features. 
              Expected shape: (1, 2) -> [[amount, time]]
              
    Returns:
        dict: A dictionary containing 'is_fraud' (bool) and 'risk_score' (float).
    """
    # Extract features from the numpy array
    amount = data[0][0]
    time = data[0][1]
    
    # --- Simple Heuristic Model ---
    # If the amount is greater than 10,000, flag as fraud.
    is_fraud = bool(amount > 10000)
    
    # Calculate a mock risk score
    risk_score = 0.95 if is_fraud else 0.05
    
    return {
        "is_fraud": is_fraud,
        "risk_score": risk_score
    }
