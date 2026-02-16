default:
    echo "just running"

push name:
    git add . && git commit -m "{{name}}" && git push origin main
