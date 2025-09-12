import os

# Define the files to include in the dump (modify this list as needed)
#files_to_dump = ['package.json', 'package-lock.json', 'eslint.config.js', 'postcss.config.js', 'tailwind.config.js', 'tconfig.app.json', 'tsconfig.json', 'tsconfig.node.json', 'vibe.config.ts']
files_to_dump = ['vite.config.ts', 'components.json', 'tailwind.config.ts']
# Output file name
output_file = 'dump.txt'

# Open the output file in write mode
with open(output_file, 'w', encoding='utf-8') as dump:
    for file_path in files_to_dump:
        try:
            # Check if the file exists
            if os.path.exists(file_path):
                # Read the file content
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                # Write file name as a header and its content to the dump file
                dump.write(f'===== {file_path} =====\n\n')
                dump.write(content)
                dump.write('\n\n')  # Add spacing between files
            else:
                dump.write(f'===== {file_path} =====\n')
                dump.write(f'[File not found]\n\n')
        except Exception as e:
            dump.write(f'===== {file_path} =====\n')
            dump.write(f'[Error reading file: {str(e)}]\n\n')

print(f'Dump file created: {output_file}')