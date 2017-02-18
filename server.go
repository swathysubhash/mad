[]byte(treq.RequestBody)package main

import (
	"encoding/json"
	"flag"
	"github.com/justinas/alice"
	"html/template"
	"io/ioutil"
	"log"
	"mad/api"
	"mad/docsapp"
	"net/http"
	"os"
	"path/filepath"
)

var cwd, _ = os.Getwd()
var StaticDir = filepath.Join(cwd, "dist", "static")
var docStaticDir = filepath.Join(cwd, "docsapp", "static")

var assets Assets

func init() {
	file, err := ioutil.ReadFile("./dist/asset-manifest.json")
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

	m := http.NewServeMux()

	commonHandlers := alice.New(loggingHandler, recoverHandler, userHandler)
	loginHandlers := alice.New(loggingHandler, recoverHandler)
	staticHandlers := alice.New(gzipHandler)

	m.Handle("/docs/", loginHandlers.Then(http.StripPrefix("/docs", docsapp.Handler())))
	m.Handle("/madapi/", commonHandlers.Then(http.StripPrefix("/madapi", api.Handler())))
	m.Handle("/login", loginHandlers.ThenFunc(login))
	m.Handle("/auth", loginHandlers.ThenFunc(auth))
	m.Handle("/static/", staticHandlers.Then(http.StripPrefix("/static/", http.FileServer(http.Dir(StaticDir)))))
	m.Handle("/public/", staticHandlers.Then(http.StripPrefix("/public/", http.FileServer(http.Dir(docStaticDir)))))

	m.Handle("/", commonHandlers.ThenFunc(func(w http.ResponseWriter, r *http.Request) {
		userId := r.Context().Value("userid").(string)
		userImage := r.Context().Value("userimage").(string)
		state := "{\"userId\": \"" + userId + "\", \"userImage\": \"" + userImage + "\"}"
		renderTemplate(w, "./dist/index", &Page{
			Title:  "Home",
			State:  state,
			Assets: assets,
		})
	}))

	log.Print("Listening on ", *port)
	err := http.ListenAndServe(*port, m)
	if err != nil {
		log.Fatal("ListenAndServe:", err)
	}

}
