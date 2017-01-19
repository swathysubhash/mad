package main

import (
	"cloud.google.com/go/compute/metadata"
	"crypto/rand"
	"encoding/base64"
	"flag"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"io/ioutil"
	"log"
	"mad/api"
	"net/http"
)

var cred Credentials
var conf *oauth2.Config

type Page struct {
	Title          string
	GoogleLoginUrl string
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

func init() {
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
		Endpoint: google.Endpoint,
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

	m.Handle("/login", func(w http.ResponseWriter, r *http.Request) {
		token := randToken()
		googleUrl := conf.AuthCodeURL(token)
		fmt.Println("GOOGLE URL::", token, googleUrl)
		renderTemplate(w, "./webapp/login", &Page{
			Title:          "login",
			GoogleLoginUrl: googleUrl,
		})
	})

	log.Print("Listening on ", *port)
	err := http.ListenAndServe(*port, m)
	if err != nil {
		log.Fatal("ListenAndServe:", err)
	}

}
