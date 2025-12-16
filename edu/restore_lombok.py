#!/usr/bin/env python3
import os
import re
from pathlib import Path

def add_lombok_annotations(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Skip if already has Lombok annotations
    if '@Data' in content or '@Getter' in content or '@Setter' in content:
        return False
    
    # Check if this is an entity, payload, or DTO class
    is_entity = '@Entity' in content or '@Table' in content
    is_dto = 'Request' in Path(file_path).name or 'Response' in Path(file_path).name or 'Payload' in content
    
    if not (is_entity or is_dto or 'payload' in str(file_path).lower()):
        return False
    
    # Add Lombok imports if not present
    if 'import lombok' not in content:
        # Find package statement
        package_match = re.search(r'(package\s+[^;]+;)', content)
        if package_match:
            insert_pos = package_match.end()
            imports = '\n\nimport lombok.AllArgsConstructor;\nimport lombok.Builder;\nimport lombok.Data;\nimport lombok.NoArgsConstructor;'
            content = content[:insert_pos] + imports + content[insert_pos:]
    
    # Add annotations before class declaration
    # Find public class declaration
    class_pattern = r'(\n)(public\s+(abstract\s+)?class\s+\w+)'
    
    annotations = '\n@Data\n@NoArgsConstructor\n@AllArgsConstructor'
    if is_entity:
        annotations += '\n@Builder'
    annotations += '\n'
    
    content = re.sub(class_pattern, annotations + r'\2', content, count=1)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Updated: {file_path}")
    return True

# Process all Java files
java_src_dir = os.path.join(os.path.dirname(__file__), 'src', 'main', 'java')
count = 0
for root, dirs, files in os.walk(java_src_dir):
    for file in files:
        if file.endswith('.java'):
            filepath = os.path.join(root, file)
            if add_lombok_annotations(filepath):
                count += 1

print(f"\nTotal files updated: {count}")
