#!/usr/bin/env bash
# generate-image.sh
# Usage: bash scripts/generate-image.sh "your prompt" "assets/img/output.png"
# Requires: curl, .env file with HF_TOKEN

set -e

PROMPT="$1"
OUTPUT="$2"

if [ -z "$PROMPT" ] || [ -z "$OUTPUT" ]; then
  echo "Usage: bash scripts/generate-image.sh \"prompt\" \"assets/img/output.png\""
  exit 1
fi

# Load token from .env
if [ -f ".env" ]; then
  export $(grep -v '^#' .env | xargs)
fi

if [ -z "$HF_TOKEN" ]; then
  echo "Error: HF_TOKEN not found in .env"
  exit 1
fi

MODEL="black-forest-labs/FLUX.1-schnell"

echo "Prompt:  $PROMPT"
echo "Model:   $MODEL"
echo "Saving:  $OUTPUT"
echo ""

HTTP_STATUS=$(curl -s -w "%{http_code}" \
  -X POST \
  "https://router.huggingface.co/hf-inference/models/$MODEL" \
  -H "Authorization: Bearer $HF_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"inputs\": \"$PROMPT\"}" \
  --output "$OUTPUT")

if [ "$HTTP_STATUS" -eq 200 ]; then
  echo "Done → $OUTPUT"
else
  echo "Error: HTTP $HTTP_STATUS"
  cat "$OUTPUT"
  rm -f "$OUTPUT"
  exit 1
fi
