# Operations & Disaster Recovery Runbook (RUNBOOK.md)

This document provides operational guidance for maintaining, backing up, and restoring the SellAnyBus.in production and development environments.

---

## 1. System Health Checks & Availability
- **Target SLA:** 99.5% monthly availability.
- **Health Check Endpoint:** `GET /api/v1/health`
- **Expected Response (HTTP 200):**
```json
{
  "status": "healthy",
  "service": "SellAnyBus.in",
  "timestamp": "2026-10-15T01:50:00.000Z",
  "database": "connected",
  "uptime": 1420.5
}
```

---

## 2. Database Backup & Restore Procedures

### PostgreSQL Production Backup (via Docker / Cloud VM)
```bash
# Perform daily automated dump
docker exec -t sellanybus-postgres pg_dump -U sellanybus -F c -b -v -f /tmp/backup_$(date +%Y%m%d).dump sellanybus_db

# Copy backup to secure off-site S3 / Cold Storage
aws s3 cp /tmp/backup_*.dump s3://sellanybus-backups/database/
```

### PostgreSQL Disaster Restore
```bash
# Drop existing database and recreate clean target
docker exec -it sellanybus-postgres dropdb -U sellanybus sellanybus_db
docker exec -it sellanybus-postgres createdb -U sellanybus sellanybus_db

# Restore from dump file
docker exec -i sellanybus-postgres pg_restore -U sellanybus -d sellanybus_db -v < backup_20261015.dump

# Run migrations to verify consistency
npx prisma migrate deploy
```

---

## 3. Storage & Document Backups
- **Public Media:** Stored with immutable UUID keys.
- **Private Document Bucket (`storage/private_documents`):**
  - All files in the private bucket require strict encryption at rest.
  - Periodic rsync / S3 cross-region replication configured for `sellanybus-private-docs`.

---

## 4. Key Secret Rotation
- `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET`: Rotate quarterly. Active user sessions will be prompted to re-authenticate with OTP.
- `APP_ENCRYPTION_KEY`: If rotating, a migration script must decrypt and re-encrypt `Vehicle.chassisNumberEnc` using the transition dual-key pattern.

---

## 5. Incident Response & Escalation
- **Level 1 (Data/Privacy Concern):** Contact Grievance Officer (`grievance@sellanybus.in`). Response within 24h.
- **Level 2 (DB / Outage Incident):** Engineering On-Call (`support@sellanybus.in`).
