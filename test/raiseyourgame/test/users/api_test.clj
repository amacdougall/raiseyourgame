;; Namespace containing tests of the users API. These are black-box tests; as
;; much as possible, we should test entirely by making API requests and
;; inspecting the responses. The details of the underlying system are a
;; distraction at best.
(ns raiseyourgame.test.users.api-test
  (:require [raiseyourgame.db.core :as db]
            [raiseyourgame.db.migrations :as migrations]
            [raiseyourgame.test.helpers :refer :all]
            [raiseyourgame.models.user :as user]
            [raiseyourgame.handler :refer [app]]
            [raiseyourgame.test.fixtures :as fixtures]
            [clojure.test :refer :all]
            [clojure.java.jdbc :as jdbc]
            [peridot.core :refer [request]]
            [taoensso.timbre :refer [debug]]
            [conman.core :refer [with-transaction]]))

(use-fixtures
  :once
  (fn [f]
    (when (nil? @db/conn) (db/connect!))
    (f)))

;; When testing updates, timestamps can confuse the issue.
(defn- without-timestamps [user]
  (dissoc user :last-login :updated-at :created-at))

(deftest test-user-create
  (with-rollback-transaction [t-conn db/conn]
    (let [body (transit-write fixtures/user-values)
          response (-> (session app)
                     (request "/api/users"
                              :request-method :post
                              :content-type "application/transit+json"
                              :body body)
                     :response)
          user (response->clj response)]
      ; The HTTP 201 Created response includes a Location header where the new
      ; resource can be found, and includes the resource itself in the body.
      ; NOTE: strings are not fn-able, so get-in is more convenient.
      (is (= 201 (:status response))
          "response should be 201 Created")
      (is (has-values? (user/private fixtures/user-values) user)
          "response body should be the created user")
      (is (string? (get-in response [:headers "Location"]))
          "response should include a Location header")
      (is (= (format "/api/users/%d" (:user-id user))
             (get-in response [:headers "Location"]))
          "Location header should match the resource URL"))))

;; It should not be possible to create a user with an email or username which
;; is already in use.
(deftest test-user-create-duplicate
  (with-rollback-transaction [t-conn db/conn]
    (fixtures/create-test-user!) ; make sure user already exists
    (let [with-dupe-username (assoc fixtures/user-values :email "available@example.com")
          with-dupe-email (assoc fixtures/user-values :username "available")
          test-user-creation
          (fn [user-values error-keys]
            (let [body (transit-write user-values)
                  response (-> (session app)
                             (request "/api/users"
                                      :request-method :post
                                      :content-type "application/transit+json"
                                      :body body)
                             :response)
                  response-body (response->clj response)]
              (is (= 400 (:status response))
                  "response should be 400 Bad Request")))]
      (test-user-creation fixtures/user-values [:username :email])
      (test-user-creation with-dupe-username [:username])
      (test-user-creation with-dupe-email [:email]))))

