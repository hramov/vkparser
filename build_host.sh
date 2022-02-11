docker build -t vk_parser_server .
cd ./parser
docker build -t vk_parser_bot .
cd ../
git add .
echo 'Input commit message'
read message
git commit -m "$message"
git push origin main