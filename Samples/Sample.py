# ========================================
# Python Basics - Beginner Sample
# ========================================

# 1. Variables and Data Types
print("=== Variables and Data Types ===")
name = "Alice"
age = 25
height = 5.7
is_student = True

print(f"Name: {name}")
print(f"Age: {age}")
print(f"Height: {height} feet")
print(f"Is Student: {is_student}")

# 2. String Operations
print("\n=== String Operations ===")
greeting = "Hello, " + name + "!"
print(greeting)
print(f"Length of name: {len(name)}")
print(f"Name in uppercase: {name.upper()}")

# 3. Arithmetic Operations
print("\n=== Arithmetic Operations ===")
num1 = 10
num2 = 3
print(f"Addition: {num1} + {num2} = {num1 + num2}")
print(f"Subtraction: {num1} - {num2} = {num1 - num2}")
print(f"Multiplication: {num1} * {num2} = {num1 * num2}")
print(f"Division: {num1} / {num2} = {num1 / num2:.2f}")

# 4. Conditionals (if/else)
print("\n=== Conditionals ===")
if age >= 18:
    print(f"{name} is an adult.")
else:
    print(f"{name} is a minor.")

# 5. Lists
print("\n=== Lists ===")
fruits = ["apple", "banana", "orange", "mango"]
print(f"Fruits: {fruits}")
print(f"First fruit: {fruits[0]}")
print(f"Number of fruits: {len(fruits)}")

# 6. Loops (for loop)
print("\n=== For Loop ===")
print("Counting from 1 to 5:")
for i in range(1, 6):
    print(f"  {i}")

# Loop through list
print("\nFruits list:")
for fruit in fruits:
    print(f"  - {fruit}")

# 7. While Loop
print("\n=== While Loop ===")
count = 1
print("Counting using while loop:")
while count <= 3:
    print(f"  Count: {count}")
    count += 1

# 8. Dictionaries
print("\n=== Dictionaries ===")
person = {
    "name": "Bob",
    "age": 30,
    "city": "New York",
    "occupation": "Engineer"
}
print(f"Person: {person}")
print(f"Name: {person['name']}, Age: {person['age']}")

# 9. Functions
print("\n=== Functions ===")

def greet_user(user_name):
    """A simple function that greets a user"""
    return f"Welcome, {user_name}!"

def calculate_sum(a, b):
    """Function to calculate sum of two numbers"""
    return a + b

print(greet_user("Charlie"))
result = calculate_sum(15, 25)
print(f"Sum of 15 and 25 is: {result}")

print("\n" + "=" * 40)
print("Program Complete!")
print("=" * 40)