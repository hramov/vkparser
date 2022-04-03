git pull origin parser
docker build -t vk_parser_bot .
cd ../vk_parser_server && docker-compose up