(deftest test-get-users
  (with-rollback-transaction [t-conn db/conn]
    ; create users; use vec to realize the sequence
    (let [moderator (fixtures/create-test-moderator!)
          users (vec (map user/create! (take 100 (fixtures/test-users))))]
      (testing "as standard user"
        (let [path "/api/users/"
              response (-> (session app) (request path) :response)]
          (is (= 403 (:status response))
              "getting user list as unprivileged user should return 403 Forbidden")))
      (testing "as moderator"
        (let [path "/api/users/"
              response (-> (session app)
                         (login-request fixtures/moderator-values)
                         (request path)
                         :response)]
          (is (= 200 (:status response))
              "getting user list as moderator should return 200 OK")
          (let [result (response->clj response)
                user-page (:users result)]
            (is (= 1 (:page result))
                "user list should have a valid :page value")
            (is (= 30 (:per-page result))
                "user list should have a valid :per-page value")
            (is (or (vector? user-page) (seq? user-page)))
            (is (= 30 (count user-page))
                "default user list should contain 30 elements"))))
      (testing "as admin"
        (let [path "/api/users/"
              response (-> (session app)
                         (login-request fixtures/moderator-values)
                         (request path)
                         :response)]
          (is (= 200 (:status response))
              "getting user list as admin should return 200 OK")
          (let [result (response->clj response)
                user-page (:users result)]
            (is (= 1 (:page result))
                "user list should have a valid :page value")
            (is (= 30 (:per-page result))
                "user list should have a valid :per-page value")
            (is (or (vector? user-page) (seq? user-page)))
            (is (= 30 (count user-page))
                "default user list should contain 30 elements"))))
      (testing "sorted by username ascending"
        (let [path "/api/users?order-by=username"
              response (-> (session app)
                         (login-request fixtures/moderator-values)
                         (request path)
                         :response)]
          (is (= 200 (:status response))
              "getting user list as admin should return 200 OK")
          (let [result (response->clj response)
                user-page (:users result)]
            (is (= 1 (:page result))
                "user list should have a valid :page value")
            (is (= 30 (:per-page result))
                "user list should have a valid :per-page value")
            (is (or (vector? user-page) (seq? user-page)))
            (is (= 30 (count user-page))
                "user list should contain 30 elements")
            (is (sorted-by user-page :username)
                "user list should be sorted by username"))))
      (testing "sorted by username descending"
        (let [path "/api/users?order-by=username&sort-direction=desc"
              response (-> (session app)
                         (login-request fixtures/moderator-values)
                         (request path)
                         :response)]
          (is (= 200 (:status response))
              "getting user list as admin should return 200 OK")
          (let [result (response->clj response)
                user-page (:users result)]
            (is (= 1 (:page result))
                "user list should have a valid :page value")
            (is (= 30 (:per-page result))
                "user list should have a valid :per-page value")
            (is (or (vector? user-page) (seq? user-page)))
            (is (= 30 (count user-page))
                "user list should contain 30 elements")
            (is (sorted-by user-page :username :desc)
                "user list should be sorted by username")))))))

