# Stage 1: Use Nginx as a base image
FROM nginx:1.25.3-alpine

# Copy the custom Nginx configuration file
# This tells Nginx to listen on port 8080
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copy the website files to the Nginx html directory
COPY . /usr/share/nginx/html

# Expose port 8080
EXPOSE 8080

# Command to run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
