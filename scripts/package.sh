#!/bin/bash

# Define the name of the archive
function_name='checkCdn'
archive_name="$function_name-$(git rev-parse --short HEAD).zip"

# Define the directory of the project to be zipped.
# This example assumes that the project directory is the parent directory of the scripts directory.
project_directory="$(dirname "$(dirname "$(realpath "$0")")")"

# Navigate to the project directory
cd "$project_directory" || exit 1

# Check if the "zips" directory exists, if not, create it.
if [[ ! -d "./zips" ]]; then
  mkdir "./zips"
fi

# Create a zip archive of the project directory, excluding the scripts directory and any .git directory.
zip -r "./zips/$archive_name" . -x "scripts/*" ".git/*" ".env" ".vscode/*" "zips/*"

# Move the archive to a specific directory if needed, or just leave it in the project directory.
# mv "$archive_name" /path/to/destination_directory

echo "Project has been zipped and saved as $archive_name"

# Check if "deploy" is passed as an argument
if [[ $1 == "deploy" ]]; then
  aws lambda update-function-code \
  --function-name $function_name \
  --zip-file fileb://zips/$archive_name > /dev/null 2>&1
  echo "Lambda $function_name has been updated with $archive_name"
else
  echo "To deploy, pass 'deploy' as an argument."
fi
