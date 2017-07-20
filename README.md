# mad
API Documentation generator.

* Database - mongodb
* Backend - golang
* Frontend - inferno


With google oauth integration.
You need to provide google auth credentials, google redirect url for logging in

**Sample start command**

```
  go build;
  ./mad -port 9877 -google-client-id YOUR_GOOGLE_CLIENT_ID -google-client-secret YOUR_GOOGLE_CLIENT_SECRET -google-redirect-url YOUR_GOOGLE_REDIRECT_URL -jwt-secret-key YOUR_JWT_KEY;
```





