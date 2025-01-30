special_cases = {

    'orange': [2, 4, 15, 19, 21, 32],
    'blue': [6, 13, 17, 25, 27, 34],
    'pink': [8, 10, 11, 23, 30, 36],
    'green': [1, 5, 16, 20, 24, 33],
    'yellow': [9, 14, 18, 22, 29, 31],
    'white': [3, 7, 12, 26, 28, 35],

    '1-18': list(range(1, 19)),
    '19-36': list(range(19, 37)),
    'Even': list(range(2, 37, 2)),
    'Odd': list(range(1, 36, 2)),
    'red': [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36],  # Example, actual numbers may vary
    'black': [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35],  # Example, actual numbers may vary

    '1st 12': list(range(1, 13)),
    '2nd 12': list(range(13, 25)),
    '3rd 12': list(range(25, 37)),

    'col1': [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34],
    'col2': [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
    'col3': [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36],

}

"""
orange {"stake":10,"val":"2/4/15/19/21/32","odd":6,"win":60,"win_type":"Selector(Colour)","kind":"selector_colour"}
blue {"stake":10,"val":"6/13/17/25/27/34","odd":6,"win":60,"win_type":"Selector(Colour)","kind":"selector_colour"}
pink {"stake":10,"val":"8/10/11/23/30/36","odd":6,"win":60,"win_type":"Selector(Colour)","kind":"selector_colour"}
green {"stake":10,"val":"1/5/16/20/24/33","odd":6,"win":60,"win_type":"Selector(Colour)","kind":"selector_colour"}
yellow {"stake":10,"val":"9/14/18/22/29/31","odd":6,"win":60,"win_type":"Selector(Colour)","kind":"selector_colour"}
white {"stake":10,"val":"3/7/12/26/28/35","odd":6,"win":60,"win_type":"Selector(Colour)","kind":"selector_colour"}

1-18 {"stake":10,"val":"1-18","odd":2,"win":20,"win_type":"High/Low","kind":"high_low"}
19-36 {"stake":10,"val":"19-36","odd":2,"win":20,"win_type":"High/Low","kind":"high_low"}
Even {"stake":10,"val":"Even","odd":2,"win":20,"win_type":"Odd/Even","kind":"odd_even"}
Odd {"stake":10,"val":"Odd","odd":2,"win":20,"win_type":"Odd/Even","kind":"odd_even"}
red {"stake":10,"val":"red","odd":2,"win":20,"win_type":"Color","kind":"red_black"}
black {"stake":10,"val":"black","odd":2,"win":20,"win_type":"Color","kind":"red_black"}

1st 12 {"stake":10,"val":"1st 12","odd":3,"win":30,"win_type":"Dozens","kind":"dozens"}
2nd 12 {"stake":10,"val":"2nd 12","odd":3,"win":30,"win_type":"Dozens","kind":"dozens"}
3rd 12 {"stake":10,"val":"3rd 12","odd":3,"win":30,"win_type":"Dozens","kind":"dozens"}

col1 {"stake":10,"val":"col1","odd":3,"win":30,"win_type":"Column","kind":"line"}
col2 {"stake":10,"val":"col2","odd":3,"win":30,"win_type":"Column","kind":"line"}
col3 {"stake":10,"val":"col3","odd":3,"win":30,"win_type":"Column","kind":"line"}

{"stake":10,"val":"1/2/3/4/5/6","odd":6,"win":60,"win_type":"Six","kind":"toolpit"}
{"stake":10,"val":"2/3/5/6","odd":9,"win":90,"win_type":"Corner","kind":"toolpit"}
{"stake":10,"val":"4/5","odd":18,"win":180,"win_type":"Split","kind":"toolpit"}
{"stake":10,"val":0,"odd":36,"win":360,"win_type":"Win","kind":"int"}

"""

import random

# Bet types and their odds
bet_types = {
    'single': {'odds': 36},
    'Split': {'odds': 18},
    'Corner': {'odds': 9},
    'six': {'odds': 6},
    'red': {'odds': 2, 'numbers': [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30]},
    'black': {'odds': 2, 'numbers': [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 31, 33, 35]},
    'green': {'odds': 6, 'numbers': [1, 5, 16, 20, 24, 33]},
    'yellow': {'odds': 6, 'numbers': [9, 14, 18, 22, 29, 31]},
    'white': {'odds': 6, 'numbers': [3, 7, 12, 26, 28, 35]},
    'orange': {'odds': 6, 'numbers': [2, 4, 15, 19, 21, 32]},
    'blue': {'odds': 6, 'numbers': [6, 13, 17, 25, 27, 34]},
    'pink': {'odds': 6, 'numbers': [8, 10, 11, 23, 30, 36]},
    '1st 12': {'odds': 3, 'numbers': list(range(1, 13))},
    '2nd 12': {'odds': 3, 'numbers': list(range(13, 25))},
    '3rd 12': {'odds': 3, 'numbers': list(range(25, 37))},

    'col1': {'odds': 3, 'numbers': [1,4,7,10,13,16,19,22,25,28,31,34]},
    'col2': {'odds': 3, 'numbers': [2,5,8,11,14,17,20,23,26,29,32,35]},
    'col3': {'odds': 3, 'numbers': [3,6,9,12,15,18,21,24,27,30,33,36]},
    'high': {'odds': 2, 'numbers': list(range(1, 19))},
    'low': {'odds': 2, 'numbers': list(range(19, 37))},
    'Odd': {'odds': 2, 'numbers': [i for i in range(1, 37, 2)]},
    'Even': {'odds': 2, 'numbers': [i for i in range(2, 37, 2)]}
}

def generate_random_bets(num_bets=100):
    bets = []
    bet_types_list = list(bet_types.keys())
    
    for _ in range(num_bets):
        bet_type = random.choice(bet_types_list)
        stake = random.randint(10, 1000)
        
        if bet_type in ['single', 'pair', 'trio', 'quad', 'six']:
            num_count = {'single': 1, 'pair': 2, 'trio': 3, 'quad': 4, 'six': 6}[bet_type]
            chosen_numbers = random.sample(range(0, 37), num_count)
        else:
            chosen_numbers = []

        bets.append({
            'stake': stake,
            'bet_type': bet_type,
            'chosen_numbers': chosen_numbers
        })
    
    return bets

def is_winner(spin_result, bet_type, chosen_numbers):
    if bet_type in ['pair', 'trio', 'quad', 'six']:
        return spin_result in chosen_numbers
    else:
        return spin_result in bet_types[bet_type].get('numbers', [])

def calculate_prize(stake, odds):
    return stake * odds

def simulate_spin_results(bets):
    results = {i: {'win_count': 0, 'total_win_amount': 0} for i in range(37)}
    for spin_result in range(37):  # 0 to 36
        for bet in bets:
            bet_type = bet['bet_type']
            chosen_numbers = bet['chosen_numbers']
            stake = bet['stake']
            odds = bet_types[bet_type]['odds']

            if is_winner(spin_result, bet_type, chosen_numbers):
                results[spin_result]['win_count'] += 1
                results[spin_result]['total_win_amount'] += calculate_prize(stake, odds)
    return results

def track_and_sort_results(results):
    sorted_by_frequency = sorted(results.items(), key=lambda x: x[1]['win_count'], reverse=True)
    sorted_by_win_amount = sorted(results.items(), key=lambda x: x[1]['total_win_amount'], reverse=True)
    
    most_frequent = sorted_by_frequency[:5]
    least_frequent = sorted_by_frequency[-5:]
    average_frequent = sorted_by_frequency[17:22]  # middle 5 for average
    
    return most_frequent, least_frequent, average_frequent

def categorize_numbers(results):
    win_amounts = [results[i]['total_win_amount'] for i in range(37)]
    win_amounts_sorted = sorted(win_amounts)

    low_threshold = win_amounts_sorted[12]  # Roughly bottom third
    mid_threshold = win_amounts_sorted[24]  # Roughly middle third
    high_threshold = win_amounts_sorted[36] # Top third
    around_25000_threshold = min(win_amounts_sorted, key=lambda x: abs(x - 25000))

    categories = {
        'uncalled': [],
        'low': [],
        'middle': [],
        'high': [],
        'around_25000': [],
    }

    for i in range(37):
        total_win_amount = results[i]['total_win_amount']
        if total_win_amount == 0:
            categories['uncalled'].append({'number': i, 'total_win_amount': total_win_amount})
        elif total_win_amount <= low_threshold:
            categories['low'].append({'number': i, 'total_win_amount': total_win_amount})
        elif total_win_amount <= mid_threshold:
            categories['middle'].append({'number': i, 'total_win_amount': total_win_amount})
        elif total_win_amount <= high_threshold:
            categories['high'].append({'number': i, 'total_win_amount': total_win_amount})
        if abs(total_win_amount - 25000) < 5000:  # Adjust the range as needed
            categories['around_25000'].append({'number': i, 'total_win_amount': total_win_amount})
    return categories

def select_best_number(categories, max_won_amount):
    total_uncalled_won = sum(item['total_win_amount'] for item in categories['uncalled'])
    total_low_won = sum(item['total_win_amount'] for item in categories['low'])
    total_middle_won = sum(item['total_win_amount'] for item in categories['middle'])
    total_high_won = sum(item['total_win_amount'] for item in categories['high'])
    total_special_won = sum(item['total_win_amount'] for item in categories['around_25000'])

    diff_special = abs(max_won_amount - total_special_won)
    diff_low = abs(max_won_amount - total_low_won)
    diff_middle = abs(max_won_amount - total_middle_won)
    diff_high = abs(max_won_amount - total_high_won)
    diff_uncalled = abs(max_won_amount - total_uncalled_won)

    closest_result = None

    if max_won_amount > 0:
        min_diff = min(diff_special, diff_low, diff_middle, diff_high, diff_uncalled)
        if min_diff == diff_high and categories['high']:
            closest_result = min(categories['high'], key=lambda x: abs(x['total_win_amount'] - max_won_amount))
        elif min_diff == diff_middle and categories['middle']:
            closest_result = min(categories['middle'], key=lambda x: abs(x['total_win_amount'] - max_won_amount))
        elif min_diff == diff_low and categories['low']:
            closest_result = min(categories['low'], key=lambda x: abs(x['total_win_amount'] - max_won_amount))
        elif min_diff == diff_uncalled and categories['uncalled']:
            closest_result = min(categories['uncalled'], key=lambda x: abs(x['total_win_amount'] - max_won_amount))
        elif min_diff == diff_special and categories['around_25000']:
            closest_result = min(categories['around_25000'], key=lambda x: abs(x['total_win_amount'] - max_won_amount))
    else:
        if categories['uncalled']:
            closest_result = min(categories['uncalled'], key=lambda x: x['total_win_amount'])
        else:
            all_candidates = categories['low'] + categories['middle'] + categories['high'] + categories['around_25000']
            closest_result = min(all_candidates, key=lambda x: x['total_win_amount'])

    # Ensure closest_result is not None
    if not closest_result:
        all_candidates = categories['uncalled'] + categories['low'] + categories['middle'] + categories['high'] + categories['around_25000']
        closest_result = min(all_candidates, key=lambda x: abs(x['total_win_amount'] - max_won_amount))

    return closest_result['number']

def main():
    random_bets = generate_random_bets()
    print(f'random bets \n {random_bets}')
    results = simulate_spin_results(random_bets)
    categories = categorize_numbers(results)

    print("Categories:")
    for category, numbers in categories.items():
        print(f"{category.capitalize()}: {numbers}")

    most_frequent, least_frequent, average_frequent = track_and_sort_results(results)

    print("Most Frequent Results:")
    for result in most_frequent:
        print(f"Spin result: {result[0]}, Win count: {result[1]['win_count']}, Total win amount: {result[1]['total_win_amount']}")

    print("\nLeast Frequent Results:")
    for result in least_frequent:
        print(f"Spin result: {result[0]}, Win count: {result[1]['win_count']}, Total win amount: {result[1]['total_win_amount']}")

    print("\nAverage Frequent Results:")
    for result in average_frequent:
        print(f"Spin result: {result[0]}, Win count: {result[1]['win_count']}, Total win amount: {result[1]['total_win_amount']}")

    max_won_amount = 90000  # Example value, replace with your logic
    selected_number = select_best_number(categories, max_won_amount)
    print(f"\nSelected number based on max won amount: {selected_number}")

if __name__ == "__main__":
    main()


# int   - 36 odd - [0,1,2,3,....34,35,36]

# len_2 - 18 odd - [pair of nums], [12,15], [34,35]
# len_3 - 12 odd - [group of 3 nums], [12,15,18], [34,35,32]
# len_4 - 9 odd - [group of 4 nums], [9,12,15,18], [31,34,35,32]
# len_6 - 6 odd - [group of 6 nums], [9,12,15,18,21,24], [31,34,35,32,36,33]

# red   - 2 odd- [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30]
# black - 2 odd - [2,4,6,8,10,11,13,15,17,20,22,24,26,28,31,33,35]

# green - 6 odd - [1,5,16,20,24,33]
# yellow -6 odd - [9,14,18,22,29,31]
# white - 6 odd - [3,7,12,26,28,35]
# orange -6 odd - [2,4,15,19,21,32]
# blue -  6 odd - [6,13,17,25,27,34]
# pink -  6 odd - [8,10,11,23,30,36]

# first_12  - 3 odd - 1 to 12
# second_12 - 3 odd - 13 to 24
# third_12  - 3 odd - 25 to 36

# high - 2 odd - [1 to 18]
# low  - 2 odd - [19 to 36]

# odd  -2 odd - [1,3,5,7,9,...,33,35]
# even -2 odd - [2,4,6,...,32,34,36]
