(ns raiseyourgame.models.video
  "Namespace containing database and domain logic for video maps."
  (:require [raiseyourgame.db.core :as db]
            [bugsbio.squirrel :refer [to-sql to-clj]]
            [buddy.hashers :as hashers]
            [taoensso.timbre :refer [debug]])
  (:import java.sql.SQLException))

;; Note that the raiseyourgame.db.core namespace deals in YeSQL queries, which
;; require SQL-style snake_case params. Use to-sql for those.

(defn create!
  "Creates a video based on a params object containing the following keys:
  :user-id, :url, :title, :blurb, :description.

  On success, returns the newly created video. On failure, returns nil."
  [params]
  (try
    (-> params
      (to-sql)
      (db/create-video<! @db/conn)
      (to-clj))
    (catch SQLException e nil)))

;; Only user can really be looked up by more than one unique key; I kept the
;; same interface for all the others for consistency. The lookup methods of all
;; models return a single element. The find-x-by-y methods return sequences.
(defn lookup
  "Given a map with a :video-id key, returns the video with the supplied video
  id, or nil if none was found."
  [criteria]
  (let [results (db/find-videos-by-video-id (to-sql criteria))]
    (when-not (empty? results)
      (to-clj (first results)))))

(defn find-by-user-id
  "Returns all videos with the supplied user id."
  [user-id]
  (map to-clj (db/find-videos-by-user-id (to-sql {:user-id user-id}))))

(defn update!
  "Given a video model map, updates the database row with that id using those
  values.

  (let [updated-video (assoc video :blurb 'A battle of epic proportions!')]
    update! updated-video)

  Given a video model map and a transition function, applies the function to the
  map and updates the video in the database.

  (update! video #(assoc :videoname 'A battle of epic proportions!'))

  Given a video model map, a transition functions, and any number of additional
  arguments, applies the function to the map with those arguments and updates
  the video in the database.

  In all cases, returns the updated video if successful, nil otherwise.
  
  If an incomplete video map is supplied, mayhem will ensue. Be ready to catch
  SQLExceptions if you're doing something innovative."
  ([video]
   (let [result (db/update-video! (to-sql video))]
     ; result will be the rows affected
     (if (< 0 result) video nil)))
  ([video f]
   (update! (f video)))
  ([video f & args]
   (update! (apply (partial f video) args))))

(defn remove!
  "Removes the supplied video by setting the video's :active property to false.
  This should have the effect of making the video invisible to the public API,
  and therefore to the website, apps, etc; but it is the responsibility of API
  handlers to enforce this property."
  [video]
  (update! video assoc :active false))
