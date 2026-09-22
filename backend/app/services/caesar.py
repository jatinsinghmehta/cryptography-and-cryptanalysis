from .analysis import english_score


def encrypt(text: str, shift: int) -> str:
    result = ""

    for char in text:
        if char.isupper():
            result += chr(
                (ord(char) - ord("A") + shift) % 26 + ord("A")
            )

        elif char.islower():
            result += chr(
                (ord(char) - ord("a") + shift) % 26 + ord("a")
            )

        else:
            result += char

    return result


def decrypt(text: str, shift: int) -> str:
    return encrypt(text, -shift)


def brute_force(text: str):
    results = []

    for shift in range(26):
        decrypted_text = decrypt(text, shift)
        score = english_score(decrypted_text)

        results.append({
            "shift": shift,
            "result": decrypted_text,
            "score": score
        })

    results.sort(key=lambda item: item["score"])

    return results