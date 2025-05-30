class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 800;
        this.canvas.height = 300;
        
        // Game state
        this.score = 0;
        this.gameOver = false;
        this.animationId = null;
        
        // Player properties
        this.player = {
            x: 50,
            y: this.canvas.height - 60,
            width: 40,
            height: 40,
            jumping: false,
            jumpForce: 15,
            gravity: 0.6,
            velocityY: 0
        };

        // Chaser properties
        this.chaser = {
            x: 0,  // Will be set relative to player
            y: this.canvas.height - 60,
            width: 40,
            height: 40,
            jumping: false,
            jumpForce: 12,
            gravity: 0.6,
            velocityY: 0,
            jumpTimer: 0,
            jumpInterval: 2000, // Time between random jumps (ms)
            baseDistance: 67.5, // Average distance (middle point between 80 and 55)
            distanceRange: 12.5, // Half the range (80 - 55) / 2
            distanceTimer: 0,
            distanceSpeed: 0.001 // Speed of distance oscillation
        };
        
        // Obstacle properties
        this.obstacles = [];
        this.obstacleTimer = 0;
        this.obstacleInterval = 1500; // milliseconds
        
        // Ground properties
        this.ground = {
            y: this.canvas.height - 20,
            height: 20
        };
        
        // Event listeners
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        
        // Add touch event listeners for mobile
        this.canvas.addEventListener('touchstart', this.handleTouch.bind(this));
        document.addEventListener('touchstart', this.handleTouch.bind(this));
        
        // Start game loop
        this.lastTime = 0;
        this.animate(0);
    }
    
    handleKeyDown(event) {
        if (event.code === 'Space') {
            this.handleJump();
        }
    }

    handleTouch(event) {
        // Prevent default touch behavior (like scrolling)
        event.preventDefault();
        this.handleJump();
    }

    handleJump() {
        if (this.gameOver) {
            this.reset();
        } else if (!this.player.jumping) {
            this.player.jumping = true;
            this.player.velocityY = -this.player.jumpForce;
        }
    }
    
    reset() {
        this.score = 0;
        this.gameOver = false;
        this.obstacles = [];
        this.player.y = this.canvas.height - 60;
        this.player.velocityY = 0;
        this.player.jumping = false;
        this.chaser.y = this.canvas.height - 60;
        this.chaser.velocityY = 0;
        this.chaser.jumping = false;
        this.chaser.distanceTimer = 0;
        document.getElementById('gameOver').classList.add('hidden');
        this.animate(0);
    }
    
    updateChaser(deltaTime) {
        // Update distance timer
        this.chaser.distanceTimer += deltaTime * this.chaser.distanceSpeed;
        
        // Calculate current distance using sine wave
        const currentDistance = this.chaser.baseDistance + 
            Math.sin(this.chaser.distanceTimer) * this.chaser.distanceRange;
        
        // Update chaser position to follow player with dynamic distance
        this.chaser.x = this.player.x - currentDistance;

        // Random jumping behavior
        this.chaser.jumpTimer += deltaTime;
        if (this.chaser.jumpTimer > this.chaser.jumpInterval) {
            if (!this.chaser.jumping) {
                this.chaser.jumping = true;
                this.chaser.velocityY = -this.chaser.jumpForce;
            }
            this.chaser.jumpTimer = 0;
        }

        // Update chaser physics
        if (this.chaser.jumping) {
            this.chaser.velocityY += this.chaser.gravity;
            this.chaser.y += this.chaser.velocityY;
            
            // Check ground collision
            if (this.chaser.y > this.canvas.height - 60) {
                this.chaser.y = this.canvas.height - 60;
                this.chaser.jumping = false;
                this.chaser.velocityY = 0;
            }
        }
    }
    
    update(deltaTime) {
        if (this.gameOver) return;
        
        // Update score
        this.score += 0.1;
        document.getElementById('score').textContent = Math.floor(this.score);
        
        // Update player
        if (this.player.jumping) {
            this.player.velocityY += this.player.gravity;
            this.player.y += this.player.velocityY;
            
            // Check ground collision
            if (this.player.y > this.canvas.height - 60) {
                this.player.y = this.canvas.height - 60;
                this.player.jumping = false;
                this.player.velocityY = 0;
            }
        }

        // Update chaser
        this.updateChaser(deltaTime);
        
        // Update obstacles
        this.obstacleTimer += deltaTime;
        if (this.obstacleTimer > this.obstacleInterval) {
            this.obstacles.push({
                x: this.canvas.width,
                y: this.canvas.height - 40,
                width: 20,
                height: 40
            });
            this.obstacleTimer = 0;
        }
        
        // Move obstacles and check for player collision
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            this.obstacles[i].x -= 5;
            
            // Remove off-screen obstacles
            if (this.obstacles[i].x + this.obstacles[i].width < 0) {
                this.obstacles.splice(i, 1);
                continue;
            }
            
            // Only check for collision with player
            if (this.checkPlayerCollision(this.obstacles[i])) {
                this.gameOver = true;
                // Move chaser to player position when game over
                this.chaser.x = this.player.x;
                this.chaser.y = this.player.y;
                document.getElementById('gameOver').classList.remove('hidden');
                cancelAnimationFrame(this.animationId);
                return;
            }
        }
    }
    
    checkPlayerCollision(obstacle) {
        return this.player.x < obstacle.x + obstacle.width &&
               this.player.x + this.player.width > obstacle.x &&
               this.player.y < obstacle.y + obstacle.height &&
               this.player.y + this.player.height > obstacle.y;
    }
    
    drawPixelatedPerson(x, y, width, height, color) {
        const pixelSize = width / 8; // Divide character into 8x8 grid
        
        // Head
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x + pixelSize * 2, y, pixelSize * 4, pixelSize * 4);
        
        // Body
        this.ctx.fillRect(x + pixelSize * 3, y + pixelSize * 4, pixelSize * 2, pixelSize * 3);
        
        // Arms
        this.ctx.fillRect(x + pixelSize, y + pixelSize * 4, pixelSize * 2, pixelSize);
        this.ctx.fillRect(x + pixelSize * 5, y + pixelSize * 4, pixelSize * 2, pixelSize);
        
        // Legs
        this.ctx.fillRect(x + pixelSize * 2, y + pixelSize * 7, pixelSize, pixelSize);
        this.ctx.fillRect(x + pixelSize * 5, y + pixelSize * 7, pixelSize, pixelSize);
        
        // Eyes
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(x + pixelSize * 3, y + pixelSize * 2, pixelSize, pixelSize);
        this.ctx.fillRect(x + pixelSize * 4, y + pixelSize * 2, pixelSize, pixelSize);
    }
    
    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw ground
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(0, this.ground.y, this.canvas.width, this.ground.height);
        
        // Draw player as pixelated person
        this.drawPixelatedPerson(this.player.x, this.player.y, this.player.width, this.player.height, '#00f');
        
        // Draw chaser
        this.ctx.fillStyle = '#f0f';
        this.ctx.fillRect(this.chaser.x, this.chaser.y, this.chaser.width, this.chaser.height);
        
        // Draw obstacles
        this.ctx.fillStyle = '#f00';
        this.obstacles.forEach(obstacle => {
            this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        });
    }
    
    animate(currentTime) {
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        this.update(deltaTime);
        this.draw();
        
        if (!this.gameOver) {
            this.animationId = requestAnimationFrame(this.animate.bind(this));
        }
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    new Game();
}); 