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
	layouts := []string{"ROOT", "GROUPROOT", "ENDPOINTROOT"}
	err := parseHTMLTemplates([][]string{
		{"layout.html", "sidebar.html", "tryout.html", "content.html", "common.html", "group.html", "subgroup.html"},
		{"group.html", "subgroup.html", "sidebar.html", "content.html", "common.html"},
		{"subgroup.html", "sidebar.html", "content.html", "common.html", "group.html"},
	}, layouts)
	if err != nil {
		log.Fatal(err)
	}
}

var templates = map[string]*template.Template{}

func parseHTMLTemplates(sets [][]string, layouts []string) error {
	for index, set := range sets {
		t := template.New("")
		_, err := t.Funcs(template.FuncMap{
			"html": func(value interface{}) template.HTML {
				return template.HTML(fmt.Sprint(value))
			},
		}).ParseFiles(joinTemplateDir(TemplateDir, set)...)
		if err != nil {
			return fmt.Errorf("template %v: %s", set, err)
		}

		t = t.Lookup(layouts[index])
		if t == nil {
			return fmt.Errorf("template not found in %v", layouts[index])
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

func renderTemplateString(w http.ResponseWriter, r *http.Request, name string, status int, data interface{}) (string, error) {
	t := templates[name]
	if t == nil {
		return "", fmt.Errorf("Template %s not found", name)
	}
	var buf bytes.Buffer
	err := t.Execute(&buf, data)
	if err != nil {
		return "", err
	}
	return buf.String(), nil
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
