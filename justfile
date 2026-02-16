default:
    echo "Hello, World!"

push name:
    git add . && git commit -m "{{name}}" && git push origin main
