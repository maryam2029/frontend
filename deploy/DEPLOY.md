# Frontend Deploy (Nginx)

## 1) Build frontend
```bash
cd /var/www/stock-guard/frontend-main
npm ci
npm run build
```

## 2) Production env
Set API base URL in `.env.production` before building:

```env
VITE_API_BASE_URL=https://api.yourdomain.com
```

## 3) Nginx for frontend (static SPA)
Copy `deploy/nginx/frontend.conf` to:

- `/etc/nginx/sites-available/stock-guard-frontend`

Then enable it:

```bash
sudo ln -s /etc/nginx/sites-available/stock-guard-frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 4) Nginx for backend API domain
Copy `deploy/nginx/api.conf` to:

- `/etc/nginx/sites-available/stock-guard-api`

Then enable it:

```bash
sudo ln -s /etc/nginx/sites-available/stock-guard-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 5) SSL (Let's Encrypt)
```bash
sudo certbot --nginx
```

## Notes
- Replace `yourdomain.com` and `api.yourdomain.com` with real domains.
- Make sure backend is running on `127.0.0.1:3000`.
- For SPA routing, `try_files ... /index.html` is required and already included.
