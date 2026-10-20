#!/bin/sh
# Daily database backup, keeps 14 days. Add to crontab:
#   0 3 * * * /home/ubuntu/HNR-medusa-backend-/deploy/backup.sh
set -e
cd "$(dirname "$0")"
mkdir -p backups
docker compose exec -T postgres pg_dump -U medusa medusa | gzip > "backups/medusa-$(date +%F).sql.gz"
find backups -name 'medusa-*.sql.gz' -mtime +14 -delete
