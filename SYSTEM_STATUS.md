# HUNI System Status

## Services
| Service | URL | Status |
|---------|-----|--------|
| Backend API | https://huni-backend.railway.app | ✅ Running |
| Frontend | https://huni.vercel.app | ✅ Running |
| Database | Supabase (qyocmp) | ✅ Connected |

## Monitoring
- Sentry: [dashboard link](https://sentry.io)
- Health Check: GET /health
- Logs: logs/huni-YYYYMMDD.log (30 ngày)

## Key Metrics
- API Response: < 200ms avg
- DB Query: < 50ms avg
- Uptime target: 99.9%
