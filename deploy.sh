#!/bin/bash

# EuroTCG Website Deployment Script
# This script builds and deploys the EuroTCG website using Docker

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
IMAGE_NAME="eurotcg-website"
CONTAINER_NAME="eurotcg-website"
PORT="3000"
BACKUP_DIR="/backup/eurotcg"
HEALTH_CHECK_URL="http://localhost:${PORT}/health"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info >/dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to backup current deployment
backup_deployment() {
    if [ "$1" = "--backup" ]; then
        print_status "Creating backup of current deployment..."
        
        # Create backup directory if it doesn't exist
        sudo mkdir -p "$BACKUP_DIR"
        
        # Backup current container if it exists
        if docker ps -a --format 'table {{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
            TIMESTAMP=$(date +%Y%m%d_%H%M%S)
            BACKUP_FILE="${BACKUP_DIR}/eurotcg_backup_${TIMESTAMP}.tar"
            
            print_status "Saving current container state to ${BACKUP_FILE}..."
            docker export "$CONTAINER_NAME" > "$BACKUP_FILE"
            
            if [ $? -eq 0 ]; then
                print_success "Backup created successfully: ${BACKUP_FILE}"
            else
                print_warning "Failed to create backup, but continuing with deployment..."
            fi
        else
            print_warning "No existing container found to backup."
        fi
    fi
}

# Function to build the Docker image
build_image() {
    print_status "Building Docker image..."
    
    # Build the image
    if docker build -t "$IMAGE_NAME:latest" .; then
        print_success "Docker image built successfully"
    else
        print_error "Failed to build Docker image"
        exit 1
    fi
    
    # Tag with timestamp
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    docker tag "$IMAGE_NAME:latest" "$IMAGE_NAME:$TIMESTAMP"
    print_status "Tagged image as ${IMAGE_NAME}:${TIMESTAMP}"
}

# Function to stop and remove existing container
stop_existing() {
    if docker ps --format 'table {{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
        print_status "Stopping existing container..."
        docker stop "$CONTAINER_NAME"
    fi
    
    if docker ps -a --format 'table {{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
        print_status "Removing existing container..."
        docker rm "$CONTAINER_NAME"
    fi
}

# Function to run the new container
run_container() {
    print_status "Starting new container..."
    
    docker run -d \
        --name "$CONTAINER_NAME" \
        --restart unless-stopped \
        -p "${PORT}:3000" \
        --env NODE_ENV=production \
        --health-cmd="curl -f http://localhost:3000/health || exit 1" \
        --health-interval=30s \
        --health-timeout=3s \
        --health-start-period=5s \
        --health-retries=3 \
        "$IMAGE_NAME:latest"
    
    if [ $? -eq 0 ]; then
        print_success "Container started successfully"
    else
        print_error "Failed to start container"
        exit 1
    fi
}

# Function to wait for container to be healthy
wait_for_health() {
    print_status "Waiting for container to be healthy..."
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if docker inspect --format='{{.State.Health.Status}}' "$CONTAINER_NAME" | grep -q "healthy"; then
            print_success "Container is healthy!"
            return 0
        fi
        
        if [ $attempt -eq 1 ]; then
            print_status "Waiting for health check (this may take up to 2 minutes)..."
        fi
        
        sleep 5
        attempt=$((attempt + 1))
    done
    
    print_error "Container failed to become healthy within expected time"
    return 1
}

# Function to verify deployment
verify_deployment() {
    print_status "Verifying deployment..."
    
    # Check if container is running
    if ! docker ps --format 'table {{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
        print_error "Container is not running"
        return 1
    fi
    
    # Check health endpoint if curl is available
    if command_exists curl; then
        if curl -f "$HEALTH_CHECK_URL" >/dev/null 2>&1; then
            print_success "Health check endpoint is responding"
        else
            print_warning "Health check endpoint is not responding"
            return 1
        fi
    fi
    
    # Show container status
    print_status "Container status:"
    docker ps --filter "name=${CONTAINER_NAME}" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    
    print_success "Deployment verification completed"
}

# Function to cleanup old images
cleanup() {
    if [ "$1" = "--cleanup" ]; then
        print_status "Cleaning up old images..."
        
        # Remove dangling images
        docker image prune -f
        
        # Keep only the last 3 tagged versions
        docker images "$IMAGE_NAME" --format "table {{.Tag}}" | \
        grep -E '^[0-9]{8}_[0-9]{6}$' | \
        sort -r | \
        tail -n +4 | \
        xargs -r -I {} docker rmi "${IMAGE_NAME}:{}"
        
        print_success "Cleanup completed"
    fi
}

# Function to show logs
show_logs() {
    if [ "$1" = "--logs" ]; then
        print_status "Showing container logs..."
        docker logs "$CONTAINER_NAME" --tail 50 -f
    fi
}

# Function to show usage
usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --backup    Create backup before deployment"
    echo "  --cleanup   Clean up old Docker images after deployment"
    echo "  --logs      Show container logs after deployment"
    echo "  --help      Show this help message"
    echo ""
    echo "Example:"
    echo "  $0 --backup --cleanup"
}

# Main deployment function
main() {
    print_status "Starting EuroTCG website deployment..."
    
    # Check prerequisites
    check_docker
    
    # Process command line arguments
    BACKUP=false
    CLEANUP=false
    LOGS=false
    
    for arg in "$@"; do
        case $arg in
            --backup)
                BACKUP=true
                ;;
            --cleanup)
                CLEANUP=true
                ;;
            --logs)
                LOGS=true
                ;;
            --help)
                usage
                exit 0
                ;;
            *)
                print_warning "Unknown option: $arg"
                usage
                exit 1
                ;;
        esac
    done
    
    # Backup if requested
    if [ "$BACKUP" = true ]; then
        backup_deployment --backup
    fi
    
    # Build new image
    build_image
    
    # Stop existing container
    stop_existing
    
    # Run new container
    run_container
    
    # Wait for health check
    wait_for_health
    
    # Verify deployment
    verify_deployment
    
    # Cleanup if requested
    if [ "$CLEANUP" = true ]; then
        cleanup --cleanup
    fi
    
    print_success "Deployment completed successfully!"
    print_status "Website is now available at: http://localhost:${PORT}"
    
    # Show logs if requested
    if [ "$LOGS" = true ]; then
        show_logs --logs
    fi
}

# Run main function with all arguments
main "$@"