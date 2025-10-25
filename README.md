# -----------------------------
# List of important links
# -----------------------------
# 1 





# -----------------------------
# build command : for docker containerisation
# -----------------------------
docker build -t linkflowpro:latest .

# -----------------------------
# Docker run command : containerisation
# -----------------------------

docker run -d -p 8000:8000 linkflowpro:latest

# -----------------------------
# railway : commands
# -----------------------------

npm install -g @railway/cli

railway login

railway init

railway up

railway status

# data base management 
pip install psycopg2-binary








# -----------------------------
# To check running container : docker ps
# -----------------------------
# -----------------------------
# To stop running container : docker stop 749a10c9c6ef
# -----------------------------
# -----------------------------
# To emove running container : docker rm 749a10c9c6ef
# -----------------------------