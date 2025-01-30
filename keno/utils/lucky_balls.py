
def lucky_odd_price(keno_odd_type, lucky_balls, total_balls, stake):
    """
    Calculate the payout for a lucky odd based on the odd type, number of lucky balls,
    total number of balls, and stake.

    Args:
        keno_odd_type (str): The type of odd ('A' or 'B').
        lucky_balls (int): The number of lucky balls.
        total_balls (int): The total number of balls.
        stake (int): The stake amount.

    Returns:
        int: The payout amount.
    """
    odd_prices = {
        'A': {
            1: 4,
            2: 25,
            3: {2: 3, 3: 50},
            4: {2: 1, 3: 8, 4: 110},
            5: {2: 1, 3: 3, 4: 15, 5: 900},
            6: {3: 1, 4: 10, 5: 70, 6: 1800},
            7: {3: 1, 4: 6, 5: 12, 6: 120, 7: 2150},
            8: {4: 4, 5: 8, 6: 68, 7: 600, 8: 3000},
            9: {4: 3, 5: 6, 6: 18, 7: 120, 8: 1800, 9: 4200},
            10: {4: 2, 5: 4, 6: 12, 7: 40, 8: 400, 9: 2500, 10: 5000}
        },
        'B': {
            1: 4,
            2: 15,
            3: {2: 3, 3: 50},
            4: {2: 1, 3: 8, 4: 100},
            5: {2: 1, 3: 3, 4: 80, 5: 300},
            6: {3: 1, 4: 10, 5: 200, 6: 500},
            7: {3: 1, 4: 6, 5: 12, 6: 300, 7: 1000},
            8: {4: 4, 5: 8, 6: 68, 7: 700, 8: 2000},
            9: {4: 3, 5: 6, 6: 18, 7: 120, 8: 1800, 9: 4200},
            10: {4: 2, 5: 4, 6: 12, 7: 40, 8: 400, 9: 2500, 10: 5000}
        }
    }

    odd_prices_type = odd_prices.get(keno_odd_type)
    if not odd_prices_type:
        raise ValueError("Invalid odd type")

    odd_prices_total_balls = odd_prices_type.get(total_balls)
    if not odd_prices_total_balls:
        raise ValueError("Invalid total balls")

    odd_price = odd_prices_total_balls.get(lucky_balls)
    if isinstance(odd_price, dict):
        odd_price = odd_price.get(lucky_balls)
    if odd_price is None:
        raise ValueError("Invalid lucky balls")

    return odd_price * stake

# Example usage:
print(lucky_odd_price('A', 7, 8, 10))  # Output: 2150
