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

# to update railway  project 
railway add --database postgres


railway link

railway variables

 railway variables
╔══════════════════════ Variables for protective-surprise ═════════════════════╗
║ RAILWAY_ENVIRONMENT                     │ production                         ║
║──────────────────────────────────────────────────────────────────────────────║
║ RAILWAY_ENVIRONMENT_ID                  │ b0fca523-dea4-4d69-9ba6-           ║
║                                         │ e7a7ae6fc850                       ║
║──────────────────────────────────────────────────────────────────────────────║
║ RAILWAY_ENVIRONMENT_NAME                │ production                         ║
║──────────────────────────────────────────────────────────────────────────────║
║ RAILWAY_PRIVATE_DOMAIN                  │ protective-                        ║
║                                         │ surprise.railway.internal          ║
║──────────────────────────────────────────────────────────────────────────────║
║ RAILWAY_PROJECT_ID                      │ 3aa1a79c-19a3-4d23-897d-           ║
║                                         │ ffa0204230a8                       ║
║──────────────────────────────────────────────────────────────────────────────║
║ RAILWAY_PROJECT_NAME                    │ protective-surprise                ║
║──────────────────────────────────────────────────────────────────────────────║
║ RAILWAY_PUBLIC_DOMAIN                   │ protective-surprise-               ║
║                                         │ production.up.railway.app          ║
║──────────────────────────────────────────────────────────────────────────────║
║ RAILWAY_SERVICE_ID                      │ 116b0737-a48c-4fcb-a57b-           ║
║                                         │ bed93f546cf5                       ║
║──────────────────────────────────────────────────────────────────────────────║
║ RAILWAY_SERVICE_NAME                    │ protective-surprise                ║
║──────────────────────────────────────────────────────────────────────────────║
║ RAILWAY_SERVICE_PROTECTIVE_SURPRISE_URL │ protective-surprise-               ║
║                                         │ production.up.railway.app          ║
║──────────────────────────────────────────────────────────────────────────────║
║ RAILWAY_STATIC_URL                      │ protective-surprise-               ║
║                                         │ production.up.railway.app          ║
╚══════════════════════════════════════════════════════════════════════════════╝









# -----------------------------
# To check running container : docker ps
# -----------------------------
# -----------------------------
# To stop running container : docker stop 749a10c9c6ef
# -----------------------------
# -----------------------------
# To emove running container : docker rm 749a10c9c6ef
# -----------------------------