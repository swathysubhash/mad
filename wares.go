package main

import (
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"log"
	"net/http"
	"time"
)

type Claims struct {
	Username string
	Picture  string
	jwt.StandardClaims
}

func recoverHandler(next http.Handler) http.Handler {
	fn := func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if err := recover(); err != nil {
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
			next.ServeHTTP(w, r)
			// ctx := context.WithValue(req.Context(), MyKey, *claims)
			// page(res, req.WithContext(ctx))
		} else {
			fmt.Println(err)
			http.Redirect(w, r, "/login", 307)
			return
		}
	}
	return http.HandlerFunc(fn)
}
