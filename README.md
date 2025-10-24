# -----------------------------
# build command : for docker containerisation
# -----------------------------
docker build -t linkflowpro:latest .

# -----------------------------
# Docker run command : containerisation
# -----------------------------

docker run -d -p 8000:8000 linkflowpro:latest

# -----------------------------
# To check running container : docker ps
# -----------------------------
# -----------------------------
# To stop running container : docker stop 749a10c9c6ef
# -----------------------------
# -----------------------------
# To emove running container : docker rm 749a10c9c6ef
# -----------------------------