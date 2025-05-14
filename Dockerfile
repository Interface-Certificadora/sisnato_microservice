# Use the latest Node.js image as the base image
FROM node:20.17.0

# Set the working directory
WORKDIR /app
# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN yarn

# prisma cli
RUN npx prisma

# Copy the rest of the application code
COPY . .

# Update the database schema
RUN npx prisma db pull

# Generate Prisma client
RUN npx prisma generate

# Build the Next.js application
RUN yarn build

# Start the application
CMD ["yarn", "start"]