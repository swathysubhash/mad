package main

import (
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"golang.org/x/oauth2"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"time"
)

var conf *oauth2.Config
var googleEndpoint = oauth2.Endpoint{
	AuthURL:  "https://accounts.google.com/o/oauth2/auth",
	TokenURL: "https://accounts.google.com/o/oauth2/token",
}

type Credentials struct {
	Cid     string `json:"cid"`
	Csecret string `json:"csecret"`
}

var cred Credentials

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

func init() {
	file, err := ioutil.ReadFile("./credentials.json")
	if err != nil {
		log.Printf("Not able to find credentials file.Error: %v\n", err)
		os.Exit(1)
	}
	json.Unmarshal(file, &cred)
	fmt.Println(")))", cred)
	conf = &oauth2.Config{
		ClientID:     cred.Cid,
		ClientSecret: cred.Csecret,
		RedirectURL:  "http://localhost:9876/auth",
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
	signedToken, _ := token.SignedString([]byte("1##DIEANOTHERDAY##1"))
	cookie := http.Cookie{Name: "at", Value: signedToken, Expires: expireCookie, HttpOnly: true}
	http.SetCookie(w, &cookie)
	http.Redirect(w, r, "/documentlist", 307)
}
