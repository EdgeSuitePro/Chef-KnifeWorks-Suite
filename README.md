# Chef KnifeWorks Suite

Chef KnifeWorks public website and internal workflow application.

## Security

Production credentials must never be stored in source code or repository documentation. Staff authentication must use environment-backed credentials or a dedicated authentication provider before the CRM is exposed in production.

## Public booking

The canonical customer booking route is `/appointments`. Legacy `/book` and `/appointment` links redirect there so existing links continue to work.
