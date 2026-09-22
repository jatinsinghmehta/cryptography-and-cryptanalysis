from collections import Counter


# Approximate English letter frequencies (%)
ENGLISH_FREQUENCIES = {
    "A": 8.17,
    "B": 1.49,
    "C": 2.78,
    "D": 4.25,
    "E": 12.70,
    "F": 2.23,
    "G": 2.02,
    "H": 6.09,
    "I": 6.97,
    "J": 0.15,
    "K": 0.77,
    "L": 4.03,
    "M": 2.41,
    "N": 6.75,
    "O": 7.51,
    "P": 1.93,
    "Q": 0.10,
    "R": 5.99,
    "S": 6.33,
    "T": 9.06,
    "U": 2.76,
    "V": 0.98,
    "W": 2.36,
    "X": 0.15,
    "Y": 1.97,
    "Z": 0.07,
}


COMMON_WORDS = {
    "THE",
    "AND",
    "THIS",
    "THAT",
    "IS",
    "ARE",
    "HELLO",
    "OF",
    "TO",
    "IN",
    "FOR",
    "WITH",
    "YOU",
}


def frequency_analysis(text: str):
    letters = [
        char.upper()
        for char in text
        if char.isalpha()
    ]

    total = len(letters)

    if total == 0:
        return []

    counts = Counter(letters)

    result = []

    for letter, count in counts.most_common():
        percentage = (count / total) * 100

        result.append({
            "letter": letter,
            "count": count,
            "percentage": round(percentage, 2)
        })

    return result


def english_score(text: str) -> float:
    """
    Lower score = closer to typical English letter distribution.
    """

    letters = [
        char.upper()
        for char in text
        if char.isalpha()
    ]

    total = len(letters)

    if total == 0:
        return float("inf")

    counts = Counter(letters)

    chi_square = 0.0

    for letter in ENGLISH_FREQUENCIES:
        observed = counts.get(letter, 0)
        expected = total * (ENGLISH_FREQUENCIES[letter] / 100)

        if expected > 0:
            chi_square += ((observed - expected) ** 2) / expected

    # Small bonus for common English words.
    words = text.upper().split()

    common_word_bonus = sum(
        3 for word in words if word in COMMON_WORDS
    )

    return round(chi_square - common_word_bonus, 2)