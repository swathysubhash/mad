package main

import (
	"encoding/json"
	"flag"
	"github.com/justinas/alice"
	"github.com/swathysubhash/mad/api"
	"github.com/swathysubhash/mad/docsapp"
	"html/template"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path/filepath"
)

var GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URL string
var JWT_SECRET_KEY string

var cwd, _ = os.Getwd()
var StaticDir = filepath.Join(cwd, "dist", "static")
var docStaticDir = filepath.Join(cwd, "docsapp", "static")
var assets Assets

func init() {
	file, err := ioutil.ReadFile("./dist/static/manifest.json")
	if err != nil {
		log.Printf("Not able to find asset file.Error: %v\n", err)
		os.Exit(1)
	}
	json.Unmarshal(file, &assets)
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
	flag.StringVar(&GOOGLE_CLIENT_ID, "google-client-id", "", "Google auth client id")
	flag.StringVar(&GOOGLE_CLIENT_SECRET, "google-client-secret", "", "Google auth client secret")
	flag.StringVar(&GOOGLE_REDIRECT_URL, "google-redirect-url", "", "Google Redirect Url")
	flag.StringVar(&JWT_SECRET_KEY, "jwt-secret-key", "", "Jwt signing secret key")
	flag.Parse()

	initAuth()
	m := http.NewServeMux()

	commonHandlers := alice.New(loggingHandler, recoverHandler, userHandler)
	loginHandlers := alice.New(loggingHandler, recoverHandler)
	staticHandlers := alice.New(gzipHandler)

	m.Handle("/docs/", loginHandlers.Then(http.StripPrefix("/docs", docsapp.Handler())))
	m.Handle("/madapi/", commonHandlers.Then(http.StripPrefix("/madapi", api.Handler())))
	m.Handle("/login", loginHandlers.ThenFunc(login))
	m.Handle("/auth", loginHandlers.ThenFunc(auth))
	m.Handle("/logout", loginHandlers.ThenFunc(logout))
	m.Handle("/static/", staticHandlers.Then(http.StripPrefix("/static/", http.FileServer(http.Dir(StaticDir)))))
	m.Handle("/public/", staticHandlers.Then(http.StripPrefix("/public/", http.FileServer(http.Dir(docStaticDir)))))

	m.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("OK"))
	})

	m.Handle("/", commonHandlers.ThenFunc(func(w http.ResponseWriter, r *http.Request) {
		userId := r.Context().Value("userid").(string)
		userImage := r.Context().Value("userimage").(string)
		state := "{\"userId\": \"" + userId + "\", \"userImage\": \"" + userImage + "\"}"
		renderTemplate(w, "./webapp/index", &Page{
			Title:  "Home",
			State:  state,
			Assets: assets,
		})
	}))

	log.Print("Listening on ", *port)
	err := http.ListenAndServe(":"+*port, m)
	if err != nil {
		log.Fatal("ListenAndServe error:", err)
	}

}
