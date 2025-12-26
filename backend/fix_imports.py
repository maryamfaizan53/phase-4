"""Fix all relative imports to use src prefix"""
import os
import re

# Define the replacements
replacements = [
    (r'^from api\.', 'from src.api.'),
    (r'^from models\.', 'from src.models.'),
    (r'^from agents\.', 'from src.agents.'),
    (r'^from mcp\.', 'from src.mcp.'),
    (r'^from config import', 'from src.config import'),
]

def fix_file(filepath):
    """Fix imports in a single file"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    lines = content.split('\n')
    fixed_lines = []

    for line in lines:
        fixed_line = line
        for pattern, replacement in replacements:
            if re.match(pattern, line):
                fixed_line = re.sub(pattern, replacement, line)
                break
        fixed_lines.append(fixed_line)

    new_content = '\n'.join(fixed_lines)

    if new_content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True
    return False

# Walk through all Python files in src/
src_dir = 'src'
fixed_count = 0

for root, dirs, files in os.walk(src_dir):
    for file in files:
        if file.endswith('.py'):
            filepath = os.path.join(root, file)
            if fix_file(filepath):
                print(f"Fixed: {filepath}")
                fixed_count += 1

print(f"\nTotal files fixed: {fixed_count}")
