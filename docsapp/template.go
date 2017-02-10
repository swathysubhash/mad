package docsapp

import (
	"bytes"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"os"
	"path/filepath"
	// "strconv"
)

var cwd, _ = os.Getwd()
var TemplateDir = filepath.Join(cwd, "docsapp", "templates")

func LoadTemplates() {
	err := parseHTMLTemplates([][]string{
		{"layout.html", "sidebar.html", "content.html", "common.html"},
	})
	if err != nil {
		log.Fatal(err)
	}
}

var templates = map[string]*template.Template{}

func parseHTMLTemplates(sets [][]string) error {
	for _, set := range sets {
		t := template.New("")
		// t.Funcs(htmpl.FuncMap{
		// 	"urlDomain": urlDomain,
		// 	"urlTo":     urlTo,
		// 	"itoa":      strconv.Itoa,
		// })
		_, err := t.Funcs(template.FuncMap{
			"html": func(value interface{}) template.HTML {
				return template.HTML(fmt.Sprint(value))
			},
		}).ParseFiles(joinTemplateDir(TemplateDir, set)...)
		if err != nil {
			return fmt.Errorf("template %v: %s", set, err)
		}

		t = t.Lookup("ROOT")
		if t == nil {
			return fmt.Errorf("ROOT template not found in %v", set)
		}
		templates[set[0]] = t
	}
	return nil
}

func joinTemplateDir(base string, files []string) []string {
	result := make([]string, len(files))
	for i := range files {
		result[i] = filepath.Join(base, files[i])
	}
	return result
}

func renderTemplate(w http.ResponseWriter, r *http.Request, name string, status int, data interface{}) error {
	w.WriteHeader(status)
	if ct := w.Header().Get("content-type"); ct == "" {
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
	}

	t := templates[name]
	if t == nil {
		return fmt.Errorf("Template %s not found", name)
	}

	// Write to a buffer to properly catch errors and avoid partial output written to the http.ResponseWriter
	var buf bytes.Buffer
	err := t.Execute(&buf, data)
	if err != nil {
		return err
	}
	_, err = buf.WriteTo(w)
	return err
}
