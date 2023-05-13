# In the date expression below, the first term is the number of days.
# ${days} * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds

# execute the following if the --dry-run argument is supplied:
if [ "$1" = "--dry-run" ]; then
  echo "Dry run: no changes will be made. Returning list of videos older than 30 days."
  docker exec -it mongodb mongosh -u root -p example --eval 'db.videos.find({ createdAt: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } })'
else
  echo "Deleting videos older than 30 days."
  docker exec -it mongodb mongosh -u root -p example --eval 'db.videos.deleteMany({ createdAt: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } })'
fi