(deftest test-get-by-id
  (with-rollback-transaction [t-conn db/conn]
    (let [user (fixtures/create-test-user!)]
      (testing "with correct id"
        (let [path (format "/api/users/%d" (:user-id user))
              response (-> (session app) (request path) :response)]
          (is (= 200 (:status response))
              "getting known user by id should return 200")
          (let [result (response->clj response)]
            (is (has-values? (dissoc fixtures/user-values :password :email) result)
                "resulting user has expected values")
            (is (empty? (filter #{:password :email} result))
                "resulting user does not have password or email values"))))
      (testing "with unknown id"
        (let [path "/api/users/0"
              response (-> (session app) (request path) :response)]
          (is (= 404 (:status response))
              "getting user by nonexistent id should return 404"))))))

(deftest test-user-lookup
  (with-rollback-transaction [t-conn db/conn]
    ; we're doing this in a let because we'll need the user-id later
    (let [user (fixtures/create-test-user!)
          test-success
          (fn [criteria]
            (let [response (-> (session app)
                             (request "/api/users/lookup" :params criteria)
                             :response)]
              (is (= 200 (:status response)))
              (let [result (response->clj response)]
                (is (has-values? (user/public fixtures/user-values) result)
                    "resulting user has expected values")
                (is (empty? (filter #{:password :email} result))
                    "resulting user does not have password or email values"))))
          test-not-found
          (fn [criteria]
            (let [response (-> (session app)
                             (request "/api/users/lookup"
                                      :params criteria)
                             :response)]
              (is (= 404 (:status response))
                  "looking up nonexistent user returns 404")))]

      (testing "looking up user by user-id"
        (test-success {:user-id (:user-id user)})
        (test-not-found {:user-id 0}))

      (testing "looking up user by username"
        (test-success {:username (:username user)})
        (test-not-found {:username "iyagami"}))

      (testing "looking up user by email"
        (test-success {:email (:email user)})
        (test-not-found {:email "iyagami@magatama.org"}))

      (testing "looking up user with invalid parameters"
        (let [response (-> (session app)
                         (request "/api/users/lookup"
                                  :params {:something "wrong"})
                         :response)]
          (is (= 400 (:status response))))))))

;; Given a user and a {:username String :password String} map, test login using
;; the API. This helper method should be used to test logins after user
;; creation/update. It conveniently also attempts to log in with an invalid
;; password.
; Not the greatest name, I know.
(defn- exercise-login-routes [credentials]
  (let [response
        (-> (session app)
          (request "/api/users/login"
                   :request-method :post
                   :content-type "application/transit+json"
                   :body (transit-write credentials))
          :response)
        authenticated-user (response->clj response)]
    (is (= 200 (:status response)) "login returned 200 response")
    (is (= (:username credentials) (:username authenticated-user))
        "login returned the expected user"))

  ; log in, then hit the /api/users/current route to test logged-in-ness
  (let [response
        (-> (session app)
          (request "/api/users/login"
                   :request-method :post
                   :content-type "application/transit+json"
                   :body (transit-write credentials))
          (request "/api/users/current")
          :response)
        current-user (response->clj response)]
    (is (= 200 (:status response))
        "after login, current returned 200 response")
    (is (= (:username credentials) (:username current-user))
        "after login, current returned logged-in user"))

  (let [invalid-credentials (assoc credentials :password "hunter2")
        response
        (-> (session app)
          (request "/api/users/login"
                   :request-method :post
                   :content-type "application/transit+json"
                   :body (transit-write invalid-credentials))
          :response)]
    (is (= 401 (:status response))
        "logging in with incorrect password should fail")))

(deftest test-login
  (with-rollback-transaction [t-conn db/conn]
    (fixtures/create-test-user!)
    (exercise-login-routes
      (select-keys fixtures/user-values #{:username :password}))))

(deftest test-logout
  (with-rollback-transaction [t-conn db/conn]
    (let [user (fixtures/create-test-user!)]
      ; attempt to log out while already logged out
      (let [response
            (-> (session app)
              (request "/api/users/logout" :request-method :post)
              :response)]
        (is (= 404 (:status response))
            "logging out while already logged out should be an error"))
      ; log in, then out
      (let [response
            (-> (session app)
              (login-request fixtures/user-values)
              (request "/api/users/logout" :request-method :post)
              :response)]
        (is (= 204 (:status response))
            "logging out while logged in should succeed"))
      
      (let [response
            (-> (session app)
              (login-request fixtures/user-values)
              (request "/api/users/logout" :request-method :post)
              (request "/api/users/current" :response :status)
              :response)]
        (is (= 404 (:status response))
            "current user should return 404 after logging out")))))

(deftest test-user-update-failures
  (with-rollback-transaction [t-conn db/conn]
    (let [original (fixtures/create-test-user!)
          moderator (fixtures/create-test-moderator!)
          expected (conj original {:password "rising tackle"
                                   :email "tbogard@garou.org"})]
      ; attempt to update while logged out
      (let [response
            (-> (session app)
              (request (format "/api/users/%d" (:user-id expected))
                       :request-method :put
                       :content-type "application/transit+json"
                       :body (transit-write expected))
              :response)]
        (is (= 401 (:status response))
            "attempting to update user while logged out should fail"))

      ; attempt to update nonexistent user
      (let [response
            (-> (session app)
              ; log in first...
              (request "/api/users/login"
                       :request-method :post
                       :content-type "application/transit+json"
                       :body (transit-write
                               (credentials-for fixtures/user-values)))
              ; ...and then update a nonexistent user
              (request (format "/api/users/%d" -1)
                       :request-method :put
                       :content-type "application/transit+json"
                       :body (transit-write expected))
              :response)]
        (is (= 404 (:status response))
            "attempting to update nonexistent user should fail"))

      ; attempt to update impermissible user
      (let [response
            (-> (session app)
              ; log in first...
              (request "/api/users/login"
                       :request-method :post
                       :content-type "application/transit+json"
                       :body (transit-write
                               (credentials-for fixtures/user-values)))
              ; ...and then update an impermissible user
              (request (format "/api/users/%d" (:user-id moderator))
                       :request-method :put
                       :content-type "application/transit+json"
                       :body (transit-write
                               (assoc moderator :username "syabuki")))
              :response)]
        (is (= 403 (:status response))
            "attempting to update a user without proper permissions should fail"))

      ; attempt to set unavailable username
      (let [bad-username (assoc expected :username (:username moderator))
            response
            (-> (session app)
              ; log in first...
              (request "/api/users/login"
                       :request-method :post
                       :content-type "application/transit+json"
                       :body (transit-write
                               (credentials-for fixtures/user-values)))
              ; ...and then update sending an unavailable username
              (request (format "/api/users/%d" (:user-id original))
                       :request-method :put
                       :content-type "application/transit+json"
                       :body (transit-write bad-username))
              :response)]
        (is (= 400 (:status response))
            "attempting to update to unavailable username should fail"))

      ; attempt to set unavailable email
      (let [bad-email (assoc expected :email (:email moderator))
            response
            (-> (session app)
              ; log in first...
              (request "/api/users/login"
                       :request-method :post
                       :content-type "application/transit+json"
                       :body (transit-write
                               (credentials-for fixtures/user-values)))
              ; ...and then update sending an unavailable email
              (request (format "/api/users/%d" (:user-id original))
                       :request-method :put
                       :content-type "application/transit+json"
                       :body (transit-write bad-email))
              :response)]
        (is (= 400 (:status response))
            "attempting to update to unavailable email should fail")))))

(deftest test-user-update-self
  (with-rollback-transaction [t-conn db/conn]
    (let [original (fixtures/create-test-user!)
          expected (conj original {:password "rising tackle"
                                   :email "tbogard@garou.org"})]
      (let [response
            (-> (session app)
              ; log in first...
              (request "/api/users/login"
                       :request-method :post
                       :content-type "application/transit+json"
                       :body (transit-write
                               (credentials-for fixtures/user-values)))
              ; ...and then update self
              (request (format "/api/users/%d" (:user-id original))
                       :request-method :put
                       :content-type "application/transit+json"
                       :body (transit-write expected))
              :response)
            actual (response->clj response)]
        ; since update requires authorization, assume a user/private response
        (is (= 200 (:status response))
            "response should be 200")
        (is (has-values? (without-timestamps (user/private expected)) actual)
            "response body should be the updated user, ignoring timestamps"))

      (let [response
            (-> (session app)
              (request "/api/users/lookup" :params {:email (:email expected)})
              :response)]
        (is (= 200 (:status response))
            "should be able to look up user by new email"))

      (let [response (-> (session app)
                       (request "/api/users/lookup"
                                :params {:email (:email original)})
                       :response)]
        (is (= 404 (:status response))
            "should not be able to look up user by old email"))

      (testing "could log in with updated password"
        (exercise-login-routes (credentials-for expected))))))

;; Implicitly tests any user updating a user with a lower user level.
(deftest test-admin-update-other
  (with-rollback-transaction [t-conn db/conn]
    (let [original (fixtures/create-test-user!)
          moderator (fixtures/create-test-moderator!) ; will do the update
          expected (conj original {:password "rising tackle"
                                   :email "tbogard@garou.org"})]
      (let [response
            (-> (session app)
              ; log in as moderator...
              (request "/api/users/login"
                       :request-method :post
                       :content-type "application/transit+json"
                       :body (transit-write
                               (credentials-for fixtures/moderator-values)))
              ; ...and then update the user
              (request (format "/api/users/%d" (:user-id original))
                       :request-method :put
                       :content-type "application/transit+json"
                       :body (transit-write expected))
              :response)
            actual (response->clj response)]
        ; since update requires authorization, assume a user/private response
        (is (= 200 (:status response))
            "response should be 200")
        (is (has-values? (without-timestamps (user/private expected)) actual)
            "response body should be the updated user, ignoring timestamps"))

      (let [response
            (-> (session app)
              (request "/api/users/lookup" :params {:email (:email expected)})
              :response)]
        (is (= 200 (:status response))
            "should be able to look up user by new email"))

      (let [response
            (-> (session app)
              (request "/api/users/lookup" :params {:email (:email original)})
              :response)]
        (is (= 404 (:status response))
            "should not be able to look up user by old email")))))

(deftest test-user-remove
  (with-rollback-transaction [t-conn db/conn]
    (let [user (fixtures/create-test-user!)
          moderator (fixtures/create-test-moderator!)
          admin (fixtures/create-test-admin!)
          remove-request (fn [session user]
                           (request session (format "/api/users/%d" (:user-id user))
                                    :request-method :delete))]

      ; cannot remove anything while logged out
      (let [response (-> (session app) (remove-request user) :response)]
        (is (= 401 (:status response))
            "logged-out users cannot remove users"))

      ; cannot remove nonexistent user
      (let [response (-> (session app)
                       (login-request fixtures/user-values)
                       (remove-request (assoc user :user-id -1))
                       :response)]
        (is (= 404 (:status response))
            "nonexistent users cannot be removed"))

      ; user cannot remove self
      (let [response (-> (session app)
                       (login-request fixtures/user-values)
                       (remove-request user)
                       :response)]
        (is (= 403 (:status response))
            "users cannot remove users"))

      ; moderator cannot remove user
      (let [response (-> (session app)
                       (login-request fixtures/moderator-values)
                       (remove-request user)
                       :response)]
        (is (= 403 (:status response))
            "moderators cannot remove users"))

      ; admin can remove user
      (let [response (-> (session app)
                       (login-request fixtures/admin-values)
                       (remove-request user)
                       :response)]
        (is (= 204 (:status response))
            "admins can remove users"))

      ; removed user was removed
      (let [updated-user (user/lookup {:user-id (:user-id user)})]
        (is (not (nil? updated-user))
            "removed users still exist in database")
        (is (= false (:active updated-user))
            "removed users have :active false"))


      ; admin can remove moderator
      (let [response (-> (session app)
                       (login-request fixtures/admin-values)
                       (remove-request moderator)
                       :response)]
        (is (= 204 (:status response))
            "admins can remove moderators"))

      ; NOTE: at this point, `user` and `moderator` are removed
      ; user removal is idempotent: returns 204 each time
      (let [response (-> (session app)
                       (login-request fixtures/admin-values)
                       (remove-request moderator)
                       :response)]
        (is (= 204 (:status response))
            "user removal is idempotent, returning 204 if user is already removed")))))

(deftest test-removed-user-lookup
  ;; the following two functions take a peridot session
  (let [remove-request
        (fn [session user]
          (request session (format "/api/users/%d" (:user-id user))
                   :request-method :delete))]

    ; remove as admin, retrieve as admin: should be 200
    (with-rollback-transaction [t-conn db/conn]
      (let [user (fixtures/create-test-user!)
            admin (fixtures/create-test-admin!)
            response (-> (session app)
                       (login-request fixtures/admin-values)
                       (remove-request user)
                       (request (format "/api/users/%d" (:user-id user)))
                       :response)
            result (response->clj response)]
        (is (= 200 (:status response)) "admins can look up removed users")
        (is (= false (:active result)) "removed user should not be active")
        (is (has-values? (dissoc fixtures/user-values :password :email) result)
            "resulting user has expected values")))

    ; remove as admin, retrieve as user; should be 404
    (with-rollback-transaction [t-conn db/conn]
      (let [user (fixtures/create-test-user!)
            retriever (fixtures/create-test-user-two!)
            admin (fixtures/create-test-admin!)
            response (do (-> (session app)
                           (login-request fixtures/admin-values)
                           (remove-request user))

                         (-> (session app)
                           (login-request fixtures/user-values-two)
                           (request (format "/api/users/%d" (:user-id user)))
                           :response))
            result (response->clj response)]
        (is (= 404 (:status response)) "non-admins cannot look up removed users")))))

(deftest test-user-data-visibility
  (with-rollback-transaction [t-conn db/conn]
    (let [user (fixtures/create-test-user!)
          user-two (fixtures/create-test-user-two!)
          moderator (fixtures/create-test-moderator!)
          admin (fixtures/create-test-admin!)
          admin-two (fixtures/create-test-admin-two!)
          lookup-request
          (fn [session criteria]
            (request session "/api/users/lookup" :params criteria))]

      (testing "user looking up self"
        (let [response (-> (session app)
                         (login-request fixtures/user-values)
                         (lookup-request {:user-id (:user-id user)})
                         :response)
              result (response->clj response)]
          (is (= 200 (:status response)))
          (is (contains? result :email) "should load private information")))

      (testing "user looking up other user"
        (let [response (-> (session app)
                         (login-request fixtures/user-values)
                         (lookup-request {:user-id (:user-id user-two)})
                         :response)
              result (response->clj response)]
          (is (= 200 (:status response)))
          (is (not (contains? result :email))) "should not load private information"))

      (testing "moderator looking up user"
        (let [response (-> (session app)
                         (login-request fixtures/moderator-values)
                         (lookup-request {:user-id (:user-id user)})
                         :response)
              result (response->clj response)]
          (is (= 200 (:status response)))
          (is (contains? result :email)) "should load private information"))

      (testing "admin looking up user"
        (let [response (-> (session app)
                         (login-request fixtures/admin-values)
                         (lookup-request {:user-id (:user-id user)})
                         :response)
              result (response->clj response)]
          (is (= 200 (:status response)))
          (is (contains? result :email) "should load private information")))

      (testing "admin looking up another admin"
        (let [response (-> (session app)
                         (login-request fixtures/admin-values)
                         (lookup-request {:user-id (:user-id admin-two)})
                         :response)
              result (response->clj response)]
          (is (= 200 (:status response)))
          (is (contains? result :email) "should load private information"))))))
