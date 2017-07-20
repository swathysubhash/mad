package main

import (
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"github.com/dgrijalva/jwt-go"
	"golang.org/x/oauth2"
	"io/ioutil"
	"net/http"
	"time"
)

var conf *oauth2.Config
var googleEndpoint = oauth2.Endpoint{
	AuthURL:  "https://accounts.google.com/o/oauth2/auth",
	TokenURL: "https://accounts.google.com/o/oauth2/token",
}

type Assets struct {
	Js  string `json:"bundle.js"`
	Css string `json:"style.css"`
}

type Page struct {
	Title          string
	GoogleLoginUrl string
	State          string
	Assets         Assets
}

type User struct {
	Subject       string `json:"subject"`
	Name          string `json:"name"`
	Picture       string `json:"picture"`
	Email         string `json:"email"`
	EmailVerified string `json:"emailVerified"`
}

func initAuth() {
	conf = &oauth2.Config{
		ClientID:     GOOGLE_CLIENT_ID,
		ClientSecret: GOOGLE_CLIENT_SECRET,
		RedirectURL:  GOOGLE_REDIRECT_URL,
		Scopes: []string{
			"https://www.googleapis.com/auth/userinfo.email",
			// You have to select your own scope from here -> https://developers.google.com/identity/protocols/googlescopes#google_sign-in
		},
		Endpoint: googleEndpoint,
	}
}

func login(w http.ResponseWriter, r *http.Request) {
	token := randToken()
	googleUrl := conf.AuthCodeURL(token)
	renderTemplate(w, "./webapp/login", &Page{
		Title:          "login",
		GoogleLoginUrl: googleUrl,
	})
}

func randToken() string {
	b := make([]byte, 32)
	rand.Read(b)
	return base64.StdEncoding.EncodeToString(b)
}

func auth(w http.ResponseWriter, r *http.Request) {
	authCode, err := conf.Exchange(oauth2.NoContext, r.URL.Query().Get("code")) //mux.Vars(r)["token"]

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	client := conf.Client(oauth2.NoContext, authCode)
	email, err := client.Get("https://www.googleapis.com/oauth2/v3/userinfo")

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	defer email.Body.Close()
	data, _ := ioutil.ReadAll(email.Body)

	var user User
	json.Unmarshal(data, &user)

	expireToken := time.Now().Add(time.Hour * 24).Unix()
	expireCookie := time.Now().Add(time.Hour * 24)

	claims := Claims{
		user.Email,
		user.Picture,
		jwt.StandardClaims{
			ExpiresAt: expireToken,
			Issuer:    "MAD",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedToken, _ := token.SignedString([]byte(JWT_SECRET_KEY))
	cookie := http.Cookie{Name: "at", Value: signedToken, Expires: expireCookie, HttpOnly: true}
	http.SetCookie(w, &cookie)
	http.Redirect(w, r, "/documentlist", 307)
}

func logout(w http.ResponseWriter, r *http.Request) {
	cookie := http.Cookie{Name: "at", Value: "", Expires: time.Now(), HttpOnly: true}
	http.SetCookie(w, &cookie)
	http.Redirect(w, r, "/login", 307)
}
