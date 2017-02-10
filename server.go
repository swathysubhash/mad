package main

import (
	"flag"
	"github.com/justinas/alice"
	"html/template"
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

	commonHandlers := alice.New(loggingHandler, recoverHandler)

	m.Handle("/docs/", commonHandlers.Then(http.StripPrefix("/docs", docsapp.Handler())))
	m.Handle("/madapi/", commonHandlers.Then(http.StripPrefix("/madapi", api.Handler())))
	m.Handle("/login", commonHandlers.ThenFunc(login))
	m.Handle("/auth", commonHandlers.ThenFunc(auth))
	m.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir(StaticDir))))
	m.Handle("/public/", http.StripPrefix("/public/", http.FileServer(http.Dir(docStaticDir))))

	m.Handle("/", commonHandlers.ThenFunc(func(w http.ResponseWriter, r *http.Request) {
		renderTemplate(w, "./dist/index", &Page{
			Title: "Home",
			State: "{\"a\": \"b\"}",
		})
	}))

	log.Print("Listening on ", *port)
	err := http.ListenAndServe(*port, m)
	if err != nil {
		log.Fatal("ListenAndServe:", err)
	}

}
