package main

import (
	"compress/gzip"
	"context"
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"io"
	"log"
	"net/http"
	"runtime/debug"
	"strings"
	"time"
)

type Claims struct {
	Username string
	Picture  string
	jwt.StandardClaims
}

type gzipResponseWriter struct {
	io.Writer
	http.ResponseWriter
}

func (w gzipResponseWriter) Write(b []byte) (int, error) {
	return w.Writer.Write(b)
}

func gzipHandler(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if !strings.Contains(r.Header.Get("Accept-Encoding"), "gzip") {
			next.ServeHTTP(w, r)
			return
		}
		w.Header().Set("Content-Encoding", "gzip")
		gz := gzip.NewWriter(w)
		defer gz.Close()
		gzw := gzipResponseWriter{Writer: gz, ResponseWriter: w}
		next.ServeHTTP(gzw, r)
	})
}

func recoverHandler(next http.Handler) http.Handler {
	fn := func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if err := recover(); err != nil {
				debug.PrintStack()
				log.Printf("panic: %+v", err)
				http.Error(w, http.StatusText(500), 500)
			}
		}()

		next.ServeHTTP(w, r)
	}

	return http.HandlerFunc(fn)
}

func loggingHandler(next http.Handler) http.Handler {
	fn := func(w http.ResponseWriter, r *http.Request) {
		t1 := time.Now()
		next.ServeHTTP(w, r)
		t2 := time.Now()
		log.Printf("[%s] %q %v\n", r.Method, r.URL.String(), t2.Sub(t1))
	}

	return http.HandlerFunc(fn)
}

func userHandler(next http.Handler) http.Handler {
	fn := func(w http.ResponseWriter, r *http.Request) {
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

		if err != nil {
			fmt.Println(err)
			http.Redirect(w, r, "/login", 307)
			return
		}

		if claims, ok := token.Claims.(*Claims); ok && token.Valid {
			fmt.Println("CLAIMS", claims)
			ctx := context.WithValue(r.Context(), "userid", claims.Username)
			r = r.WithContext(ctx)
			ctx = context.WithValue(r.Context(), "userimage", claims.Picture)
			r = r.WithContext(ctx)
			next.ServeHTTP(w, r)
		} else {
			fmt.Println(err)
			http.Redirect(w, r, "/login", 307)
			return
		}
	}
	return http.HandlerFunc(fn)
}
