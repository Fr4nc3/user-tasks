FROM nginx:alpine
COPY ui/build /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf