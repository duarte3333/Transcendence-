// Checks collision between a rectangle and a circle
export function isRectCircleCollision(circle, rect) {
    const distX = Math.abs(circle.x - rect.x - rect.width / 2);
    const distY = Math.abs(circle.y - rect.y - rect.height / 2);

    if (distX > (rect.width / 2 + circle.radius)) { return false; }
    if (distY > (rect.height / 2 + circle.radius)) { return false; }

    if (distX <= (rect.width / 2)) { return true; } 
    if (distY <= (rect.height / 2)) { return true; }

    const dx = distX - rect.width / 2;
    const dy = distY - rect.height / 2;
    return (dx * dx + dy * dy <= (circle.radius * circle.radius));
}

export function calculateRotatedRectangleCenter(x0, y0, width, height, angle) {
    // Calculate the offset from the vertex to the center of the unrotated rectangle
    const deltaX = width / 2;
    const deltaY = height / 2;

    // Calculate the rotated offsets using the rotation matrix
    const rotatedDeltaX = deltaX * Math.cos(angle) - deltaY * Math.sin(angle);
    const rotatedDeltaY = deltaX * Math.sin(angle) + deltaY * Math.cos(angle);

    // Calculate the coordinates of the rotated center
    const centerX = x0 + rotatedDeltaX;
    const centerY = y0 + rotatedDeltaY;

    return { centerX, centerY };
}

export function isBallCollidingWithPlayer(ball, player) {
    let point = calculateRotatedRectangleCenter(player.x, player.y, player.width, player.height, player.angle);
    let px = point[0];
    let py = point[1];

    // Rotate ball's center to rectangle's local coordinate system
    const cos = Math.cos(player.angle);
    const sin = Math.sin(player.angle);
    
    const localballX = cos * (ball.x - px) - sin * (ball.y - py) + px;
    const localballY = sin * (ball.x - px) + cos * (ball.y - py) + py;
  
    // Axis-aligned rectangle bounds
    const rectLeft = px - player.width / 2;
    const rectRight = px + player.width / 2;
    const rectTop = py - player.height / 2;
    const rectBottom = py + player.height / 2;
  
    // Find the closest point on the rectangle to the ball
    const closestX = Math.max(rectLeft, Math.min(localballX, rectRight));
    const closestY = Math.max(rectTop, Math.min(localballY, rectBottom));
  
    // Calculate the distance from the ball's center to the closest point
    const distanceX = localballX - closestX;
    const distanceY = localballY - closestY;
  
    // Check if the distance is less than the circle's ball.radius
    return (distanceX * distanceX + distanceY * distanceY) <= (ball.radius * ball.radius);
  }
  