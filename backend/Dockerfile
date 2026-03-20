FROM php:8.3-cli

RUN apt-get update && apt-get install -y --no-install-recommends \
    git unzip libzip-dev libpq-dev \
  && docker-php-ext-install zip pdo pdo_pgsql \
  && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY composer.json composer.lock ./
RUN composer install --no-interaction --prefer-dist --optimize-autoloader --no-scripts

COPY . .

RUN chown -R www-data:www-data storage bootstrap/cache || true
RUN chmod +x start.sh

EXPOSE 8000

CMD ["sh", "start.sh"]
