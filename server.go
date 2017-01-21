package main

import (
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"flag"
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"golang.org/x/oauth2"
	"html/template"
	"io/ioutil"
	"log"
	"mad/api"
	"net/http"
	"os"
	"path/filepath"
	"time"
)

var cred Credentials
var conf *oauth2.Config

var cwd, _ = os.Getwd()
var StaticDir = filepath.Join(cwd, "dist", "static")

var googleEndpoint = oauth2.Endpoint{
	AuthURL:  "https://accounts.google.com/o/oauth2/auth",
	TokenURL: "https://accounts.google.com/o/oauth2/token",
}

type Page struct {
	Title          string
	GoogleLoginUrl string
	State          string
}

type Credentials struct {
	Cid     string `json:"cid"`
	Csecret string `json:"csecret"`
}

type User struct {
	Subject       string `json:"subject"`
	Name          string `json:"name"`
	Picture       string `json:"picture"`
	Email         string `json:"email"`
	EmailVerified string `json:"emailVerified"`
}

type Claims struct {
	Username string
	Picture  string
	jwt.StandardClaims
}

func init() {
	fmt.Println(StaticDir)
	file, err := ioutil.ReadFile("./credentials.json")
	if err != nil {
		log.Printf("Not able to find credentials file.Error: %v\n", err)
		os.Exit(1)
	}
	json.Unmarshal(file, &cred)

	conf = &oauth2.Config{
		ClientID:     cred.Cid,
		ClientSecret: cred.Csecret,
		RedirectURL:  "http://localhost:9876/auth",
		Scopes: []string{
			"https://www.googleapis.com/auth/userinfo.email", // You have to select your own scope from here -> https://developers.google.com/identity/protocols/googlescopes#google_sign-in
		},
		Endpoint: googleEndpoint,
	}
}

func randToken() string {
	b := make([]byte, 32)
	rand.Read(b)
	return base64.StdEncoding.EncodeToString(b)
}

func renderTemplate(w http.ResponseWriter, tmpl string, p *Page) {
	t, err := template.ParseFiles(tmpl + ".html")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	err = t.Execute(w, p)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func main() {

	port := flag.String("port", ":9876", "Server http port number")

	m := http.NewServeMux()

	m.Handle("/madapi/", http.StripPrefix("/madapi", api.Handler()))

	m.HandleFunc("/login", func(w http.ResponseWriter, r *http.Request) {
		token := randToken()
		googleUrl := conf.AuthCodeURL(token)
		fmt.Println("GOOGLE URL::", token, googleUrl)
		renderTemplate(w, "./webapp/login", &Page{
			Title:          "login",
			GoogleLoginUrl: googleUrl,
		})
	})

	m.HandleFunc("/auth", func(w http.ResponseWriter, r *http.Request) {
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

		fmt.Println(user.Email, user.Picture)
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

		http.Redirect(w, r, "/apiList", 307)
	})

	m.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir(StaticDir))))

	m.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {

		cookie, err := r.Cookie("at")
		if err != nil {
			fmt.Println(err)
			http.Redirect(w, r, "/login", 307)
			return
		}

		token, err := jwt.ParseWithClaims(cookie.Value, &Claims{}, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("Unexpected signing method")
			}
			return []byte("1##DIEANOTHERDAY##1"), nil
		})

		fmt.Println("GOT TOKEN", token, err)

		if err != nil {
			fmt.Println(err)
			http.Redirect(w, r, "/login", 307)
			return
		}

		if claims, ok := token.Claims.(*Claims); ok && token.Valid {
			fmt.Println("CLAIMS", claims)
			// ctx := context.WithValue(req.Context(), MyKey, *claims)
			// page(res, req.WithContext(ctx))
		} else {
			fmt.Println(err)
			http.Redirect(w, r, "/login", 307)
			return
		}

		renderTemplate(w, "./dist/index", &Page{
			Title: "Home",
			State: "{\"a\": \"b\"}",
		})
	})

	log.Print("Listening on ", *port)
	err := http.ListenAndServe(*port, m)
	if err != nil {
		log.Fatal("ListenAndServe:", err)
	}

}
