# Use an official OpenJDK image as the base image
FROM openjdk:11

# Set the working directory inside the container
WORKDIR /app

# Default command to run Java code received via stdin
CMD ["sh", "-c", "echo $JAVA_CODE > Main.java && javac Main.java && java Main"]
